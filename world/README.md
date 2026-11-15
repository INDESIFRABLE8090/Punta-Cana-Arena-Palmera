# Mundo Punta Cana: vuelo continuo para la portada

Plan de producción de la portada inmersiva: al hacer scroll, la cámara vuela sin cortes por una maqueta ilustrada del este de República Dominicana. Sigue el método de la skill `scroll-world`.

**Estado:** prompts listos. Falta la generación, que necesita créditos de Higgsfield; el saldo actual es de 1,58 créditos (plan gratuito).

## Dirección

- **Estilo:** maqueta isométrica de arcilla mate, efecto miniatura, luz cálida del Caribe. Es claramente ilustrado, así que nadie lo confunde con fotos reales de las excursiones.
- **Paleta:** fondo arena `#F4ECDC`, turquesa `#17B6B9`, océano `#0B4C60`, verde palmera `#2A7D5C`, dorado `#C9A35A`, coral `#F0806A`.
- **Cámara:** arquitectura B de la skill: cada escena tiene su vuelo de entrada, y entre escenas hay un conector aéreo.
- **Versiones:** ordenador (16:9) y móvil vertical nativo (9:16).

## Escenas

| # | Escena | Excursiones y servicios que presenta |
|---|---|---|
| 01 | Llegada: aeropuerto con techos de palma | Portada: «El Caribe no se cuenta. Se vive.» |
| 02 | Carretera costera hacia los hoteles | Traslados privados |
| 03 | Islas y piscina natural | Isla Saona, Isla Catalina, Lancha Rápida, Party Boat |
| 04 | Bajo el mar | Scuba Doo, Dolphin Explorer |
| 05 | Selva, sendero rojo y cenote azul | Buggies/Polaris/ATV, Fun Park, Scape Park |
| 06 | Jardín botánico | Monkeyland |
| 07 | La noche | Coco Bongo Regular y cierre con el itinerario |

Los prompts están en `prompts/`: `scene-*` para las imágenes base, `dive-*` para los vuelos de entrada y `conn-*` para los conectores. Ninguno pide texto, logotipos ni marcas.

## Orden de generación

1. **Imágenes base:** las 7 escenas con `gpt_image_2` en 3:2 y 2k. Hay que revisar que parezcan un solo mundo.
2. **Vuelos de entrada:** 7 vídeos que parten de cada imagen base. Primero en borrador con `seedance_2_0_mini` y, una vez aprobados, en `seedance_2_0` a 1080p.
3. **Conectores:** 6 vídeos. El fotograma inicial es el **último fotograma real** del vuelo anterior y el final, el **primer fotograma real** del siguiente; nunca la imagen base, o se nota el salto.
4. **Versión móvil:** la misma cadena en 9:16.
5. **Codificación:** ffmpeg con `crf 20` y `-g 8`; para móvil, 720 de ancho y `-g 4`. Los archivos van a `public/world/`.
6. **Revisión:** capturas justo antes y después de cada unión. Si una no encaja, se vuelve a generar.

## Presupuesto estimado

Son estimaciones; la skill indica calibrarlas con una imagen y un vídeo de prueba.

| Fase | Créditos aprox. |
|---|---|
| Borrador completo (`seedance_2_0_mini`) | ~300 |
| Final para ordenador (7 imágenes + 13 vídeos) | ~870 |
| Final para móvil (13 vídeos) | ~750 |

## Pendiente de decidir

La skill **Taste Skill** recomienda que en negocios de servicios manden las fotografías reales y desaconseja escenas generadas. Encaja con el brief original («fotografías auténticas»). La propuesta es combinar las dos ideas: el mundo como recorrido de la portada, y fotos reales en cada excursión en cuanto el cliente las entregue.
