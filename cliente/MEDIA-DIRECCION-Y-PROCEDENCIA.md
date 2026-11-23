# ARENA Y PALMA — selección multimedia, origen y fuentes gratuitas

> Estado: **handoff para Claude Code; NO APROBADO PARA PUBLICACIÓN**. El propietario compartió nuevas imágenes y vídeos en ChatGPT. Los MP4 optimizados y posters se empaquetaron en tres archivos descargables desde esa misma conversación, pero **aún NO están en este repositorio ni en el Codespace**. Esta rama contiene únicamente las instrucciones y el índice, para no pisar el trabajo local de Claude.

## Identidad y selección

Marca que debe dominar visualmente: **Arena y Palma**. República Dominicana es el destino y la emoción (mar turquesa, palmas, luz rosada). Los servicios «excursiones» y «transporte» son capas comerciales posteriores, no la portada ni el logotipo. Confirmar denominación legal definitiva con el cliente antes de producción.

Se han inspeccionado **7 clips de 7,8 segundos a 1920×1080, 24 fps** suministrados recientemente, y 3 fotografías de 1536×864 del atardecer. Hay versiones web optimizadas a **1600×900, H.264 MP4, sin audio, +faststart**, y posters WebP. Los **originales permanecen intactos** fuera de los paquetes.

| Origen en ChatGPT | Versión web preparada | Uso propuesto |
| --- | --- | --- |
| `1001283529.mp4` | `04-atardecer-palmeras.mp4` | **Hero principal**: cielo rosado, costa de palmeras |
| `1001283396.mp4` | `02-costa-agua-turquesa.mp4` | Océano aéreo / transición |
| `1001283390.mp4` | `01-costa-dorada-aerea.mp4` | Apertura luminosa / alternativa |
| `1001283398.mp4` | `03-costa-atardecer-suave.mp4` | Secuencia complementaria |
| `1001283530.mp4` | `05-costa-turquesa-alternativa.mp4` | Alternativa; evitar repetición estética |
| `1001283531.mp4` | `06-transporte-carretera-costera.mp4` | Escena ilustrativa de movilidad |
| `1001283532.mp4` | `07-transporte-recogida-aeropuerto.mp4` | Concepto ilustrativo de recogida |
| `1001283509/3510/3511.png` | `photos/atardecer-costa-01/02/03.webp` | Fotogramas de reserva y composición |

**Paquetes reales creados en ChatGPT** (no están aún en `public/media`):
- `arena_y_palma_escenas_esenciales.zip` — 2 clips clave, posters y 3 imágenes (13 MB).
- `arena_y_palma_media_paisajes_web.zip` — 5 clips de costa, posters y las imágenes (30 MB).
- `arena_y_palma_media_transporte_web.zip` — 2 clips de movilidad y posters (15 MB).

Cada ZIP tiene `README.md` y `manifest.json` con SHA-256 del archivo original, duración, resoluciones y estatus de permisos. **Solo quien tiene los enlaces de descarga de esa conversación puede copiar los bytes al Codespace**; este commit NO transfirió archivos automáticamente. Mantener el índice de origen al importarlos.

## Permisos: no omitir

Estos archivos fueron **proporcionados por el propietario**, pero no hay constancia verificable en el chat sobre quién los grabó/generó ni qué derechos comerciales están concedidos. Pueden usarse como referencia y en preview privada; **NO dar por autorizado su uso en una web pública** hasta verificar procedencia y licencia comercial. Si son recreaciones de IA, no decir que muestran vehículos, hotel, personal o servicios reales del negocio. No extrapolar una localización geográfica concreta a partir de un render.

## Búsqueda independiente de clips gratuitos y licenciables

Fuentes oficiales y condiciones:
- **Pexels** https://www.pexels.com/videos/ — https://www.pexels.com/license/ (vídeo comercial permitido de acuerdo con su licencia; no revender copias sin modificar ni implicar un respaldo falso de personas)
- **Pixabay** https://pixabay.com/videos/ — https://pixabay.com/service/license-summary/ (comercial generalmente permitido, con restricciones sobre marcas, personas y otros derechos)
- **Mixkit** https://mixkit.co/free-stock-video/ — https://mixkit.co/license/ (**revisar que cada clip tenga Video Free License**, no Restricted License)

Términos de búsqueda propuestos (varias fuentes): `Dominican Republic 4k aerial beach`, `Caribbean turquoise sea palm island cinematic`, `pink sunset Caribbean sea 4k`, `tropical coast drone waves`, `Dominican Republic transfer coastal road`.

Para cada clip candidato: verificar licencia del **clip específico** y derechos de terceros, guardar URL de página original, autor y fecha; examinar resolución real, fps, compresión, personas, logos, autenticidad geográfica; rechazar agua pixelada, cámara temblorosa, overlays y watermarks. No descargar ni extraer clips de webs de diseño de terceros para reutilizar comercialmente.

## Generación de video por IA sin pago

- **Google Flow** https://labs.google/fx/tools/flow — la documentación oficial ofrece un cupo de créditos diarios en cuentas elegibles; disponibilidad, modelo, marcas de agua y derechos de salida deben comprobarse en la cuenta antes del uso comercial. No crear cuentas sin autorización.
- **Runway** https://runwayml.com/pricing — su plan gratuito tiene créditos **únicos**, no recurrentes, y vídeos marcados con watermark. No es fuente fiable para un sitio comercial sin verificar condiciones del archivo.
- **Wan2.2 open source** https://github.com/Wan-Video/Wan2.2 — licencia/modelos y hardware requieren inspección; NO intentar instalar en el Codespace CPU ni asumir que GPU cloud es gratis.

**Recomendación:** priorizar footage real con licencia comercial clara y el material 1080p del usuario previa validación, luego componer escenas originales mediante Astro, CSS, GSAP y Three.js. Más IA no significa automáticamente mejor experiencia.

## Criterio técnico para Claude

- Hero: máximo un vídeo protagonista al inicio; `poster` WebP nítido para carga y `prefers-reduced-motion`, `saveData`, dispositivos modestos. `muted loop playsinline`; no audio automático. Preferir <video> HTML nativo en vez de canvas para el vídeo.
- Importar assets únicamente en la rama/entorno activo de Claude, después de revisar `git status`; **nunca sobreescribir `6f9b2b9` ni cambios locales**. Copiar lo necesario a `public/media`; no añadir los 45 MB de videos al Git sin considerar almacenamiento y rendimiento.
- Dejar de mostrar tarjetas genéricas y galerías ampliadas de archivos pequeños. Cuidar contraste, tipografía, transiciones y velocidad; probar en Android real y 1440 escritorio.
- **No declarar aprobado ni publicar** hasta revisar visualmente las secuencias completas, licencias, performance y test de contratos/WhatsApp.
- Si una técnica da resultados excelentes y el propietario la aprueba, documentar la receta en el playbook con evidencias para reutilizarla.

Esta documentación es **un inventario y una ruta de trabajo**, no una afirmación de que Claude recibió los vídeos físicamente.
