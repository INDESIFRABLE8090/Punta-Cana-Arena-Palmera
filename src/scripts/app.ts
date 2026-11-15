import { initItinerary } from './itinerary';
import { initPlanner } from './planner';
import { initAudio } from './audio';
import { initGallery } from './gallery';
import { initSlides, initQuick } from './quick';
import { prefersReducedMotion } from './client';

/** Arranque: primero lo imprescindible para interactuar; el movimiento se carga en reposo. */
function initMenu() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!header || !toggle || !menu) return;

  const set = (open: boolean) => {
    menu.hidden = !open;
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? toggle.dataset.labelClose! : toggle.dataset.labelOpen!);
    window.dispatchEvent(new CustomEvent(open ? 'pcap:lock' : 'pcap:unlock'));
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => set(menu.hidden !== false));
  menu.addEventListener('click', (e) => (e.target as HTMLElement).closest('a') && set(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      set(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 64rem)').addEventListener('change', (e) => e.matches && !menu.hidden && set(false));
}

function initReveal() {
  const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return nodes.forEach((n) => n.classList.add('is-in'));
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  nodes.forEach((n) => io.observe(n));
}

function initFilters() {
  const chips = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const chapters = [...document.querySelectorAll<HTMLElement>('[data-chapters] > [data-category]')];
  const apply = (filter: string, updateUrl: boolean) => {
    if (!chips.some((c) => c.dataset.filter === filter)) filter = 'all';
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === filter)));
    chapters.forEach((ch) => {
      ch.hidden = filter !== 'all' && ch.dataset.category !== filter;
      if (filter !== 'all') ch.querySelectorAll('[data-reveal]').forEach((n) => n.classList.add('is-in'));
    });
    // El filtro queda en la URL para poder compartir «solo excursiones de mar», por ejemplo.
    if (updateUrl) {
      const url = new URL(location.href);
      if (filter === 'all') url.searchParams.delete('filtro');
      else url.searchParams.set('filtro', filter);
      history.replaceState(history.state, '', url);
    }
    window.dispatchEvent(new CustomEvent('pcap:layout'));
  };
  chips.forEach((chip) => chip.addEventListener('click', () => apply(chip.dataset.filter!, true)));
  const initial = new URL(location.href).searchParams.get('filtro');
  if (initial) apply(initial, false);
}

function initChrome() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const fab = document.querySelector<HTMLElement>('[data-fab]');
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const planner = document.querySelector<HTMLElement>('[data-planner]');
  let last = 0;
  let heroVisible = Boolean(hero);
  let plannerVisible = false;

  const paintFab = () => fab?.classList.toggle('is-away', heroVisible || plannerVisible);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) heroVisible = e.isIntersecting;
        if (e.target === planner) plannerVisible = e.isIntersecting;
      });
      paintFab();
    }, { threshold: 0.15 });
    if (hero) io.observe(hero);
    if (planner) io.observe(planner);
  }
  paintFab();

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('is-solid', y > 24);
    // La cabecera se retira al bajar y vuelve al subir, para dejar sitio al contenido.
    const past = y > window.innerHeight * 0.9;
    if (past && y > last + 4) header?.classList.add('is-hidden');
    else if (!past || y < last - 4) header?.classList.remove('is-hidden');
    last = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

initMenu();
initItinerary();
initPlanner();
initFilters();
initReveal();
initChrome();
initAudio();
initGallery();
initSlides();
initQuick();

const idle = window.requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 200));
idle(() => void import('./motion').then((m) => m.initMotion()));
