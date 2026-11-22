# Punta Cana Arena y Palmera

Sitio web de excursiones y transporte privado en Punta Cana. Es trilingüe (español, inglés y portugués de Brasil) y está pensado primero para móviles Android. Incluye una inmersión 3D en el océano sincronizada con el scroll, un constructor de itinerarios y solicitudes de cotización por WhatsApp.

## Puesta en marcha

Requisitos: Node 22 o superior.

```bash
npm install
npm run dev       # desarrollo en http://localhost:4321/Punta-Cana-Arena-Palmera/es/
npm run build     # comprobación de tipos + compilación estática en dist/
npm run preview   # sirve dist/ localmente
npm test          # control de calidad completo (requiere compilar antes)
```

`npm test` necesita Playwright con Chromium instalado de forma global (`npm i -g playwright && npx playwright install chromium`).

## Variables de entorno

Solo hay configuración pública. El sitio no usa claves, secretos ni base de datos (ver `.env.example`).

| Variable | Valor actual | Para dominio propio |
|---|---|---|
| `SITE_URL` | `https://indesifrable8090.github.io` | `https://tudominio.com` |
| `BASE_PATH` | `/Punta-Cana-Arena-Palmera` | `/` |

Ambas alimentan las URL canónicas, `hreflang`, Open Graph, el sitemap y `robots.txt`.

## Despliegue

El workflow `.github/workflows/deploy.yml` compila y publica en GitHub Pages en cada push a `main`. Para activarlo: **Settings → Pages → Source: GitHub Actions**. Si se pasa a dominio propio, hay que cambiar las dos variables en ese workflow.

## Arquitectura

**Astro 7** genera HTML estático por idioma. Solo se envía JavaScript a las piezas interactivas.

```
src/
  config/site.ts        Datos oficiales del negocio (WhatsApp, nombre, redes). Única fuente de contacto.
  data/tours.ts         Las 11 excursiones en ES/EN/PT, transcritas de los folletos del cliente.
  data/fleet.ts         Vehículos de transporte (vacío hasta que el cliente los confirme).
  i18n/                 Idiomas, rutas y todos los textos de interfaz (tipados: un idioma incompleto no compila).
  layouts/Base.astro    <head> con SEO, hreflang, Open Graph, JSON-LD y CSP.
  components/           Secciones (Hero, Dive, Experiences, Transport, Gallery, Planner, Faq…).
  components/reactbits/ Componentes de React Bits (SplitText, Magnet, ShinyText, Waves).
  scripts/
    app.ts              Arranque: menú, filtros, apariciones, itinerario, audio, galería.
    motion.ts           GSAP + ScrollTrigger + Lenis; se carga cuando el navegador está libre.
    ocean/              Escena Three.js y shaders GLSL de la inmersión (se carga al acercarse).
    itinerary.ts        Estado del itinerario (solo guarda qué excursiones se eligieron).
    planner.ts          Validación y mensaje de cotización para WhatsApp.
    audio.ts            Sonido del mar sintetizado con Web Audio (solo se activa al pulsar).
  pages/
    [lang]/index.astro                 Portada: /es/, /en/, /pt/
    [lang]/[section]/[slug].astro      Fichas: /es/excursiones/…, /en/excursions/…, /pt/excursoes/…
cliente/folletos/       Folletos originales del cliente (referencia; no se publican).
tests/site.test.mjs     Control de calidad automatizado.
```

## Decisiones importantes

- **Datos comerciales.** Solo aparece lo que dicen los folletos. No se publican precios; la única cifra es el suplemento de 20 dólares por transporte privado en Coco Bongo, que figura en el folleto.
- **Cotización, no reserva.** El formulario valida los datos y abre WhatsApp con el mensaje ya escrito. No hay backend, pagos ni almacenamiento de datos personales. El texto deja claro que es una solicitud y no una reserva confirmada.
- **Antiabuso.** El formulario tiene un campo señuelo, ignora envíos instantáneos y frena los envíos repetidos.
- **3D adaptativo.** La escena elige su calidad según la memoria y los núcleos del dispositivo, y baja la resolución si cae de unos 28 fps. Solo se dibuja mientras está en pantalla. Si no hay WebGL o se activa el ahorro de datos, se muestra una imagen. Con movimiento reducido no hay scroll inmersivo, parallax ni 3D.
- **Seguridad.** Content-Security-Policy restringida a recursos propios y `noopener` en todos los enlaces externos. No hay claves en el frontend porque no hace falta ninguna.
- **Imágenes.** Las fotos se convierten a AVIF/WebP en varios tamaños durante la compilación. Las fichas indican «imagen de carácter ilustrativo».

