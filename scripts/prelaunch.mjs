/**
 * Comprobación previa a la publicación definitiva. Falla si falta algo con
 * implicaciones legales. Uso: npm run prelaunch
 */
import { readFileSync, readdirSync } from 'node:fs';

const site = readFileSync('src/config/site.ts', 'utf8');
const field = (name) => site.match(new RegExp(`${name}: '([^']*)'`))?.[1] ?? '';
const problems = [];
const warnings = [];

for (const [key, why] of [
  ['legalName', 'nombre legal del titular (aviso legal y privacidad)'],
  ['taxId', 'RNC o identificación fiscal del titular'],
  ['email', 'correo para que los usuarios ejerzan sus derechos de privacidad'],
]) if (!field(key)) problems.push(`Falta ${key} en src/config/site.ts: ${why}.`);
if (!field('address')) warnings.push('Falta address (domicilio o zona del negocio) en src/config/site.ts.');

const credits = readFileSync('src/data/credits.ts', 'utf8');
for (const f of readdirSync('src/assets/images').filter((f) => f.startsWith('commons-')))
  if (!credits.includes(`'${f}'`)) problems.push(`La imagen ${f} no tiene crédito en src/data/credits.ts.`);

warnings.push('Confirmar por escrito con el cliente que tiene derecho a usar scuba-doo.jpg, dolphin-explorer.jpg, buggies.jpg, lancha-rapida.jpg, coco-bongo.jpg y costa-punta-cana.jpg.');
warnings.push('Confirmar que el cliente puede comercializar cada excursión (revendedor autorizado u operador).');
if ((process.env.SITE_URL ?? 'github.io').includes('github.io')) warnings.push('Definir el dominio definitivo (SITE_URL).');

warnings.forEach((w) => console.log(`AVISO  ${w}`));
problems.forEach((p) => console.log(`FALTA  ${p}`));
if (problems.length) {
  console.log(`\n${problems.length} punto(s) bloquean la publicación definitiva.`);
  process.exit(1);
}
console.log('\nListo para publicar.');
