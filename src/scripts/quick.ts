import { clientData, s, tourName, prefersReducedMotion } from './client';
import { waLink } from './whatsapp';

/** Portada: fotos que se suceden (con pausa accesible) y cotización rápida por WhatsApp. */
export function initSlides() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const slides = [...document.querySelectorAll<HTMLElement>('[data-slides] .slide')];
  const toggle = document.querySelector<HTMLButtonElement>('[data-slides-toggle]');
  if (!hero || slides.length < 2) return;
  let i = 0;
  let timer = 0;
  const next = () => {
    slides[i]!.classList.remove('is-on');
    i = (i + 1) % slides.length;
    slides[i]!.classList.add('is-on');
  };
  const play = () => {
    clearInterval(timer);
    timer = window.setInterval(next, 6500);
    hero.classList.remove('is-paused');
    toggle?.setAttribute('aria-pressed', 'false');
    toggle?.setAttribute('aria-label', toggle.dataset.labelPause!);
  };
  const pause = () => {
    clearInterval(timer);
    hero.classList.add('is-paused');
    toggle?.setAttribute('aria-pressed', 'true');
    toggle?.setAttribute('aria-label', toggle.dataset.labelPlay!);
  };
  toggle?.addEventListener('click', () => (hero.classList.contains('is-paused') ? play() : pause()));
  if (prefersReducedMotion()) {
    pause();
    return;
  }
  // Solo avanza mientras la portada está a la vista.
  new IntersectionObserver(([e]) => (e!.isIntersecting && !hero.classList.contains('is-paused') ? play() : clearInterval(timer))).observe(hero);
}

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

export function initQuick() {
  const form = document.querySelector<HTMLFormElement>('[data-quick]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-quick-status]')!;
  const note = status.textContent ?? '';
  const date = form.elements.namedItem('date') as HTMLInputElement;
  date.min = today();

  const mode = () => (new FormData(form).get('mode') === 'transfer' ? 'transfer' : 'tour');
  const sync = () => {
    form.querySelectorAll<HTMLElement>('[data-for]').forEach((el) => (el.hidden = el.dataset.for !== mode()));
  };
  form.addEventListener('change', (e) => {
    if ((e.target as HTMLInputElement).name === 'mode') sync();
  });
  form.addEventListener('input', (e) => (e.target as HTMLElement).closest('.f')?.classList.remove('is-invalid'));
  sync();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const m = mode();
    const v = {
      tour: clean(fd.get('tour'), 60),
      from: clean(fd.get('from'), 120),
      to: clean(fd.get('to'), 120),
      date: clean(fd.get('date'), 10),
      people: Number(fd.get('people')),
    };
    const bad: string[] = [];
    if (m === 'tour' && !clientData().tours.some((x) => x.slug === v.tour)) bad.push('tour');
    if (m === 'transfer' && v.from.length < 2) bad.push('from');
    if (m === 'transfer' && v.to.length < 2) bad.push('to');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v.date) || v.date < today()) bad.push('date');
    if (!Number.isInteger(v.people) || v.people < 1 || v.people > 60) bad.push('people');
    form.querySelectorAll('.f').forEach((f) => f.classList.remove('is-invalid'));
    if (bad.length) {
      bad.forEach((n) => {
        const el = form.elements.namedItem(n) as HTMLElement | null;
        el?.closest('.f')?.classList.add('is-invalid');
        el?.setAttribute('aria-invalid', 'true');
      });
      (form.elements.namedItem(bad[0]!) as HTMLElement)?.focus();
      status.textContent = s('qMissing');
      status.classList.add('is-error');
      return;
    }
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    const [y, mo, da] = v.date.split('-').map(Number);
    const tag = { es: 'es-DO', en: 'en-US', pt: 'pt-BR' }[clientData().lang];
    const nice = new Intl.DateTimeFormat(tag, { dateStyle: 'long' }).format(new Date(y!, mo! - 1, da!));
    const message =
      m === 'tour'
        ? s('qTour', { tour: tourName(v.tour), date: nice, people: v.people })
        : s('qTransfer', { from: v.from, to: v.to, date: nice, people: v.people });
    window.open(waLink(message), '_blank', 'noopener,noreferrer');
    status.classList.remove('is-error');
    status.textContent = s('sent');
    setTimeout(() => (status.textContent = note), 8000);
  });
}