## Legal

**Páginas publicadas** en `/{idioma}/legal/…`, en los 3 idiomas y enlazadas desde el pie y el formulario:

- **Política de privacidad:** sin cookies ni analítica; datos solo por WhatsApp; derechos según RGPD, LGPD y la ley 172-13 de República Dominicana.
- **Aviso legal y condiciones:** una cotización no es una reserva, la web no cobra pagos, operadores locales, requisitos de las actividades de riesgo, imágenes ilustrativas y marcas de terceros.
- **Declaración de accesibilidad.**
- **Créditos de imágenes.**

Los textos describen cómo funciona hoy la web. Si se añade analítica, pagos o un formulario con servidor, hay que actualizarlos antes de publicar.

**`npm run prelaunch`** bloquea la publicación definitiva mientras falten:

- el nombre legal y el RNC del titular;
- el correo para que los usuarios ejerzan sus derechos de privacidad;
- el crédito de cualquier foto `commons-*`.

También avisa de lo que hay que confirmar con el cliente.

**Recomendación:** que un abogado de República Dominicana revise los textos antes del lanzamiento, en especial la ley aplicable y la política de cancelación, que dependen del negocio.

## Fotografías de terceros

Las fotos `src/assets/images/commons-*.jpg` vienen de Wikimedia Commons. Son fotos reales de los lugares, con licencia CC BY o CC BY-SA. Cada una tiene su entrada en `src/data/credits.ts` con autor, licencia y enlace, que se muestran en la ficha de la excursión, en la galería y en la página de créditos. Se sustituyen por las del cliente en cuanto lleguen.

## Criterio de diseño (Taste Skill, UI/UX Pro Max, guías de Vercel)

Se aplicaron sus verificadores con criterio:

- **Corregido:**
  - textos sin fundido al hacer scroll;
  - un único sistema de botones (turquesa para la acción principal, contorno para la secundaria, verde para WhatsApp);
  - menos etiquetas y numeraciones;
  - anillo de foco visible;
  - contraste sobre la foto de portada;
  - galería sin solapamientos.
- **Mantenido a propósito,** porque lo pide el brief del proyecto:
  - la inmersión 3D con WebGL;
  - el scroll sincronizado con GSAP;
  - la entrada animada de las fotos;
  - los titulares con SplitText;
  - el número real de WhatsApp en el pie.

  Taste Skill desaconseja estos efectos en webs de servicios.

## Control de calidad (`npm test`)

98 comprobaciones:

- **Estáticas:** 38 páginas, enlaces internos, `srcset`, títulos y descripciones, canonical, `hreflang`, un único `h1`, JSON-LD sin precios ni reseñas inventadas, `alt` en todas las imágenes.
- **En navegador:** Android 360×640, Pixel 7, Android en horizontal, tablet y escritorio. Comprueba consola sin errores, ausencia de desborde horizontal, carga de imágenes y objetivos táctiles de al menos 44 px.
- **Flujos:** menú, filtros (también por URL), itinerario (añadir, reordenar, persistir), validaciones y mensaje de WhatsApp en los 3 idiomas, señuelo antiabuso, galería con teclado y sonido.
- **Accesibilidad:** auditoría WCAG 2.1 AA con axe-core, movimiento reducido, sin JavaScript, navegación por teclado y nombres accesibles.

## Pendiente del cliente

| Dato | Dónde se añade |
|---|---|
| Fotos propias de cada excursión (hoy: fotos de Wikimedia Commons o portada tipográfica) | `src/assets/images/` + campo `image` en `src/data/tours.ts` |
| Nombre legal, RNC, correo y domicilio del titular | `src/config/site.ts` (`npm run prelaunch` lo exige) |
| Confirmación de derechos de uso de las fotos que entregó el cliente | por escrito, antes de publicar |
| Vehículos de transporte: modelos, capacidad y fotos | `src/data/fleet.ts` (la sección los muestra sola) |
| Email, Instagram y Facebook | `src/config/site.ts` (aparecen solos en el pie) |
| Dominio definitivo | `SITE_URL` / `BASE_PATH` |
| Vídeo propio para la portada | `src/components/Hero.astro` |
