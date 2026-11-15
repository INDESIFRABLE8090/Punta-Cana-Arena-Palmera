import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// URL pública y subcarpeta. Al pasar a dominio propio: SITE_URL=https://dominio.com BASE_PATH=/
const site = process.env.SITE_URL ?? 'https://indesifrable8090.github.io';
const base = process.env.BASE_PATH ?? '/Punta-Cana-Arena-Palmera';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en', pt: 'pt-BR' } },
      filter: (page) => !page.endsWith('/404/'),
    }),
  ],
  build: { inlineStylesheets: 'auto' },
  vite: { build: { chunkSizeWarningLimit: 700 } },
});
