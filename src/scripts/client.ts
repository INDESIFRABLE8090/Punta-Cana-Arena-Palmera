/** Datos que la página entrega a los scripts: idioma, textos y catálogo mínimo. */
export interface ClientData {
  lang: 'es' | 'en' | 'pt';
  whatsapp: string;
  strings: Record<string, string>;
  tours: { slug: string; name: string }[];
}

let cache: ClientData | undefined;

export function clientData(): ClientData {
  if (!cache) cache = JSON.parse(document.getElementById('client-data')?.textContent ?? '{}') as ClientData;
  return cache;
}

/** Texto traducido con sustitución de {variables}. */
export function s(key: string, vars: Record<string, string | number> = {}): string {
  const raw = clientData().strings[key] ?? key;
  return raw.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));
}

export const tourName = (slug: string) => clientData().tours.find((x) => x.slug === slug)?.name ?? slug;

export function announce(message: string) {
  const region = document.getElementById('live-region');
  if (!region) return;
  region.textContent = '';
  requestAnimationFrame(() => (region.textContent = message));
}

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
