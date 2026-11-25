# Beyond Paradise — Directriz maestra de dirección creativa

Estado: mandato de reconstrucción; no es aprobación de la versión actual.
Referencia técnica conservada: c90d46db01103527549ad4943425ee8f1ace874f (PR #11).
La versión anterior pasó pruebas funcionales pero fue rechazada visualmente por el propietario. Claude y DeepSeek tampoco son objetivos estéticos finales; conservar sus aportes útiles, no sus diseños completos.

## 1. Resultado que buscamos
Una experiencia digital cinematográfica, espacial e interactiva que vende excursiones y traslados. No una hoja de Canva con imágenes y stickers. El escenario es parte del contenido: agua, luz, vegetación, horizonte, cámara y tipografía comparten una composición y una lógica de movimiento.
Referentes de lenguaje creativo: Apple, Lusion, Immersive Garden; movimiento geográfico de cámara, producción publicitaria por planos y objetos que reaccionan al usuario. No copiar una marca, un sitio o sus recursos.
El criterio visual del dueño tiene prioridad sobre la cantidad de efectos o tests.

## 2. Primer corte: una escena excelente, no otra página mediocre
- Construir un laboratorio aislado de bienvenida, sin cambiar las vistas anteriores ni presentar toda la web como acabada.
- Conservar el mensaje «Bienvenido a República Dominicana» y la apertura emocional, con texto HTML accesible y localizable, no horneado en una imagen.
- Composición con primer plano de vegetación, plano medio de costa/agua y horizonte. La cámara se mueve respecto a ellos; se deben poder apreciar velocidades relativas y oclusiones, no un zoom uniforme sobre una foto.
- Elegir una sola técnica por necesidad: escena Three.js con geometría/shaders y recursos adecuados, composición 2.5D con capas originales, o película prerenderizada de cámara real. Un render prerenderizado es válido cuando el teléfono no puede sostener 3D en tiempo real. No llamar 3D real a un parallax CSS.
- Aprovechar la referencia Codrops Atmospheric Depth Gallery en laboratorio, respetando MIT y atribución. Ya existen Three.js, GSAP y Lenis; no duplicar motores. Medir antes de incorporar más dependencias.
- Entregar primero una escena a pantalla completa que se pueda abrir y recorrer en móvil. Capturar inicio, intermedio, final y vídeo corto del comportamiento; informar origen de recursos y SHA. No escalar a todo el sitio hasta superar la revisión visual.

## 3. Viaje propuesto (dirección creativa, no nuevas promesas comerciales)
1. Llegada: ambiente caribeño, título monumental y bienvenida.
2. Exploración: cámara se aproxima al mar; cambiar de escena mediante horizonte, luz, movimiento o geometría común.
3. Experiencias: mar, aventura, naturaleza y noche. Un escenario protagonista con selección accesible, no once imágenes apiladas. Cambiar de experiencia altera la escena, no solo el texto de una tarjeta. Mantener acceso directo a todas las fichas y filtros.
4. Traslados: transición espacial del agua a carretera/vehículo; mantener el cotizador y los datos confirmados. No afirmar que un vehículo ilustrativo pertenece a la flota.
5. Planifica y reserva: control claro, rápido y accesible, sin ocultar la función comercial detrás de efectos.
6. Cierre: composición nueva, coherente con la atmósfera del inicio sin repetir sus fotografías ni vídeos. Mantener preguntas frecuentes y enlaces legales sin convertirlos en otro espectáculo.

La secuencia es una propuesta a validar con el prototipo. No rehacer todo de golpe.

## 4. Producción audiovisual
Crear recursos limpios, no capturas de una interfaz generada. Cada recurso responde a un plano y una función narrativa. Bienvenida: preparar storyboard, plano inicial, aproximación, revelación y transición. Excursiones: escenas específicas, empezando por Party Boat y buggies. No usar playas genéricas como sustituto de una actividad. No inventar lugares ni atribuir escenas ilustrativas a servicios reales. Identificar recursos IA como ilustrativos y mantener licencias y créditos.
Usar Blender, Three.js o herramientas de composición y vídeo disponibles donde aporten valor. FFmpeg sirve para codificar y montar, no para generar vídeo fotorealista. Modelos de vídeo open source requieren comprobar pesos, licencia, GPU y recursos antes de prometer resultados; no instalar cargas inviables en ARM con 2 GB.
Entregar un manifiesto de medios: ruta, procedencia, licencia, dimensiones/duración, tamaño, hash, carácter documental o ilustrativo. Variantes móvil y escritorio, poster y fallback; revisar fotogramas de verdad. Una maqueta generada no equivale a un recurso integrado. No gastar sin autorización.

## 5. Prohibiciones de diseño
- No usar cuadrículas homogéneas, bloques de vidrio, sombras o tarjetas como sustituto de profundidad.
- No repetir las fotos al final ni duplicar galerías para rellenar.
- No desplazar todo el fondo como una sola pegatina y llamarlo escena espacial.
- No capturar el scroll táctil ni hacer que el visitante atraviese tramos vacíos para llegar a reservar.
- No introducir etiquetas visuales, promesas de servicios o ubicaciones falsas.
- No confundir pruebas de compilación con aprobación visual.

## 6. Gates de aceptación
A. Dirección de arte: revisión humana del primer corte (capturas y recorrido real). Debe distinguirse la profundidad en movimiento, integración tipográfica, continuidad y calidad de medios. El propietario decide la aprobación final.
B. Pruebas técnicas: build, tests existentes, 360/390/820/1440, ES/EN/PT, 11 fichas del catálogo existente, filtros, navegación, itinerario, cotizador, WhatsApp, créditos y accesibilidad. Contrastar servicios con folletos; no añadir ofertas no confirmadas.
C. Rendimiento: medir en navegador móvil y, cuando sea posible, Android físico; documentar FPS/frametime, memoria, tamaño y red en lugar de inventar mediciones. Objetivo 30 FPS sostenidos mínimo durante la escena en el dispositivo objetivo; si no se logra, reducir complejidad o activar alternativa cinematográfica. Respetar reduced-motion, ahorro de datos, ausencia de WebGL y visibilidad de pestaña; conservar navegación y cotización sin JS cuando corresponda.
D. Revisión independiente: un agente distinto al autor comprueba el mismo SHA, captura, interacción y medios. Registrar PASS/FAIL/BLOCKED. Un draft técnico no es una entrega aprobada.

## 7. Operación
Prioridad exclusiva de cliente hasta entregar la web; la campaña promocional va después. Rama/laboratorio aislados; no borrar Claude/DeepSeek ni la compilación que funciona. No publicar, fusionar, gastar ni cambiar límites de facturación sin autorización. Reserva de cuotas >=20%. No presentar una tarea encolada como ejecución. Si un ejecutor está bloqueado, registrar causa y siguiente paso legítimo, no repetir una versión rechazada.

Siguiente entregable: primer corte navegable de bienvenida con movimiento espacial verificable y medios limpios, más revisión visual; después extender el lenguaje al resto del viaje.
