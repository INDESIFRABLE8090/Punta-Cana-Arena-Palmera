import { waLink } from './whatsapp';
import { initItinerary } from './itinerary';
import { initPlanner } from './planner';
import { initAudio } from './audio';
import { initGallery } from './gallery';
import { initQuick } from './quick';
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
  const quote = document.querySelector<HTMLElement>('[data-quick]');
  let last = 0;
  let heroVisible = Boolean(hero);
  let plannerVisible = false;
  let quoteVisible = false;

  // El botón flotante se retira donde ya hay una acción de WhatsApp a la vista (portada, cotizador, planificador).
  const paintFab = () => fab?.classList.toggle('is-away', heroVisible || plannerVisible || quoteVisible);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === hero) heroVisible = e.isIntersecting;
        if (e.target === planner) plannerVisible = e.isIntersecting;
        if (e.target === quote) quoteVisible = e.isIntersecting;
      });
      paintFab();
    }, { threshold: 0.15 });
    if (hero) io.observe(hero);
    if (planner) io.observe(planner);
    if (quote) io.observe(quote);
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

/** Billete de transporte: rellena el billete en vivo y prepara el mensaje de WhatsApp con los datos. */
function initTicket() {
  const form = document.querySelector<HTMLFormElement>('[data-ticket]');
  if (!form) return;
  const send = form.querySelector<HTMLAnchorElement>('[data-ticket-send]')!;
  const code = (v: string) => (v.trim() ? v.trim().replace(/[^\p{L}\p{N} ]/gu, '').slice(0, 3).toUpperCase() : '—');
  const f = form.dataset;
  const update = () => {
    const v = (n: string) => (form.elements.namedItem(n) as HTMLInputElement).value.trim();
    form.querySelector('[data-code="from"]')!.textContent = code(v('from'));
    form.querySelector('[data-code="to"]')!.textContent = code(v('to'));
    const lines = [f.msg!, v('from') && `${f.lFrom}: ${v('from')}`, v('to') && `${f.lTo}: ${v('to')}`, v('date') && `${f.lDate}: ${v('date')}`, v('people') && `${f.lPeople}: ${v('people')}`].filter(Boolean);
    send.href = waLink(lines.join('\n'));
  };
  form.addEventListener('input', update);
  form.addEventListener('submit', (e) => e.preventDefault());
  if (prefersReducedMotion()) form.querySelectorAll('animateMotion').forEach((a) => a.remove());
  update();
}

/** Índice de experiencias: activa la fila bajo el cursor, el foco o el centro de la pantalla y su foto. */
function initIndex() {
  const root = document.querySelector<HTMLElement>('[data-index]');
  if (!root) return;
  const rows = [...root.querySelectorAll<HTMLElement>('[data-chapters] > li')];
  const previews = new Map([...root.querySelectorAll<HTMLElement>('[data-preview]')].map((p) => [p.dataset.preview!, p]));
  let current = '';
  const activate = (row: HTMLElement) => {
    const slug = row.dataset.slug!;
    if (slug === current) return;
    current = slug;
    rows.forEach((r) => r.classList.toggle('is-active', r === row));
    previews.forEach((p, k) => p.classList.toggle('is-on', k === slug));
    // Carga la foto activa y la siguiente sin esperar al «lazy» del navegador.
    const i = rows.indexOf(row);
    [rows[i], rows[i + 1]].forEach((r) => previews.get(r?.dataset.slug ?? '')?.querySelector('img')?.setAttribute('loading', 'eager'));
  };
  rows.forEach((row) => {
    row.addEventListener('pointerenter', () => activate(row));
    row.addEventListener('focusin', () => activate(row));
  });
  if (!('IntersectionObserver' in window)) return rows.forEach((r) => r.classList.add('is-in'));
  // Revelado de fotos en móvil y fila activa al pasar por el centro de la pantalla.
  const reveal = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), reveal.unobserve(e.target))), { threshold: 0.2 });
  const center = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && activate(e.target as HTMLElement)), { rootMargin: '-45% 0px -45% 0px' });
  rows.forEach((r) => { reveal.observe(r); center.observe(r); });
}

initMenu();
initItinerary();
initPlanner();
initFilters();
initIndex();
initTicket();
initReveal();
initChrome();
initAudio();
initGallery();
initQuick();

const idle = window.requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 200));
idle(() => void import('./motion').then((m) => m.initMotion()));
