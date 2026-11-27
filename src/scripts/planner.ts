import { clientData, s, tourName, todayISO } from './client';
import { getItinerary, subscribe, move, toggleTour, toggleTransport, type Itinerary } from './itinerary';
import { waLink } from './whatsapp';

const ICON = {
  up: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 14 6-6 6 6"/></svg>',
  down: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 10 6 6 6-6"/></svg>',
  close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
};

/** Limpia texto libre: sin caracteres de control ni espacios repetidos, con tope de longitud. */
const clean = (value: FormDataEntryValue | null, max: number) =>
  String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  const tag = { es: 'es-DO', en: 'en-US', pt: 'pt-BR' }[clientData().lang];
  return new Intl.DateTimeFormat(tag, { dateStyle: 'long' }).format(new Date(y!, m! - 1, d!));
}

interface Values {
  date: string; adults: number; children: number; ages: string; hotel: string; name: string; notes: string; route: string; consent: boolean;
}

function readValues(form: HTMLFormElement): Values {
  const fd = new FormData(form);
  return {
    date: clean(fd.get('date'), 10),
    adults: Number(fd.get('adults')),
    children: Number(fd.get('children') || 0),
    ages: clean(fd.get('ages'), 80),
    hotel: clean(fd.get('hotel'), 120),
    name: clean(fd.get('name'), 80),
    notes: clean(fd.get('notes'), 500),
    route: clean(fd.get('route'), 160),
    consent: fd.get('consent') === 'on',
  };
}

/** Devuelve los errores por campo; vacío si todo es válido. */
export function validate(v: Values, it: Itinerary): Record<string, string> {
  const e: Record<string, string> = {};
  if (it.items.length === 0 && !it.transport) e.items = s('errEmpty');
  if (it.transport && v.route.length < 3) e.route = s('errRoute');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.date) || v.date < todayISO()) e.date = s('errDate');
  if (!Number.isInteger(v.adults) || v.adults < 1 || v.adults > 60) e.adults = s('errAdults');
  if (!Number.isInteger(v.children) || v.children < 0 || v.children > 30) e.children = s('errChildren');
  if (v.children > 0 && v.ages.length < 1) e.ages = s('errAges');
  if (v.hotel.length < 2) e.hotel = s('errRequired');
  if (v.name.length < 2) e.name = s('errName');
  if (!v.consent) e.consent = s('errConsent');
  return e;
}

export function buildMessage(v: Values, it: Itinerary): string {
  const lines = [s('msgIntro'), ''];
  if (it.items.length) {
    lines.push(s('msgItinerary'));
    it.items.forEach((slug, i) => lines.push(`• ${s('msgDay', { n: i + 1 })}: ${tourName(slug)}`));
  }
  if (it.transport) lines.push(`• ${s('msgTransport')} — ${s('msgRoute')}: ${v.route}`);
  lines.push(
    '',
    `${s('msgDate')}: ${formatDate(v.date)}`,
    `${s('msgAdults')}: ${v.adults}`,
    `${s('msgChildren')}: ${v.children}${v.children > 0 ? ` (${s('msgAges')}: ${v.ages})` : ''}`,
    `${s('msgHotel')}: ${v.hotel}`,
    `${s('msgName')}: ${v.name}`,
  );
  if (v.notes) lines.push(`${s('msgNotes')}: ${v.notes}`);
  lines.push('', s('msgOutro'));
  return lines.join('\n');
}

