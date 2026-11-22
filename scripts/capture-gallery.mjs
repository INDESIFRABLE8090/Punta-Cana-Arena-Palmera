/**
 * Capture ACTUAL compiled-gallery frames from Chromium (not design renders).
 * Restricted to this build's localhost preview. No secrets or external API.
 */
import { createRequire } from 'node:module';
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, '.preview-captures');
mkdirSync(out, { recursive: true });
const localRequire = createRequire(import.meta.url);
const globalRequire = createRequire(join(execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim(), 'x.js'));
let chromium;
try {
  ({ chromium } = localRequire('playwright'));
} catch {
  ({ chromium } = globalRequire('playwright'));
}
const server = spawn('npx', ['astro', 'preview', '--host', '127.0.0.1', '--port', '4399'], {
  cwd: root, stdio: 'ignore',
});
let browser;
try {
  let ready = false;
  const target = 'http://127.0.0.1:4399/Punta-Cana-Arena-Palmera/es/';
  for (let i = 0; i < 60; i++) {
    try {
      const response = await fetch(target);
      if (response.ok) { ready = true; break; }
    } catch {}
    await new Promise(r => setTimeout(r, 400));
  }
  if (!ready) throw new Error('Local static preview did not start');
  browser = await chromium.launch({ headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });

  for (const device of [
    { key: 'mobile', width: 390, height: 844, scale: 3 },
    { key: 'desktop', width: 1440, height: 900, scale: 1 },
  ]) {
    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      deviceScaleFactor: device.scale,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto(target, { waitUntil: 'networkidle', timeout: 45000 });
    const header = page.locator('#galeria .gallery-head');
    const first = page.locator('#galeria .shot-screen').first();
    if ((await first.count()) === 0) throw new Error('Gallery has no licensed high-resolution photographs');
    await header.scrollIntoViewIfNeeded();
    await page.screenshot({ path: join(out, 'heading-' + device.key + '.png') });
    await first.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const natural = await first.locator('img').first().evaluate(img => ({
      width: img.naturalWidth, height: img.naturalHeight, loaded: img.complete,
    }));
    if (!natural.loaded || natural.width < 1080 || natural.height < 650) {
      throw new Error('Low resolution or broken editorial image: ' + JSON.stringify(natural));
    }
    await page.screenshot({ path: join(out, 'photo-' + device.key + '.png') });
    await context.close();
    console.log(device.key + ': image ' + natural.width + 'x' + natural.height + ', captures saved');
  }
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
