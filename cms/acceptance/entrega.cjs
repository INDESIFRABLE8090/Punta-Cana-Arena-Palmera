/**
 * Aceptación del catálogo editorial, exclusivamente contra un estado temporal y loopback.
 * Uso desde el checkout que contiene dist/arena-seed.json:
 * CMS_PYTHON=.venv/bin/python CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node cms/acceptance/entrega.cjs
 */
'use strict';
const assert = require('node:assert/strict');
const { execFileSync, spawn } = require('node:child_process');
const { randomBytes } = require('node:crypto');
const { once } = require('node:events');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { setTimeout: delay } = require('node:timers/promises');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '../..');
const seed = path.join(root, 'dist', 'arena-seed.json');
const python = process.env.CMS_PYTHON ? path.resolve(process.env.CMS_PYTHON) : 'python3';
const state = fs.mkdtempSync(path.join(os.tmpdir(), 'arena-entrega-'));
const password = randomBytes(32).toString('base64url');
const slug = 'scuba-doo';
const editLabel = 'Scuba Doo · prueba privada';
const buildTimeout = 8 * 60_000;
let origin, env, server, browser;
const log = path.join(state, 'service.log');

async function unusedPort() {
  const listener = net.createServer();
  listener.listen(0, '127.0.0.1');
  await once(listener, 'listening');
  const port = listener.address().port;
  await new Promise(resolve => listener.close(resolve));
  return port;
}

function manage(...args) {
  execFileSync(python, ['cms/manage.py', ...args], { cwd: root, env, stdio: ['ignore', 'pipe', 'inherit'] });
}

async function stopService() {
  if (!server || server.exitCode !== null || server.signalCode !== null) return;
  const closed = once(server, 'close');
  server.kill('SIGTERM');
  await closed;
}

async function startService(port) {
  const fd = fs.openSync(log, 'a', 0o600);
  try {
    server = spawn(python, ['cms/manage.py', 'runserver', '--noreload', '127.0.0.1:' + port],
      { cwd: root, env, stdio: ['ignore', fd, fd] });
  } finally { fs.closeSync(fd); }
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error('No arrancó el CMS: ' + fs.readFileSync(log, 'utf8').slice(-1600));
    try { if ((await fetch(origin + '/admin/login/')).status === 200) return; } catch {}
    await delay(200);
  }
  throw new Error('El login local no respondió a tiempo.');
}

async function pageForEditor() {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: 'es-DO',
    serviceWorkers: 'block',
  });
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    return url.origin === origin ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  await page.goto(origin + '/admin/');
  assert.equal(new URL(page.url()).pathname, '/admin/login/');
  await page.locator('[name=username]').fill('entrega');
  await page.locator('[name=password]').fill(password);
  await page.locator('[type=submit]').click();
  await page.waitForURL(origin + '/admin/');
  return page;
}

async function openTour(page) {
  await page.goto(origin + '/admin/panel/tour/?q=' + slug);
  const link = page.locator('#result_list a[href*="/change/"]').first();
  await link.click();
  assert.equal(await page.locator('[name=slug]').inputValue(), slug);
}

async function saveDraft(page, price, offer, title) {
  await openTour(page);
  await page.locator('[name=name_es]').fill(title);
  await page.locator('[name=price]').fill(price);
  await page.locator('[name=offer]').fill(offer);
  await page.locator('[name=currency]').selectOption('USD');
  await page.locator('[name=_save]').click();
  assert.ok(new URL(page.url()).pathname.endsWith('/tour/'), 'El formulario no guardó la excursión.');
  console.log('Guardado el borrador desde 390 px.');
}

async function previewDraft(page) {
  await page.goto(origin + '/admin/entregas/');
  await page.locator('[name=action][value=preview]').click({ timeout: buildTimeout });
  await page.waitForLoadState('domcontentloaded', { timeout: buildTimeout });
  const row = page.locator('[data-revision]').first();
  const id = await row.getAttribute('data-revision');
  const link = await row.locator('a[href*="/previews/"]').getAttribute('href');
  const preview = new URL(link, origin);
  assert.equal(preview.origin, origin);
  assert.ok(preview.pathname.startsWith('/previews/' + id + '/'));
  const anon = await fetch(preview, { redirect: 'manual' });
  assert.ok([302, 303, 403, 404].includes(anon.status), 'El borrador está accesible sin autenticar.');
  console.log('Vista previa creada y protegida por autenticación.');
  return { id, base: new URL('/previews/' + id + '/', origin).href };
}

