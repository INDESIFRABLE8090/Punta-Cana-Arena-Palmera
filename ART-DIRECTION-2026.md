# Dirección artística — ARENA / THE LIVING COAST — exploración 2026

> **Referencias visuales aportadas por el usuario = MATERIAL PARA INTERPRETAR, NO PARA COPIAR NI SUBIR A LA WEB.**
> Este principio se aplica a las capturas de pantalla, flyers, fotos de buggies, vehículos, turistas y ejemplos de otras versiones de la web. Mantener los originales intactos, fuera del código publicado, salvo autorización explícita para una fotografía concreta y comprobación de derechos.
>
> Este documento propone diseño y criterio de aceptación; NO declara que la experiencia visual final esté implementada.

## Qué aprendimos de las capturas del sitio anterior

Las capturas muestran funcionalidades útiles (excursiones, traslados, mapa, idiomas y WhatsApp), pero también un diseño genérico: bloques verticales de tarjetas casi idénticas, navegación convencional, fotografías simplemente recortadas y demasiado contenido estático. Los controles de ES/EN/PT, botones y formularios NO son factores diferenciadores.

Conservar el **contenido verificado** y los flujos que convierten; reinterpretar el lenguaje visual, NO clonar posiciones, tipografía, bloques ni imágenes.

## Idea rectora: "La costa que responde"

Un viaje sensorial que se **explora**, no una colección de componentes. Se entra por un horizonte oceánico vivo: el título editorial se revela en sincronía con la luz y un movimiento horizontal muy leve sobre el agua. Una ruta visual conecta mar, aventura, naturaleza, noche y traslados como capítulos distintivos, con el usuario en control.

**Paleta:** negro oceánico #031B27, azul abisal #082D3D, turquesa luminoso #39D7D0, ámbar solar #FFBF55, blanco espuma #F3F6F2. El contraste está en fotografías autorizadas y tipografía editorial enorme, no en decoraciones acumuladas.

### Cinco escenas, cinco conductas observables

1. **Portada de impacto.** Horizonte costero recreado con WebGL/procedural ligero y tipografía con máscara por líneas. En móvil bajo consumo, poster generado o fondo CSS con profundidad en lugar de WebGL. CTA principal inequívoco: explorar o planear, sin rodeos.
2. **Exploración por capítulos.** Un rail cinematográfico editorial y tarjetas asimétricas que se expanden para mostrar el detalle de cada experiencia; cambiar entre categorías debe producir movimiento de elemento compartido cuando sea viable, no desmontar todo el DOM. No usar las imágenes de referencia como miniaturas.
3. **Itinerario como artefacto.** Transformar el planner ya verificado en un ticket/cartografía visual personalizable, con experiencias por día, animación de trazado sutil y QR cuando haya URL pública. Mantener persistencia, seguridad y cotización múltiple.
4. **Traslados claros, no una falsa app de mapas.** Panel tipo itinerario vivo: origen, destino, fecha, pasajeros, maletas y resumen animado. Sin km, tiempos, rutas, tarifas o disponibilidad inventados.
5. **Final de marca memorable.** Plano nocturno/costero tipográfico y un único CTA a consulta autorizada. Sin testimonios ficticios, iconos emoji ni distintivos "recommended" no verificados.

## Movimiento de nivel 2026, sin sacrificar Android

- Transiciones coreografiadas (entrada ~650ms, acciones 150–250ms, cambio de capítulo ~800–1100ms), animar principalmente transform y opacity; detenerse al abandonar viewport.
- Respetar `prefers-reduced-motion`, `saveData`, visibilidad de pestaña y limitación de GPU.
- Ni autoplay con sonido ni geolocalización forzada. El usuario conserva control del ritmo.
- **Cero scroll horizontal** a 320/360/390/768/1024/1440px y keyboard navigation operable. Medir Lighthouse/Web Vitals, no inventar métricas.
- Tres idiomas completos ES/EN/PT como base; detección de idioma del navegador con cambio manual. **No presentar "3 idiomas" como innovación** ni sacrificar la dirección artística por multiplicar badges.

## Imágenes y autenticidad

- **Prohibido usar capturas aportadas como imágenes de la web por defecto.**
- No recortar una captura para extraer fotos incrustadas de un flyer ni presentar fotos ilustrativas como flota propia.
- Crear originales visuales (3D procedural, composiciones editoriales y contenidos autorizados). Los vídeos aportados pueden servir para analizar encuadres y ritmo, no son automáticamente activos autorizados.
- No descargar fotos aleatorias sin acreditar o validar derechos. La selección de media comercial necesita procedencia/licencia y calidad verificadas.

## Qué es entrega real

No basta un mockup: necesitamos versión ejecutable en rama aislada, navegador real con captura 390×844 y 1440, pruebas del flujo portada→experiencia→solicitud y portada→traslado→solicitud, consola sin errores, accesibilidad y rendimiento, más confirmación de catálogo. No tocar `main`, producción, Cloudflare o AWS sin aprobación.

**Rama de diseño:** `chatgpt/arena-cinematic-direction-2026`. Aislar exploración; preservar `chatgpt/arena-premium-planner-r1` y PR #1 intactos.
