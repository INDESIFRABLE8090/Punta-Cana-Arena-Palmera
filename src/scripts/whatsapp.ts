import { site } from '@/config/site';

/** Enlace wa.me con el mensaje ya escrito. Funciona en servidor y navegador. */
export const waLink = (message: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