export function initPlanner() {
  const form = document.querySelector<HTMLFormElement>('[data-planner]');
  if (!form) return;

  const list = form.querySelector<HTMLOListElement>('[data-itinerary-list]')!;
  const empty = form.querySelector<HTMLElement>('[data-itinerary-empty]')!;
  const summary = form.querySelector<HTMLElement>('[data-itinerary-summary]')!;
  const routeField = form.querySelector<HTMLElement>('[data-route-field]')!;
  const agesField = form.querySelector<HTMLElement>('[data-ages-field]')!;
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const dateInput = form.elements.namedItem('date') as HTMLInputElement;
  const childrenInput = form.elements.namedItem('children') as HTMLInputElement;
  const loadedAt = Date.now();
  let lastSent = 0;

  dateInput.min = todayISO();

  const el = (tag: string, cls: string, text?: string) => {
    const node = document.createElement(tag);
    node.className = cls;
    if (text) node.textContent = text;
    return node;
  };
  const ctrl = (icon: string, label: string, onClick: () => void, disabled = false) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = icon;
    b.setAttribute('aria-label', label);
    b.disabled = disabled;
    b.addEventListener('click', onClick);
    return b;
  };

  subscribe((it) => {
    list.replaceChildren(
      ...it.items.map((slug, i) => {
        const li = document.createElement('li');
        const name = tourName(slug);
        const controls = el('span', 'ctrl');
        controls.append(
          ctrl(ICON.up, `${s('moveUp')}: ${name}`, () => move(slug, -1), i === 0),
          ctrl(ICON.down, `${s('moveDown')}: ${name}`, () => move(slug, 1), i === it.items.length - 1),
          ctrl(ICON.close, `${s('remove')}: ${name}`, () => toggleTour(slug)),
        );
        li.append(el('span', 'day', s('day', { n: i + 1 })), el('span', 'name', name), controls);
        return li;
      }),
    );
    if (it.transport) {
      const li = el('li', 'is-transport');
      const controls = el('span', 'ctrl');
      controls.append(ctrl(ICON.close, `${s('remove')}: ${s('transport')}`, toggleTransport));
      li.append(el('span', 'day', '+'), el('span', 'name', s('transport')), controls);
      list.append(li);
    }
    const total = it.items.length;
    empty.hidden = total > 0 || it.transport;
    routeField.hidden = !it.transport;
    const parts = [];
    if (total) parts.push(total === 1 ? s('count1') : s('countN', { n: total }));
    if (it.transport) parts.push(s('transport'));
    summary.textContent = parts.join(' + ') || '—';
    if (total || it.transport) setError('items', '');
  });

  childrenInput.addEventListener('input', () => (agesField.hidden = !(Number(childrenInput.value) > 0)));

  function setError(key: string, message: string) {
    const slot = form!.querySelector<HTMLElement>(`[data-err="${key}"]`);
    if (slot) {
      slot.textContent = message;
      slot.id ||= `err-${key}`;
    }
    const input = form!.elements.namedItem(key);
    if (input instanceof HTMLElement) {
      input.setAttribute('aria-invalid', String(Boolean(message)));
      if (message && slot) input.setAttribute('aria-describedby', slot.id);
      else input.removeAttribute('aria-describedby');
    }
  }

  const FIELDS = ['items', 'route', 'date', 'adults', 'children', 'ages', 'hotel', 'name', 'consent'];
  form.addEventListener('input', (e) => {
    const name = (e.target as HTMLInputElement).name;
    if (name) setError(name, '');
  });

  function setStatus(message: string, error = false) {
    status.textContent = message;
    status.classList.toggle('is-error', error);
  }

  /** Valida y devuelve el mensaje, o null si hay errores (y los muestra). */
  function prepare(): string | null {
    const values = readValues(form!);
    const it = getItinerary();
    const errors = validate(values, it);
    FIELDS.forEach((k) => setError(k, errors[k] ?? ''));
    const first = FIELDS.find((k) => errors[k]);
    if (first) {
      setStatus(s('errFix'), true);
      const input = form!.elements.namedItem(first);
      if (input instanceof HTMLElement) input.focus();
      else form!.querySelector<HTMLElement>('[data-add]')?.focus();
      return null;
    }
    return buildMessage(values, it);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Antiabuso: señuelo relleno o envío instantáneo = automatización; además, pausa entre envíos.
    const honeypot = (form.elements.namedItem('website') as HTMLInputElement).value;
    if (honeypot || Date.now() - loadedAt < 2500) return;
    if (Date.now() - lastSent < 8000) return setStatus(s('wait'), true);
    const message = prepare();
    if (!message) return;
    lastSent = Date.now();
    // La solicitud se envía de verdad cuando la persona pulsa «enviar» en WhatsApp.
    window.open(waLink(message), '_blank', 'noopener,noreferrer');
    setStatus(s('sent'));
  });

  form.querySelector('[data-copy]')?.addEventListener('click', async () => {
    const message = prepare();
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setStatus(s('copied'));
    } catch {
      setStatus(s('copyFailed'), true);
    }
  });
}
