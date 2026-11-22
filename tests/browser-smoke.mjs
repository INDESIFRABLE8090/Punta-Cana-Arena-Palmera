/**
 * Zero-API-key independent browser smoke against the premium Astro site.
 * GitHub Actions only; no publication or extraction of client images.
 * This checks actual Chromium rendering on mobile and desktop.
 */
import { spawn, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const PORT = 4499;
const BASE = process.env.BASE_PATH ?? '/Punta-Cana-Arena-Palmera';
const ORIGIN = `http://127.0.0.1:${PORT}`;
let browser;
let server;
const issues = [];

function ensure(ok, message) {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${message}`);
  if (!ok) issues.push(message);
}

async function ready(timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(`${ORIGIN}${BASE}/es/`, { signal: AbortSignal.timeout(2000) });
      if (res.status === 200) return;
    } catch { /* warmup */ }
    if (server?.exitCode !== null) throw new Error('Preview exited before readiness');
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('Preview failed to become ready');
}

async function main() {
  if (!existsSync(join(root, 'dist', 'es', 'index.html')))
    throw new Error('Run npm run build first');
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch {
    const npmRoot = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
    ({ chromium } = createRequire(join(npmRoot, 'smoke.cjs'))('playwright'));
  }

  server = spawn(join(root, 'node_modules', '.bin', 'astro'),
    ['preview', '--host', '127.0.0.1', '--port', String(PORT)],
    { cwd: root, stdio: 'ignore' });
  await ready();

  browser = await chromium.launch({
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });

  for (const [kind, options] of [
    ['mobile', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }],
    ['desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }],
  ]) {
    const ctx = await browser.newContext({ ...options, reducedMotion: 'reduce' });
    try {
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message.slice(0, 150)));
      const response = await page.goto(`${ORIGIN}${BASE}/es/`,
        { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.locator('h1').waitFor({ state: 'visible', timeout: 20000 });
      ensure(response?.status() === 200, `${kind}: homepage HTTP 200`);
      ensure((await page.locator('h1').count()) === 1, `${kind}: exactly one h1`);
      ensure((await page.locator('[data-chapters] > li').count()) === 11,
        `${kind}: 11 excursion cards rendered`);
      ensure((await page.locator('[data-wa]').count()) >= 3,
        `${kind}: WhatsApp enquiry links rendered`);
      const horizontalOverflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - innerWidth);
      ensure(horizontalOverflow <= 4, `${kind}: no horizontal overflow (${horizontalOverflow}px)`);
      ensure(errors.length === 0, `${kind}: no JS page errors ${errors.slice(0, 2).join('; ')}`);

      // No credit card, PII, real WhatsApp submission or external requests.
      if (kind === 'mobile') {
        const toggle = page.locator('[data-menu-toggle]');
        await toggle.click({ timeout: 15000 });
        ensure(await page.locator('[data-menu]').isVisible(), 'mobile: navigation opens');
        await page.keyboard.press('Escape');
        ensure(await page.locator('[data-menu]').isHidden(), 'mobile: navigation closes with Escape');
      }
    } finally {
      await ctx.close();
    }
  }
  for (const lang of ['en', 'pt']) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
      reducedMotion: 'reduce',
    });
    try {
      const page = await ctx.newPage();
      const response = await page.goto(`${ORIGIN}${BASE}/${lang}/`,
        { waitUntil: 'domcontentloaded', timeout: 45000 });
      ensure(response?.status() === 200, `${lang}: localized homepage HTTP 200`);
      ensure((await page.locator('h1').count()) === 1, `${lang}: h1 rendered`);
      ensure((await page.locator('[data-chapters] > li').count()) === 11,
        `${lang}: all excursion cards rendered`);
    } finally {
      await ctx.close();
    }
  }
}

try {
  await main();
} finally {
  if (browser) await browser.close();
  if (server && server.exitCode === null) {
    server.kill('SIGTERM');
    await Promise.race([
      new Promise((resolve) => server.once('close', resolve)),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);
    if (server.exitCode === null) server.kill('SIGKILL');
  }
}
console.log(`Browser smoke: ${issues.length} failed checks`);
if (issues.length) process.exitCode = 1;
