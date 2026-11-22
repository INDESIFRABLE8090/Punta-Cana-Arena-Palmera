import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  ColorManagement,
  LinearSRGBColorSpace,
  DoubleSide,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { SKY_GLSL, waterVertex, waterFragment, skyVertex, skyFragment, bedVertex, bedFragment, rayVertex, rayFragment, dustVertex, dustFragment } from './shaders';

/**
 * Escena de la inmersión: océano procedural (sin modelos ni texturas externas).
 * La cámara recorre una ruta fija controlada por el progreso del scroll (0–1):
 * horizonte → superficie → bajo el agua → fondo de arena.
 */
interface Tier {
  grid: number;
  dpr: number;
  dust: number;
  rays: number;
}

function pickTier(): Tier {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  const dpr = window.devicePixelRatio || 1;
  if (memory <= 3 || cores <= 4) return { grid: 72, dpr: 1, dust: 120, rays: 4 };
  if (small) return { grid: 112, dpr: Math.min(dpr, 1.5), dust: 220, rays: 6 };
  return { grid: 180, dpr: Math.min(dpr, 2), dust: 420, rays: 8 };
}

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function createOceanScene(canvas: HTMLCanvasElement) {
  const tier = pickTier();
  const renderer = new WebGLRenderer({ canvas, antialias: tier.dpr <= 1, powerPreference: 'high-performance', alpha: false });
  let dpr = tier.dpr;
  renderer.setPixelRatio(dpr);
  // Los shaders escriben el color final directamente: sin conversión de espacio de color.
  ColorManagement.enabled = false;
  renderer.outputColorSpace = LinearSRGBColorSpace;

  const scene = new Scene();
  const camera = new PerspectiveCamera(55, 1, 0.05, 900);
  const sun = new Vector3(0.46, 0.17, -1).normalize();
  const fogColor = new Color(0x0a6f86);

  const shared = {
    uTime: { value: 0 },
    uSun: { value: sun },
    uUnder: { value: 0 },
    uFog: { value: fogColor },
    uDepth: { value: 0 },
  };

  // Cielo
  const sky = new Mesh(
    new SphereGeometry(600, 24, 16),
    new ShaderMaterial({ uniforms: shared, vertexShader: skyVertex, fragmentShader: SKY_GLSL + skyFragment, side: BackSide, depthWrite: false }),
  );
  scene.add(sky);

  // Superficie del mar: olas Gerstner en el vértice, Fresnel y reflejo del cielo en el fragmento.
  const water = new Mesh(
    new PlaneGeometry(520, 520, tier.grid, tier.grid),
    new ShaderMaterial({ uniforms: shared, vertexShader: waterVertex, fragmentShader: SKY_GLSL + waterFragment, side: DoubleSide }),
  );
  water.frustumCulled = false;
  scene.add(water);

  // Fondo de arena con cáusticas
  const bed = new Mesh(
    new PlaneGeometry(260, 260, 1, 1),
    new ShaderMaterial({ uniforms: shared, vertexShader: bedVertex, fragmentShader: bedFragment }),
  );
  bed.rotation.x = -Math.PI / 2;
  bed.position.y = -8;
  bed.frustumCulled = false;
  scene.add(bed);

  // Rayos de luz bajo el agua
  const rayMaterial = new ShaderMaterial({
    uniforms: shared,
    vertexShader: rayVertex,
    fragmentShader: rayFragment,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
    side: DoubleSide,
  });
  const rays: Mesh[] = [];
  for (let i = 0; i < tier.rays; i++) {
    const ray = new Mesh(new PlaneGeometry(2.2 + (i % 3) * 1.4, 16), rayMaterial);
    const angle = (i / tier.rays) * Math.PI * 1.3 - Math.PI * 0.65;
    ray.position.set(Math.sin(angle) * (9 + (i % 4) * 4), -4, -14 - Math.cos(angle) * (6 + (i % 3) * 5));
    ray.rotation.set(0, angle * 0.4, 0.38);
    ray.userData.z = ray.position.z;
    rays.push(ray);
    scene.add(ray);
  }

  // Partículas en suspensión
  const dustGeometry = new BufferGeometry();
  const seeds = new Float32Array(tier.dust * 3);
  for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
  dustGeometry.setAttribute('position', new BufferAttribute(seeds, 3));
  const dust = new Points(
    dustGeometry,
    new ShaderMaterial({
      uniforms: { ...shared, uScale: { value: 1 }, uCam: { value: camera.position } },
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
  dust.frustumCulled = false;
  scene.add(dust);

  let progress = 0;
  let eased = 0;
  let visible = false;
  let frame = 0;
  let last = performance.now();
  let slowFrames = 0;
  const look = new Vector3();
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // En vertical se abre el campo de visión para no perder horizonte.
    camera.fov = w < h ? 68 : 52;
    camera.updateProjectionMatrix();
    (dust.material as ShaderMaterial).uniforms.uScale!.value = h * dpr;
  }

  function placeCamera(p: number, time: number) {
    const y =
      p < 0.3 ? mix(2.7, 1.0, smooth(0, 0.3, p)) : p < 0.48 ? mix(1.0, -1.7, smooth(0.3, 0.48, p)) : mix(-1.7, -5.9, smooth(0.48, 1, p));
    const bob = Math.sin(time * 0.7) * 0.06 * (1 - smooth(0.3, 0.45, p));
    camera.position.set(Math.sin(time * 0.12) * 0.4, y + bob, -p * 26);
    // Inclinación: horizonte → mirar hacia la superficie desde abajo → bajar la vista al fondo.
    const pitch = -0.05 + 0.34 * smooth(0.44, 0.62, p) - 1.25 * smooth(0.68, 1, p);
    const yaw = -0.1 + pointer.x * 0.06 + 0.1 * smooth(0.5, 1, p);
    look.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch) + pointer.y * 0.03, -Math.cos(yaw) * Math.cos(pitch));
    camera.lookAt(look.add(camera.position));
    camera.rotation.z = Math.sin(time * 0.5) * 0.012;

    const under = camera.position.y < 0 ? 1 : 0;
    shared.uUnder.value = under;
    shared.uDepth.value = Math.max(0, -camera.position.y);
    sky.visible = !under;
    sky.position.copy(camera.position);
    water.position.set(camera.position.x, 0, camera.position.z);
    bed.position.x = camera.position.x;
    bed.position.z = camera.position.z;
    rays.forEach((ray) => {
      ray.visible = under === 1;
      ray.position.z = camera.position.z + ray.userData.z;
    });
    dust.visible = under === 1;
    fogColor.setRGB(mix(0.05, 0.02, shared.uDepth.value / 6), mix(0.5, 0.36, shared.uDepth.value / 6), mix(0.6, 0.5, shared.uDepth.value / 6));
    renderer.setClearColor(under ? fogColor : 0xf3c9a4);
  }

  function tick(now: number) {
    frame = requestAnimationFrame(tick);
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    shared.uTime.value += dt;
    eased += (progress - eased) * Math.min(1, dt * 7);
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    placeCamera(eased, shared.uTime.value);
    renderer.render(scene, camera);

    // Si el dispositivo no llega a ~28 fps de forma sostenida, se baja la resolución.
    slowFrames = dt > 0.036 ? slowFrames + 1 : Math.max(0, slowFrames - 2);
    if (slowFrames > 45 && dpr > 0.75) {
      dpr = Math.max(0.75, dpr - 0.25);
      renderer.setPixelRatio(dpr);
      resize();
      slowFrames = 0;
    }
  }

  function setRunning(on: boolean) {
    if (on && !frame) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    } else if (!on && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  // Solo se dibuja mientras la sección está en pantalla y la pestaña visible.
  const io = new IntersectionObserver((entries) => {
    visible = entries[0]!.isIntersecting;
    setRunning(visible && !document.hidden);
  });
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => setRunning(visible && !document.hidden));
  new ResizeObserver(resize).observe(canvas);
  if (window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('pointermove', (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    }, { passive: true });
  }
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    setRunning(false);
  });
  canvas.addEventListener('webglcontextrestored', () => setRunning(visible));

  resize();
  placeCamera(0, 0);
  renderer.render(scene, camera);

  return {
    setProgress(p: number) {
      progress = p;
    },
  };
}
