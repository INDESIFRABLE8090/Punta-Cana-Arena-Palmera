/**
 * Private preview proof for Beyond Paradise Director Cut.
 * No deploy, no production domain, no accounts, no client secrets.
 * Produces viewport screenshots as Actions artifacts for independent review.
 */
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const port = 4322;
const base = `http://127.0.0.1:${port}/Punta-Cana-Arena-Palmera`;
const output = 'artifacts/beyond-paradise-director-cut';
await mkdir(output, { recursive: true });

const server = spawn('npm', ['run', 'preview', '--', '--port', String(port), '--host', '127.0.0.1'], {
  cwd: process.cwd(),
  env: { ...process.env, CI: 'true' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
server.stdout.on('data', (chunk) => { serverLog += chunk.toString().slice(0, 1600); });
server.stderr.on('data', (chunk) => { serverLog += chunk.toString().slice(0, 1600); });

const ready = async () => {
  for (let i = 0; i < 45; i++) {
    if (server.exitCode !== null) throw new Error(`Astro preview exited: ${server.exitCode}. ${serverLog.slice(-1500)}`);
    try {
      const response = await fetch(`${base}/es/`, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return;
    } catch { /* preview is starting */ }
    await delay(800);
  }
  throw new Error(`Astro preview did not start: ${serverLog.slice(-1500)}`);
};

let browser;
try {
  await ready();
  browser = await chromium.launch({ headless: true });

  for (const language of ['es', 'en', 'pt']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
    const failures = [];
    page.on('pageerror', (error) => failures.push(error.message));
    const res = await page.goto(`${base}/${language}/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    if (!res || !res.ok()) throw new Error(`${language} HTTP ${res?.status()}`);
    if (await page.locator('h1').count() !== 1) throw new Error(`${language}: requires exactly one h1`);
    if (await page.locator('.director-hero').count() !== 1) throw new Error(`${language}: director hero missing`);
    if (await page.locator('.threshold').count() !== 1) throw new Error(`${language}: storytelling scene missing`);
    await page.waitForTimeout(1800);
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflows > 3) throw new Error(`${language}: horizontal overflow ${overflows}px`);
    if (failures.length) throw new Error(`${language}: JS page errors: ${failures.join('; ').slice(0, 800)}`);
    if (language === 'es') {
      await page.screenshot({ path: `${output}/mobile-hero-390x844.png`, animations: 'disabled' });
      await page.locator('.threshold').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${output}/mobile-story-390x844.png`, animations: 'disabled' });
    }
    console.log(`PASS: locale ${language}, 390x844, hero, editorial interlude, JS, no horizontal overflow`);
    await page.close();
  }

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const errors = [];
  desktop.on('pageerror', (error) => errors.push(error.message));
  await desktop.goto(`${base}/es/`, { waitUntil: 'domcontentloaded' });
  await desktop.waitForTimeout(1700);
  await desktop.screenshot({ path: `${output}/desktop-hero-1440x900.png`, animations: 'disabled' });
  await desktop.locator('.threshold').scrollIntoViewIfNeeded();
  await desktop.waitForTimeout(1200);
  await desktop.screenshot({ path: `${output}/desktop-story-1440x900.png`, animations: 'disabled' });
  const overflow = await desktop.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (overflow > 3) throw new Error(`Desktop horizontal overflow: ${overflow}px`);
  if (errors.length) throw new Error(`Desktop JS errors: ${errors.join('; ').slice(0, 800)}`);
  console.log('PASS: desktop 1440x900; mobile+desktop screenshots produced');
  await desktop.close();
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