async function deliveryAction(page, id, action) {
  await page.goto(origin + '/admin/entregas/');
  await page.locator('[data-revision="' + id + '"] [name=action][value=' + action + ']').click({ timeout: buildTimeout });
  await page.waitForLoadState('domcontentloaded', { timeout: buildTimeout });
}

function expectAmount(text, n) {
  assert.match(text, new RegExp('(?:^|[^0-9])' + n + '(?:[.,]00)?(?:$|[^0-9])'), text);
}

async function verifyQuote(page, base, amount, title) {
  await page.goto(new URL('es/excursiones/scuba-doo/', base).href);
  assert.ok((await page.locator('h1').innerText()).includes(title));
  const detail = await page.locator('[data-tour-price]').innerText();
  expectAmount(detail, amount);
  await page.goto(new URL('es/', base).href);
  const quote = page.locator('form[data-quick]');
  await quote.locator('[name=tour]').selectOption(slug);
  const today = new Date();
  const year = today.getFullYear() + 1;
  await quote.locator('[name=date]').fill(year + '-06-15');
  await quote.locator('[name=people]').fill('2');
  const visible = await quote.locator('[data-quick-price]').innerText();
  expectAmount(visible, amount * 2);
  await page.evaluate(() => { window.open = url => { window.__arenaQuote = String(url); return null; }; });
  await quote.locator('button[type=submit]').click();
  const generated = await page.evaluate(() => window.__arenaQuote);
  assert.ok(generated, 'El formulario no generó una solicitud de WhatsApp.');
  const wa = new URL(generated);
  assert.equal(wa.origin, 'https://wa.me');
  assert.equal(wa.pathname, '/18097798311');
  const text = wa.searchParams.get('text');
  assert.ok(text.includes(title));
  expectAmount(text, amount * 2);
}

async function main() {
  if (!fs.existsSync(seed)) throw new Error('Compila Astro sin snapshot para generar dist/arena-seed.json.');
  const port = await unusedPort();
  origin = 'http://127.0.0.1:' + port;
  env = {
    ...process.env, ARENA_STATE_DIR: state, ARENA_LOCAL_HTTP: '1', ARENA_SITE_URL: origin,
    DJANGO_SUPERUSER_USERNAME: 'entrega', DJANGO_SUPERUSER_EMAIL: 'entrega@example.invalid',
    DJANGO_SUPERUSER_PASSWORD: password, ASTRO_TELEMETRY_DISABLED: '1',
  };
  manage('migrate', '--noinput');
  manage('collectstatic', '--noinput');
  manage('import_seed', seed);
  manage('createsuperuser', '--noinput');
  delete env.DJANGO_SUPERUSER_PASSWORD;
  await startService(port);
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH });
  const editor = await pageForEditor();
  const guest = await browser.newPage({ serviceWorkers: 'block' });
  await guest.context().route('**/*', r => new URL(r.request().url()).origin === origin ? r.continue() : r.abort());
  const live = origin + '/';
  await saveDraft(editor, '137.00', '', 'Scuba Doo');
  const first = await previewDraft(editor);
  await verifyQuote(editor, first.base, 137, 'Scuba Doo');
  await deliveryAction(editor, first.id, 'publish');
  await verifyQuote(guest, live, 137, 'Scuba Doo');
  await saveDraft(editor, '137.00', '109.00', editLabel);
  const second = await previewDraft(editor);
  assert.notEqual(second.id, first.id);
  await verifyQuote(editor, second.base, 109, editLabel);
  await verifyQuote(guest, live, 137, 'Scuba Doo');
  await deliveryAction(editor, second.id, 'publish');
  await verifyQuote(guest, live, 109, editLabel);
  console.log('Precio y oferta coinciden en ficha, cotizador y mensaje de WhatsApp. Borrador aislado de la página pública.');

  await stopService();
  await startService(port);
  await verifyQuote(guest, live, 109, editLabel);
  const resumed = await pageForEditor();
  await openTour(resumed);
  assert.equal(Number(await resumed.locator('[name=offer]').inputValue()), 109);
  await deliveryAction(resumed, first.id, 'restore');
  await openTour(resumed);
  assert.equal(await resumed.locator('[name=offer]').inputValue(), '');
  await verifyQuote(guest, live, 109, editLabel);
  await deliveryAction(resumed, first.id, 'publish');
  await verifyQuote(guest, live, 137, 'Scuba Doo');
  console.log('Historial, restauración, publicación y persistencia tras reiniciar comprobados.');
}

main().catch(err => { console.error(err); process.exitCode = 1; }).finally(async () => {
  await browser?.close();
  await stopService();
  fs.rmSync(state, { recursive: true, force: true });
});
