/**
 * Control de calidad del sitio compilado. Uso: npm run build && npm test
 *
 * 1) Revisión estática de dist/: SEO, hreflang, enlaces internos, textos alternativos.
 * 2) Pruebas en navegador (Playwright + Chromium): consola, desbordes, menú, filtros,
 *    itinerario, validación del formulario, enlace de WhatsApp, idiomas, galería, sonido.
 *
 * Playwright no es dependencia del proyecto: se usa el instalado globalmente
 * (npm i -g playwright && npx playwright install chromium).
 */
import { createRequire } from 'node:module';
import { execSync, spawn } from 'node:child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const BASE = process.env.BASE_PATH ?? '/Punta-Cana-Arena-Palmera';
const PORT = 4399;
const origin = `http://localhost:${PORT}`;
const WHATSAPP = '18097798311';
const LANGS = { es: 'excursiones', en: 'excursions', pt: 'excursoes' };
const SLUGS = ['scuba-doo', 'isla-saona', 'isla-catalina', 'buggies-polaris-atv', 'scape-park', 'fun-park', 'dolphin-explorer', 'lancha-rapida', 'monkeyland', 'party-boat', 'coco-bongo'];

let passed = 0;
const failures = [];
function check(name, ok, detail = '') {
  if (ok) passed++;
  else failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
  console.log(`${ok ? '  ok ' : 'FAIL '} ${name}${ok || !detail ? '' : ` — ${detail}`}`);
}

/* ---------- 1. Revisión estática ---------- */
function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
function staticChecks() {
  console.log('\nRevisión estática de dist/');
  check('dist existe (ejecuta npm run build)', existsSync(dist));
  const pages = walk(dist).filter((f) => f.endsWith('.html'));
  check('38 páginas HTML (raíz, 404, 3 portadas, 33 fichas)', pages.length === 38, `hay ${pages.length}`);
  for (const [lang, seg] of Object.entries(LANGS)) {
    check(`portada /${lang}/`, existsSync(join(dist, lang, 'index.html')));
    const missing = SLUGS.filter((s) => !existsSync(join(dist, lang, seg, s, 'index.html')));
    check(`11 fichas en /${lang}/${seg}/`, missing.length === 0, missing.join(', '));
  }
  check('sitemap-index.xml', existsSync(join(dist, 'sitemap-index.xml')));
  check('robots.txt apunta al sitemap', existsSync(join(dist, 'robots.txt')) && readFileSync(join(dist, 'robots.txt'), 'utf8').includes('sitemap-index.xml'));

  const broken = [];
  const seo = [];
  const titles = new Map();
  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    const rel = file.slice(dist.length);
    for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (!url.startsWith(BASE + '/') && url !== BASE) continue;
      const path = decodeURI(url.slice(BASE.length).split('#')[0].split('?')[0]);
      const target = join(dist, path);
      if (!(existsSync(target) && (statSync(target).isFile() || existsSync(join(target, 'index.html'))))) broken.push(`${rel} → ${url}`);
    }
    for (const [, srcset] of html.matchAll(/srcset="([^"]+)"/g)) {
      for (const part of srcset.split(',')) {
        const url = part.trim().split(' ')[0];
        if (url.startsWith(BASE) && !existsSync(join(dist, decodeURI(url.slice(BASE.length))))) broken.push(`${rel} → ${url}`);
      }
    }
    if (/\/(es|en|pt)\//.test(rel)) {
      const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
      const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
      if (title.length < 20 || title.length > 75) seo.push(`${rel}: título de ${title.length} caracteres`);
      if (desc.length < 70 || desc.length > 165) seo.push(`${rel}: descripción de ${desc.length} caracteres`);
      if (titles.has(title)) seo.push(`${rel}: título duplicado con ${titles.get(title)}`);
      titles.set(title, rel);
      if (!/<link rel="canonical" href="https?:\/\/[^"]+"/.test(html)) seo.push(`${rel}: sin canonical`);
      if ((html.match(/rel="alternate" hreflang=/g) ?? []).length !== 4) seo.push(`${rel}: hreflang incompleto`);
      if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) seo.push(`${rel}: debe tener un único h1`);
      if (!/application\/ld\+json/.test(html)) seo.push(`${rel}: sin datos estructurados`);
      if (/<img(?![^>]*\salt=)[^>]*>/.test(html)) seo.push(`${rel}: imagen sin atributo alt`);
      if (/undefined|\[object Object\]|NaN/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) seo.push(`${rel}: texto sin resolver`);
      if (/aggregateRating|"review"|"price"/.test(html)) seo.push(`${rel}: datos estructurados no autorizados`);
    }
  }
  check('sin enlaces ni recursos internos rotos', broken.length === 0, broken.slice(0, 5).join(' | '));
  check('SEO por página (título, descripción, canonical, hreflang, h1, JSON-LD, alt)', seo.length === 0, seo.slice(0, 6).join(' | '));
}

