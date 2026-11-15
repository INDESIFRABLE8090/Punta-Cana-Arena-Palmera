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

function initParallax() {
  const heroMedia = document.querySelector('[data-hero-media]');
  const heroContent = document.querySelector('[data-hero-content]');
  if (heroMedia) {
    gsap.to(heroMedia, { yPercent: 9, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to(heroContent, { yPercent: -14, opacity: 0, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: '35% top', end: 'bottom top', scrub: true } });
  }
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    gsap.fromTo(el, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  const route = document.querySelector<SVGPathElement>('[data-route]');
  if (route) {
    const length = route.getTotalLength();
    gsap.set(route, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(route, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '#transporte', start: 'top 80%', end: 'bottom 60%', scrub: true } });
  }
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
    veil.style.background = sand > 0 ? 'var(--sand-50)' : '#c9f3ee';
    veil.style.opacity = Math.max(sand, splash * 0.55).toFixed(3);
    const under = smooth(0.38, 0.46, p);
    depth.textContent = `${Math.round(under * smooth(0.4, 0.95, p) * 12)} m`;
    bar.style.transform = `scaleY(${p.toFixed(3)})`;
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

export function initMotion() {
  if (prefersReducedMotion()) return;
  initSmoothScroll();
  initParallax();
  initDive();
  window.addEventListener('pcap:layout', () => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
