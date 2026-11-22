export const languages = ['es', 'en', 'pt'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'es';

export const langMeta: Record<Lang, { label: string; name: string; htmlLang: string; ogLocale: string; tourSegment: string }> = {
  es: { label: 'ES', name: 'Español', htmlLang: 'es', ogLocale: 'es_DO', tourSegment: 'excursiones' },
  en: { label: 'EN', name: 'English', htmlLang: 'en', ogLocale: 'en_US', tourSegment: 'excursions' },
  pt: { label: 'PT', name: 'Português', htmlLang: 'pt-BR', ogLocale: 'pt_BR', tourSegment: 'excursoes' },
};

export type L<T = string> = Record<Lang, T>;

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Ruta interna con la subcarpeta de despliegue aplicada. */
export const href = (path = '/') => `${base}${path.startsWith('/') ? path : `/${path}`}`;
export const homePath = (lang: Lang, hash = '') => href(`/${lang}/${hash}`);
export const legalPath = (lang: Lang, slug: string) => href(`/${lang}/legal/${slug}/`);
export const tourPath = (lang: Lang, slug: string) => href(`/${lang}/${langMeta[lang].tourSegment}/${slug}/`);