/* ---------- 2. Pruebas en navegador ---------- */
function loadPlaywright() {
  const require = createRequire(import.meta.url);
  try {
    return require('playwright');
  } catch {
    return createRequire(join(execSync('npm root -g').toString().trim(), 'x.js'))('playwright');
  }
}
async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`${origin}${BASE}/es/`)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('El servidor de vista previa no arrancó');
}

async function browserChecks() {
  const { chromium, devices } = loadPlaywright();
  const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { cwd: root, stdio: 'ignore', detached: true });
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  try {
    await waitForServer();
    const url = (p) => `${origin}${BASE}${p}`;
    const open = async (ctxOptions, path) => {
      const ctx = await browser.newContext(ctxOptions);
      await ctx.addInitScript(() => {
        window.__opened = [];
        window.open = (u) => (window.__opened.push(String(u)), null);
      });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(url(path), { waitUntil: 'networkidle' });
      return { ctx, page, errors };
    };
    const noOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    const pixel = devices['Pixel 7'];

    console.log('\nConsola y desbordes');
    for (const [name, opts, path] of [
      ['Pixel 7 · /es/', pixel, '/es/'],
      ['Pixel 7 · /en/', pixel, '/en/'],
      ['Pixel 7 · /pt/', pixel, '/pt/'],
      ['Android pequeño 360×640 · /es/', { ...pixel, viewport: { width: 360, height: 640 } }, '/es/'],
      ['Android horizontal 800×360 · /es/', { ...pixel, viewport: { width: 800, height: 360 } }, '/es/'],
      ['Tablet 820×1180 · /es/', { viewport: { width: 820, height: 1180 }, hasTouch: true }, '/es/'],
      ['Escritorio 1440×900 · /es/', { viewport: { width: 1440, height: 900 } }, '/es/'],
      ['Pixel 7 · ficha Coco Bongo (pt)', pixel, '/pt/excursoes/coco-bongo/'],
      ['Escritorio · ficha Isla Saona (en)', { viewport: { width: 1440, height: 900 } }, '/en/excursions/isla-saona/'],
    ]) {
      const { ctx, page, errors } = await open(opts, path);
      await page.waitForTimeout(1200);
      // Recorre la página entera para disparar cargas diferidas (3D incluido).
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += 700) {
        await page.evaluate((y) => window.scrollTo(0, y), y);
        await page.waitForTimeout(120);
      }
      await page.waitForTimeout(600);
      check(`${name}: sin errores de consola`, errors.length === 0, errors.slice(0, 2).join(' | '));
      check(`${name}: sin desborde horizontal`, await noOverflow(page));
      const brokenImages = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc).length);
      check(`${name}: todas las imágenes cargan`, brokenImages === 0, `${brokenImages} rotas`);
      await ctx.close();
    }

    console.log('\nInteracción en móvil (Pixel 7, español)');
    {
      const { ctx, page } = await open(pixel, '/es/');
      check('la inmersión 3D se activa con WebGL', await page.locator('[data-dive].is-live').count() === 1);

      await page.click('[data-menu-toggle]');
      check('menú móvil: se abre', await page.locator('[data-menu]').isVisible());
      await page.keyboard.press('Escape');
      check('menú móvil: Escape lo cierra', await page.locator('[data-menu]').isHidden());

      await page.click('[data-sound]');
      check('sonido: se activa solo al pulsar', (await page.getAttribute('[data-sound]', 'aria-pressed')) === 'true');
      await page.click('[data-sound]');
      check('sonido: se desactiva', (await page.getAttribute('[data-sound]', 'aria-pressed')) === 'false');

      await page.locator('[data-filter="night"]').scrollIntoViewIfNeeded();
      await page.click('[data-filter="night"]');
      const visible = await page.locator('[data-chapters] > li:not([hidden])').count();
      check('filtro «Noche» deja 1 excursión', visible === 1, `quedan ${visible}`);
      await page.click('[data-filter="all"]');
      check('filtro «Todas» muestra las 11', (await page.locator('[data-chapters] > li:not([hidden])').count()) === 11);

      const small = await page.evaluate(() =>
        [...document.querySelectorAll('button, a.btn, .chip, [data-add]')]
          .filter((el) => el.offsetParent && !el.closest('[hidden]'))
          .map((el) => ({ h: el.getBoundingClientRect().height, w: el.getBoundingClientRect().width, t: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30) }))
          .filter((b) => b.h < 44 || b.w < 44),
      );
      check('objetivos táctiles ≥ 44 px', small.length === 0, small.slice(0, 4).map((b) => `${b.t} ${Math.round(b.w)}×${Math.round(b.h)}`).join(' | '));

      // Itinerario
      await page.locator('#itinerario').scrollIntoViewIfNeeded();
      await page.waitForTimeout(2700); // el formulario ignora envíos instantáneos (antiabuso)
      await page.click('[data-planner] button[type="submit"]');
      check('formulario vacío: no abre WhatsApp', (await page.evaluate(() => window.__opened.length)) === 0);
      check('formulario vacío: muestra errores', (await page.locator('[data-err]:not(:empty)').count()) >= 4);
      check('formulario vacío: marca campos con aria-invalid', (await page.locator('[data-planner] [aria-invalid="true"]').count()) >= 3);

      await page.click('[data-planner] [data-add="isla-saona"]');
      await page.click('[data-planner] [data-add="coco-bongo"]');
      await page.click('[data-planner] [data-add-transport]');
      check('itinerario: lista con 2 excursiones + transporte', (await page.locator('[data-itinerary-list] > li').count()) === 3);
      check('itinerario: contador de la cabecera = 3', (await page.locator('[data-itinerary-count]').first().textContent()) === '3');
      check('itinerario: el botón del capítulo queda marcado', (await page.getAttribute('[data-chapters] [data-add="isla-saona"]', 'aria-pressed')) === 'true');
      await page.click('[data-itinerary-list] > li:nth-child(2) .ctrl button:first-child');
      check('itinerario: reordenar pone Coco Bongo el día 1', (await page.locator('[data-itinerary-list] > li:first-child .name').textContent()) === 'Coco Bongo Regular');

      await page.fill('[name="route"]', 'Aeropuerto a hotel en Bávaro');
      await page.fill('[name="date"]', '2031-03-14');
      await page.fill('[name="adults"]', '2');
      await page.fill('[name="children"]', '1');
      check('niños > 0 muestra el campo de edades', await page.locator('[name="ages"]').isVisible());
      await page.fill('[name="ages"]', '8 años');
      await page.fill('[name="hotel"]', 'Hotel de prueba');
      await page.fill('[name="name"]', 'María <script>alert(1)</script>');
      await page.fill('[name="notes"]', 'Línea 1\nLínea 2');
      await page.fill('[name="date"]', '2020-01-01');
      await page.check('[name="consent"]');
      await page.click('[data-planner] button[type="submit"]');
      check('fecha pasada: se rechaza', (await page.evaluate(() => window.__opened.length)) === 0 && (await page.locator('[data-err="date"]').textContent()) !== '');
      await page.fill('[name="date"]', '2031-03-14');
      await page.click('[data-planner] button[type="submit"]');
      const opened = await page.evaluate(() => window.__opened);
      const text = opened[0] ? decodeURIComponent(opened[0].split('?text=')[1] ?? '') : '';
      check('formulario válido: abre wa.me con el número oficial', opened.length === 1 && opened[0].startsWith(`https://wa.me/${WHATSAPP}?text=`), opened[0]?.slice(0, 60));
      check('mensaje: excursiones en orden', text.indexOf('Día 1: Coco Bongo Regular') > -1 && text.indexOf('Día 1: Coco Bongo Regular') < text.indexOf('Día 2: Isla Saona'));
      check('mensaje: transporte, fecha, grupo, hotel y nombre', ['Transporte privado', 'Aeropuerto a hotel en Bávaro', '14 de marzo de 2031', 'Adultos: 2', 'Niños: 1', '8 años', 'Hotel de prueba', 'María'].every((s) => text.includes(s)), text.slice(0, 200));
      check('mensaje: aclara que es solicitud, no reserva', text.includes('solicitud de cotización'));
      check('confirmación visual tras enviar', (await page.locator('[data-status]').textContent()).includes('WhatsApp'));
      await page.click('[data-planner] button[type="submit"]');
      check('envíos repetidos: se frenan', (await page.evaluate(() => window.__opened.length)) === 1);

      // Señuelo antiabuso
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(2700);
      check('el itinerario persiste al recargar', (await page.locator('[data-itinerary-list] > li').count()) === 3);
      check('no se guardan datos personales en el navegador', await page.evaluate(() => !JSON.stringify(localStorage).includes('María')));
      await page.evaluate(() => (document.querySelector('[name="website"]').value = 'bot'));
      await page.fill('[name="route"]', 'x a y');
      await page.fill('[name="date"]', '2031-03-14');
      await page.fill('[name="hotel"]', 'Hotel');
      await page.fill('[name="name"]', 'Bot');
      await page.check('[name="consent"]');
      await page.click('[data-planner] button[type="submit"]');
      check('señuelo relleno: no envía', (await page.evaluate(() => window.__opened.length)) === 0);

      // Galería
      await page.locator('[data-shot="0"]').scrollIntoViewIfNeeded();
      await page.click('[data-shot="0"]');
      check('galería: abre el visor', await page.locator('[data-lightbox][open]').count() === 1);
      const first = await page.getAttribute('[data-lb-img]', 'src');
      await page.keyboard.press('ArrowRight');
      check('galería: flecha derecha cambia la imagen', (await page.getAttribute('[data-lb-img]', 'src')) !== first);
      await page.keyboard.press('Escape');
      check('galería: Escape cierra el visor', await page.locator('[data-lightbox][open]').count() === 0);

      const wa = await page.$$eval('[data-wa]', (els) => els.map((e) => e.href));
      check('todos los enlaces de WhatsApp usan el número oficial', wa.length >= 3 && wa.every((h) => h.startsWith(`https://wa.me/${WHATSAPP}?text=`)));
      await ctx.close();
    }

    console.log('\nIdiomas');
    for (const [lang, h1, submit, tourSeg, tourMsg] of [
      ['en', 'The Caribbean', 'Send request on WhatsApp', 'excursions', 'quote for the excursion: Saona Island'],
      ['pt', 'O Caribe', 'Enviar pedido pelo WhatsApp', 'excursoes', 'orçamento para a excursão: Ilha Saona'],
    ]) {
      const { ctx, page } = await open(pixel, `/${lang}/`);
      check(`/${lang}/: titular traducido`, (await page.locator('h1').textContent()).includes(h1));
      check(`/${lang}/: <html lang> correcto`, (await page.getAttribute('html', 'lang')) === (lang === 'pt' ? 'pt-BR' : lang));
      check(`/${lang}/: formulario traducido`, (await page.locator('[data-planner] button[type="submit"]').textContent()).includes(submit));
      await page.waitForTimeout(2700);
      await page.locator('[data-planner] button[type="submit"]').scrollIntoViewIfNeeded();
      await page.click('[data-planner] button[type="submit"]');
      const err = await page.locator('[data-err="name"]').textContent();
      check(`/${lang}/: validación traducida`, lang === 'en' ? err.includes('Enter your name') : err.includes('Escreva seu nome'), err);
      await page.goto(url(`/${lang}/${tourSeg}/isla-saona/`), { waitUntil: 'networkidle' });
      const href = decodeURIComponent(await page.getAttribute('.quote [data-wa]', 'href'));
      check(`/${lang}/: WhatsApp de la ficha identifica la excursión`, href.includes(tourMsg), href.slice(-70));
      await page.click('.quote [data-add]');
      await page.goto(url(`/${lang}/`), { waitUntil: 'networkidle' });
      check(`/${lang}/: «añadir» en la ficha llega al itinerario`, (await page.locator('[data-itinerary-list] > li').count()) === 1);
      await ctx.close();
    }
    {
      const { ctx, page } = await open({ viewport: { width: 1440, height: 900 } }, '/es/excursiones/scuba-doo/');
      await page.click('.langs a[hreflang="en"]');
      await page.waitForLoadState('networkidle');
      check('cambio de idioma conserva la página', page.url().endsWith('/en/excursions/scuba-doo/'), page.url());
      await ctx.close();
    }
    {
      const ctx = await browser.newContext({ locale: 'pt-BR' });
      const page = await ctx.newPage();
      await page.goto(url('/'), { waitUntil: 'networkidle' });
      check('la raíz redirige al idioma del navegador', page.url().endsWith('/pt/'), page.url());
      await ctx.close();
    }

    console.log('\nAccesibilidad y alternativas');
    {
      const { ctx, page, errors } = await open({ ...pixel, reducedMotion: 'reduce' }, '/es/');
      await page.waitForTimeout(800);
      check('movimiento reducido: sin modo inmersivo ni 3D', (await page.locator('[data-dive].is-live').count()) === 0 && (await page.locator('[data-dive].has-gl').count()) === 0);
      const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter((n) => getComputedStyle(n).opacity === '0').length);
      check('movimiento reducido: todo el contenido visible', hidden === 0, `${hidden} ocultos`);
      check('movimiento reducido: sin errores', errors.length === 0, errors[0]);
      await ctx.close();
    }
    {
      const ctx = await browser.newContext({ ...pixel, javaScriptEnabled: false });
      const page = await ctx.newPage();
      await page.goto(url('/es/'));
      const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter((n) => getComputedStyle(n).opacity === '0').length).catch(() => -1);
      check('sin JavaScript: contenido y enlaces de WhatsApp visibles', hidden <= 0 && (await page.locator('[data-chapters] > li').count()) === 11 && (await page.locator('[data-wa]').count()) >= 3);
      await ctx.close();
    }
    {
      const { ctx, page } = await open({ viewport: { width: 1280, height: 800 } }, '/es/');
      await page.keyboard.press('Tab');
      check('teclado: el primer foco es «Saltar al contenido»', await page.evaluate(() => document.activeElement?.classList.contains('skip-link')));
      const unnamed = await page.evaluate(() =>
        [...document.querySelectorAll('a, button, input:not([type=hidden]), textarea')].filter((el) => {
          const name = el.getAttribute('aria-label') || el.textContent?.trim() || (el.id && document.querySelector(`label[for="${el.id}"]`)?.textContent) || el.closest('label')?.textContent?.trim();
          return !name && el.getAttribute('aria-hidden') !== 'true' && el.tabIndex !== -1;
        }).length,
      );
      check('todos los controles tienen nombre accesible', unnamed === 0, `${unnamed} sin nombre`);
      await ctx.close();
    }
  } finally {
    await browser.close();
    try {
      process.kill(-server.pid);
    } catch {}
  }
}

staticChecks();
await browserChecks();
console.log(`\n${passed} comprobaciones correctas, ${failures.length} fallidas`);
if (failures.length) {
  console.log(failures.map((f) => ` - ${f}`).join('\n'));
  process.exit(1);
}
