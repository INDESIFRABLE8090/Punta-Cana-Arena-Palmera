import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { prefersReducedMotion } from './client';
import { setUnderwater } from './audio';

gsap.registerPlugin(ScrollTrigger);

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function initSmoothScroll() {
  // En táctil Lenis deja el scroll nativo del sistema: es lo más fluido en Android.
  const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -72 }, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.addEventListener('pcap:lock', () => lenis.stop());
  window.addEventListener('pcap:unlock', () => lenis.start());
}

/** Portada: paralaje por capas con el scroll (--p) y, en escritorio, con el puntero (--mx/--my). */
function initHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => hero.style.setProperty('--p', self.progress.toFixed(4)),
    });
    if (window.matchMedia('(pointer: fine) and (min-width: 64rem)').matches) {
      let tx = 0, ty = 0, cx = 0, cy = 0;
      hero.addEventListener('pointermove', (ev) => {
        const r = hero.getBoundingClientRect();
        tx = ((ev.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((ev.clientY - r.top) / r.height - 0.5) * 2;
      });
      hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
      gsap.ticker.add(() => {
        const dx = tx - cx, dy = ty - cy;
        if (Math.abs(dx) < 0.0005 && Math.abs(dy) < 0.0005) return;
        cx += dx * 0.06;
        cy += dy * 0.06;
        hero.style.setProperty('--mx', cx.toFixed(4));
        hero.style.setProperty('--my', cy.toFixed(4));
      });
    }
  }
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    gsap.fromTo(el, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/** Banda tipográfica: cada línea se desliza con el scroll en sentidos opuestos. */
function initMarquee() {
  document.querySelectorAll<HTMLElement>('[data-mq]').forEach((ln) => {
    const dir = Number(ln.dataset.mq);
    gsap.fromTo(ln, { xPercent: dir > 0 ? -2 : -38 }, { xPercent: dir > 0 ? -30 : -8, ease: 'none', scrollTrigger: { trigger: ln.closest('[data-marquee]'), start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
  });
}

/** Cursor propio en escritorio: anillo con inercia que crece sobre enlaces y muestra «Ver» sobre fotos. */
function initCursor() {
  if (!window.matchMedia('(pointer: fine) and (min-width: 64rem)').matches) return;
  const dot = document.createElement('div');
  dot.className = 'cursor';
  dot.setAttribute('aria-hidden', 'true');
  dot.innerHTML = '<span></span>';
  document.body.append(dot);
  document.documentElement.classList.add('has-cursor');
  const label = dot.firstElementChild as HTMLElement;
  const xTo = gsap.quickTo(dot, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(dot, 'y', { duration: 0.35, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); dot.classList.add('is-on'); }, { passive: true });
  document.addEventListener('pointerleave', () => dot.classList.remove('is-on'));
  document.addEventListener('pointerover', (e) => {
    const t = e.target as Element;
    const view = t.closest('[data-index-link], [data-shot]');
    const link = t.closest('a, button, label, select, input');
    dot.classList.toggle('is-view', Boolean(view));
    dot.classList.toggle('is-link', Boolean(link) && !view);
    label.textContent = view ? (document.documentElement.lang.startsWith('en') ? 'View' : 'Ver') : '';
  });
}

/** Galería: cada escena fijada asienta su foto con el scroll y muestra su texto al llegar. */
function initScenes() {
  gsap.utils.toArray<HTMLElement>('[data-scene]').forEach((scene) => {
    scene.classList.add('is-pending');
    const img = scene.querySelector('img');
    if (img) gsap.fromTo(img, { scale: 1.16 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: scene, start: 'top bottom', end: 'top top', scrub: true } });
    ScrollTrigger.create({ trigger: scene, start: 'top 60%', onEnter: () => scene.classList.remove('is-pending'), onLeaveBack: () => scene.classList.add('is-pending') });
  });
}

/** Inmersión: sincroniza el scroll con la cámara 3D, los textos y el sonido. */
function initDive() {
  const dive = document.querySelector<HTMLElement>('[data-dive].is-live');
  if (!dive) return;
  const lines = [...dive.querySelectorAll<HTMLElement>('[data-dive-line]')];
  const veil = dive.querySelector<HTMLElement>('[data-dive-veil]')!;
  const depth = dive.querySelector<HTMLElement>('[data-dive-depth]')!;
  const bar = dive.querySelector<HTMLElement>('[data-dive-bar]')!;
  const windows: [number, number][] = [[0.03, 0.24], [0.28, 0.46], [0.5, 0.7], [0.73, 0.91]];
  let scene: { setProgress(p: number): void } | null = null;

  const render = (p: number) => {
    lines.forEach((line, i) => {
      const [a, b] = windows[i]!;
      const span = b - a;
      const o = smooth(a, a + span * 0.3, p) * (1 - smooth(b - span * 0.3, b, p));
      line.style.opacity = o.toFixed(3);
      line.style.transform = `translateY(calc(-50% + ${((0.5 - (p - a) / span) * 60).toFixed(1)}px))`;
    });
    // Destello al cruzar la superficie y fundido a arena al llegar al fondo.
    const splash = smooth(0.36, 0.4, p) * (1 - smooth(0.4, 0.47, p));
    const sand = smooth(0.9, 1, p);
    // Al final la escena funde al océano profundo, que continúa en la sección de transporte.
    veil.style.background = sand > 0 ? 'var(--ocean-950)' : '#c9f3ee';
    veil.style.opacity = Math.max(sand, splash * 0.55).toFixed(3);
    const under = smooth(0.38, 0.46, p);
    depth.textContent = `${Math.round(under * smooth(0.4, 0.95, p) * 12)} m`;
    bar.style.transform = `scaleY(${p.toFixed(3)})`;
    // Sin WebGL: el póster del atardecer se cubre de océano a medida que se baja.
    if (!scene) dive.style.setProperty('--deep', smooth(0.2, 0.55, p).toFixed(3));
    setUnderwater(under);
    scene?.setProgress(p);
  };

  const trigger = ScrollTrigger.create({
    trigger: dive,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => render(self.progress),
    onToggle: (self) => {
      if (!self.isActive) setUnderwater(0);
    },
  });
  render(trigger.progress);

  if (dive.dataset.gl !== '1') return;
  // La escena 3D solo se descarga cuando la inmersión está cerca de verse.
  const io = new IntersectionObserver(
    async (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      try {
        const { createOceanScene } = await import('./ocean/scene');
        scene = createOceanScene(dive.querySelector<HTMLCanvasElement>('[data-dive-canvas]')!);
        scene.setProgress(trigger.progress);
        dive.classList.add('has-gl');
      } catch (error) {
        console.warn('Escena 3D no disponible; se mantiene la versión con imagen.', error);
      }
    },
    { rootMargin: '100% 0px' },
  );
  io.observe(dive);
}


/**
 * Capítulos fotográficos: la sección se fija y cada foto se descubre desde abajo sobre la anterior
 * (clip-path), asentándose desde un ligero zoom; el panel cambia de capítulo a mitad del barrido.
 * Solo en pantallas de 600 px de alto o más; si no, se queda la versión en reposo (fotos en rejilla).
 */
function initPhotoChapters() {
  const root = document.querySelector<HTMLElement>('[data-photo-chapters]');
  if (!root || window.innerHeight < 600) return;
  const box = root.querySelector<HTMLElement>('.pc')!;
  const list = root.querySelector<HTMLElement>('.pc__list')!;
  const chapters = [...root.querySelectorAll<HTMLElement>('.pc__ch')];
  const pics = chapters.map((c) => c.querySelector<HTMLElement>('.pc__pic')!);
  const n = chapters.length;
  if (n < 2 || pics.some((p) => !p)) return;

  const stage = document.createElement('div');
  stage.className = 'pc__stage';
  const panel = document.createElement('div');
  panel.className = 'pc__panel';
  const count = document.createElement('p');
  count.className = 'pc__count';
  count.setAttribute('aria-hidden', 'true');
  panel.append(count, list);
  pics.forEach((p) => stage.append(p));
  stage.append(panel);
  box.append(stage);
  root.classList.add('is-live');

  const zoom = 1.06;
  const pad = (v: number) => String(v).padStart(2, '0');
  let on = -1;
  const draw = (p: number) => {
    const seg = 1 / n;
    let k = 0;
    pics.forEach((pic, i) => {
      const u = i === 0 ? 1 : Math.min(1, Math.max(0, (p - (i - 0.25) * seg) / (0.45 * seg)));
      const e = 1 - Math.pow(1 - u, 3);
      pic.style.setProperty('--c', `${((1 - e) * 100).toFixed(2)}%`);
      pic.style.setProperty('--z', (zoom - (zoom - 1) * e).toFixed(4));
      if (u >= 0.5) k = i;
    });
    if (k !== on) {
      on = k;
      chapters.forEach((c, i) => c.classList.toggle('is-on', i === k));
      count.textContent = `${pad(k + 1)} / ${pad(n)}`;
    }
  };
  draw(0);
  ScrollTrigger.create({ trigger: root, start: 'top top', end: 'bottom bottom', onUpdate: (self) => draw(self.progress) });
  ScrollTrigger.refresh();
}

export function initMotion() {
  if (prefersReducedMotion()) return;
  initSmoothScroll();
  initHero();
  initMarquee();
  initScenes();
  initCursor();
  initDive();
  initPhotoChapters();
  window.addEventListener('pcap:layout', () => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
