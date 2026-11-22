# Continuidad — Arena y Palma («Beyond Paradise»)

Documento para retomar el trabajo desde el último commit de la rama `claude/punta-cana-premium-web-mbwugp`.
**No publicar ni desplegar.** Nada está aprobado visualmente hasta que el propietario lo vea en su teléfono.

## Referencia creativa
- Manifiesto «Beyond Paradise» y comentarios del issue #2 (fuente principal). Segundo entregable (automatización): issue #5.
- Marca visible: **Arena y Palma · República Dominicana** (denominación legal pendiente de confirmar; `src/config/site.ts` sigue con el nombre anterior para textos legales).
- Rechazado por el propietario: hero de foto + titular + formulario, carruseles, cuadrículas de tarjetas, CTA verdes duplicados, Three.js «feo».

## Estado actual (qué hay hecho)
| Área | Estado | Archivos |
|---|---|---|
| Portada | Hecha: vídeo Blender de atardecer (bucle ida/vuelta 6 s, 200 KB) + póster, palmeras SVG generadas, «Beyond Paradise» letra a letra (CSS), paralaje scroll/puntero (GSAP), orilla de espuma | `src/components/Hero.astro`, `Palms.astro`, `public/media/`, `src/scripts/motion.ts` (`initHero`) |
| Identidad | Fraunces en todos los titulares, cursivas rosa `--rose-600`; tokens `--plum`, `--rose-*` | `src/styles/global.css` |
| Experiencias | Rediseñadas como índice editorial (crepúsculo ciruela): escritorio con marco fijo que cambia de foto con máscara; móvil con capítulos y fotos reveladas | `src/components/Experiences.astro`, `src/scripts/app.ts` (`initIndex`) |
| Transporte | Billete interactivo: origen/destino/fecha/personas rellenan el billete en vivo y el mensaje de WhatsApp | `src/components/Transport.astro`, `app.ts` (`initTicket`) |
| Cotizador | Sección propia tras experiencias | `src/components/Quote.astro` |
| Inmersión | Three.js existente con la paleta del atardecer (el propietario lo considera feo: candidato a sustituir por render Blender) | `src/components/Dive.astro`, `src/scripts/ocean/` |
| Test `/en/` | Corregida la causa real (uid aleatorio de `<astro-island>` contenía «NaN») | `tests/site.test.mjs` |
| Folletos | 11 folletos ↔ 11 fichas comprobado por test; confirmación comercial pendiente | `cliente/INVENTARIO.md` |

## Blender (recursos)
- Script reproducible: `art/blender/ocean.py`. Uso: `blender -b -P art/blender/ocean.py -- <salida_prefijo> 1024 576 <ini> <fin> 32`.
- Blender 4.0.2 del Codespace **no tiene OpenImageDenoise** (no activar `use_denoising`). CPU 2 núcleos: ~45–60 s/fotograma. Lanzar desacoplado: `setsid nohup nice -n 12 blender ... &`.
- Fotogramas originales (72 PNG, 42 MB, fuera de git): `/workspaces/arena-palmera-work/render-frames/`.
- Montaje del vídeo: ffmpeg `hqdn3d` + ida/vuelta (`split`/`reverse`/`concat`), `libx264 -crf 22 -movflags +faststart`.

## Pruebas
- Comandos: `npm run build`, `npm test` (Playwright usa el Chromium 1255 en caché; si falta el módulo: `npm i --no-save playwright@latest`), `npm run prelaunch`.
- Última batería completa (commit 301e087, tras rediseñar experiencias y transporte, CPU libre): **104 ok, 0 fallos**, `npm run build` 0 errores. El timeout intermitente de «.quote [data-add]» solo apareció con Blender saturando la CPU.
- Vista previa privada: `npx astro dev --host 0.0.0.0 --port 4321` → puerto 4321 de Codespaces (privado).

## Pendiente
1. Hacer push (el token del Codespace devuelve 403 en este repo; hay copia en `../arena-palma-<sha>.bundle`).
2. Comprobar en producción que el marco fijo de experiencias (escritorio) carga cada foto al cambiar (en dev salía vacío por la generación de AVIF al vuelo).
3. Grabar recorrido real en vídeo (portada → scroll → experiencias → transporte → interacciones) para comparar con las referencias del propietario (`recordVideo` de Playwright).
4. Sustituir o rediseñar la inmersión Three.js (propuesta: secuencia renderizada en Blender ligada al scroll).
5. Galería, planificador/itinerario, fichas y pie: llevarlos al mismo universo visual.
6. Medir rendimiento en Android de gama media (LCP, fluidez).
7. Issue #5 (automatización con IA): sin empezar.

## Auditoría de material visual (22 nov 2026)
Material **presente** en el Codespace (búsqueda completa de `/workspaces`): 11 folletos (`cliente/folletos/`, solo catálogo), 11 imágenes en `src/assets/images/`, render Blender propio (`public/media/sunset.*`, `art/blender/`). Ningún adjunto en issues/PR.

| Imagen | Resolución | Procedencia | Uso decidido |
|---|---|---|---|
| commons-isla-catalina | 3000×1996 | Commons CC BY-SA 3.0 | Galería (escena 1), ficha |
| commons-isla-saona | 1920×1152 | Commons CC BY-SA 4.0 | Galería (escena 2), ficha |
| commons-mono-ardilla | 1920×1280 | Commons CC BY 4.0 | Galería (escena 3), ficha |
| commons-playa-macao | 1600×1063 | Commons CC BY 2.0 | Solo ficha (plana para pantalla completa) |
| commons-piscina-natural | 1920×1152 | Commons CC BY-SA 4.0 | Solo ficha (foto de móvil, brumosa) |
| buggies, lancha-rapida | 1200×896 | sin procedencia, aspecto generado | Solo ficha, marcada «ilustrativa» |
| scuba-doo, dolphin-explorer | 2752×1536 | sin procedencia, aspecto generado | Solo ficha/índice, marcada «ilustrativa» |
| coco-bongo | 1536×2752 | sin procedencia, aspecto generado | Solo ficha/índice, marcada «ilustrativa» |
| costa-punta-cana | 1376×768 | generada (issue #2) | Retirada de portada y galería |

**Falta (bloqueo humano):** los originales del propietario citados en issue #2 y PR #6 — clips reales `1001285018/5019/5021/5026.mp4`, clips `1001284176/4144/4146.mp4` y vídeos de referencia `1001284464/4468/4500.mp4` — no están en el Codespace ni adjuntos en GitHub. Para usarlos: subirlos (arrastrar al Explorador de VS Code) a `/workspaces/arena-palmera-work/originales/` (fuera del repo público) y confirmar derechos de uso. Con ellos: reel real de excursiones en capítulos de experiencias y escenas de galería con vídeo propio.
