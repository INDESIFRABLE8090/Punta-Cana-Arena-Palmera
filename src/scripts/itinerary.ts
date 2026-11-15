import { clientData, s, announce } from './client';

/**
 * Estado del itinerario. Solo guarda qué excursiones eligió el visitante y su
 * orden (localStorage); nunca datos personales.
 */
export interface Itinerary {
  items: string[];
  transport: boolean;
}

const KEY = 'pcap:itinerary:v1';
const listeners = new Set<(state: Itinerary) => void>();
let state: Itinerary = { items: [], transport: false };

function load(): Itinerary {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Partial<Itinerary> | null;
    const valid = new Set(clientData().tours.map((x) => x.slug));
    const items = Array.isArray(raw?.items) ? [...new Set(raw.items.filter((x): x is string => typeof x === 'string' && valid.has(x)))] : [];
    return { items, transport: raw?.transport === true };
  } catch {
    return { items: [], transport: false };
  }
}

function commit(next: Itinerary) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* almacenamiento no disponible: el itinerario vive solo en esta página */
  }
  listeners.forEach((fn) => fn(state));
}

export const getItinerary = () => state;

export function subscribe(fn: (state: Itinerary) => void) {
  listeners.add(fn);
  fn(state);
}

export function toggleTour(slug: string) {
  const has = state.items.includes(slug);
  commit({ ...state, items: has ? state.items.filter((x) => x !== slug) : [...state.items, slug] });
  announce(s(has ? 'removed' : 'added'));
}

export function toggleTransport() {
  commit({ ...state, transport: !state.transport });
  announce(s(state.transport ? 'added' : 'removed'));
}

export function move(slug: string, delta: -1 | 1) {
  const from = state.items.indexOf(slug);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= state.items.length) return;
  const items = [...state.items];
  [items[from], items[to]] = [items[to]!, items[from]!];
  commit({ ...state, items });
}

/** Conecta todos los botones «añadir» de la página con el estado. */
export function initItinerary() {
  state = load();

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const add = target.closest<HTMLElement>('[data-add]');
    if (add) return toggleTour(add.dataset.add!);
    if (target.closest('[data-add-transport]')) toggleTransport();
  });

  subscribe((st) => {
    document.querySelectorAll<HTMLElement>('[data-add]').forEach((btn) => {
      const on = st.items.includes(btn.dataset.add!);
      btn.setAttribute('aria-pressed', String(on));
      const label = btn.querySelector('[data-add-label]');
      if (label) label.textContent = s(on ? 'inItinerary' : 'add');
    });
    document.querySelectorAll('[data-add-transport]').forEach((btn) => btn.setAttribute('aria-pressed', String(st.transport)));
    const total = st.items.length + (st.transport ? 1 : 0);
    document.querySelectorAll<HTMLElement>('[data-itinerary-count]').forEach((badge) => {
      badge.hidden = total === 0;
      badge.textContent = String(total);
    });
  });

  // Otra pestaña cambió el itinerario.
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      state = load();
      listeners.forEach((fn) => fn(state));
    }
  });
}
