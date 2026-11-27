/** Mantiene un solo vídeo decorativo activo. El póster también funciona sin codecs o sin observador. */
export function initLazyVideos() {
  const films = [...document.querySelectorAll<HTMLVideoElement>('[data-lazy-video]')];
  if (!films.length || !('IntersectionObserver' in window)) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
  const visible = new Map<HTMLVideoElement, number>();
  let active: HTMLVideoElement | undefined;

  function update() {
    let next: HTMLVideoElement | undefined;
    if (!document.hidden && !motion.matches && !connection?.saveData) {
      for (const film of films) {
        const ratio = visible.get(film) ?? 0;
        if (ratio > (next ? visible.get(next)! : 0)) next = film;
      }
    }
    if (next === active) return;
    active?.pause();
    active?.classList.remove('is-on');
    active = next;
    if (!next) return;

    if (!next.hasAttribute('src')) {
      const mobile = next.dataset.srcSm;
      if (!mobile) return;
      if (next.canPlayType('video/mp4; codecs="avc1.640028"')) {
        next.src = matchMedia('(min-width: 64rem)').matches ? next.dataset.srcLg ?? mobile : mobile;
      } else if (next.canPlayType('video/webm; codecs="vp9"')) {
        next.src = mobile.replace(/\.mp4$/, '.webm');
      } else return;
    }
    void next.play().catch(() => { /* El póster sigue visible si el navegador impide el autoplay. */ });
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) visible.set(entry.target as HTMLVideoElement, entry.intersectionRatio);
    update();
  }, { threshold: [0, 0.05, 0.25, 0.5, 0.75, 1] });
  for (const film of films) {
    film.addEventListener('playing', () => film.classList.toggle('is-on', film === active && !film.paused));
    film.addEventListener('error', () => film.classList.remove('is-on'));
    observer.observe(film);
  }
  document.addEventListener('visibilitychange', update);
  motion.addEventListener('change', update);
  connection?.addEventListener?.('change', update);
}
