# Beyond Paradise — dirección de producción ejecutable
Propietario rechazó las capturas de PR #9: parecen plantilla turística genérica. Objetivo: experiencia de viaje cinematográfica, no folleto. No esperar JARVIS. Trabajar en Codespaces, rama propia, sin pisar otros autores. No publicar ni gastar. Mantener sitio existente y catálogo confirmado, ES/EN/PT, WhatsApp y cotizador.

## 1. Dirección artística y material
Inventariar public/media/veo y fotos acreditadas existentes; usar ffprobe/Sharp si disponibles. Paleta: turquesa vivo, arena marfil, azul profundo, coral cálido puntual. Outfit/Manrope para titulares contundentes y navegación; Fraunces solo como contrapunto. Eliminar microtextos redundantes, grandes velos oscuros, círculos decorativos, botones genéricos. Evitar esquema texto+rectángulo de foto. Marca provisional consistente, sin inventar identidad legal. No enviar recursos privados a servicios externos sin autorización.

## 2. Hero: construir mundo navegable con Three.js
Ya está instalada la dependencia three. Estudiar ejemplo oficial https://threejs.org/examples/webgl_shaders_ocean . Implementar OceanStage y un módulo de escena con Water (three/addons/objects/Water.js), Sky, cámara perspectiva y luz solar coherente, horizonte, niebla atmosférica y normal map de licencia verificada o generada. Probar oleaje y reflejos antes de sumar complejidad. Crear silueta de costa y palmeras con geometría procedural instanciada o GLB con licencia comercial acreditada. Si Blender ya existe, utilizarlo para generar/exportar props; no exigir GPU ni instalarlo a ciegas. Cámara baja sobre agua, avance hacia costa, pequeña respuesta al puntero solo escritorio. Título y CTA en HTML accesible. No cubrir paisaje con texto gigante: dejar respirar horizonte. Escena ilustrativa claramente rotulada. Si el resultado 3D parece videojuego barato, usar vídeo Veo existente como capa principal y reservar WebGL para efecto de profundidad; no fingir hiperrealismo.

## 3. Llegada: animar con GSAP
Usar GSAP ScrollTrigger https://gsap.com/docs/v3/Plugins/ScrollTrigger/ y una timeline scrub/pin solo escritorio capaz: movimiento de cámara, transición de océano a costa y carretera a pantalla completa. Utilizar vídeos coast/road existentes si están disponibles, máscara CSS de orilla y texto que entra y sale una vez. Eliminar bloque genérico texto izquierda/foto derecha. Lenis solo si no rompe anclas/teclado/scroll nativo. Móvil: scroll natural, transiciones ligeras, sin pin excesivo. Mostrar un recorrido de 15–30 segundos, no únicamente capturas.

## 4. Excursiones: experiencia editorial con Astro
Datos existentes como fuente única. Componente selector por categorías con una imagen protagonista que cambia al seleccionar o enfocar cada actividad y abre la ficha existente. En móvil, lista/carrusel táctil con controles accesibles; alternativa sin JS. Usar CSS Grid, GSAP únicamente para transiciones breves. No inventar excursiones, precios, disponibilidad ni fotos documentales. Mantener navegación y tres idiomas.

## 5. Transporte y cotización
Usar vídeo/imagen de carretera y vehículo existentes como plano de llegada; pasar por una transición a la interfaz de itinerario. Reutilizar cotizador/WhatsApp existentes. No crear checkout ni inventar flota, capacidad o reseñas. Cierre editorial claro.

## 6. Referencias externas: estudiar, no instalar todo
https://github.com/nguyencongnamit/threejs-ocean
https://github.com/brock-banks/3D-webGL-hero-section-Ocean-Studio
https://github.com/ooeygg/astro-immersive-starter
https://github.com/Maou3434/Ocean_Theme_WebsiteRender
Verificar existencia, licencia, dependencias y demo antes de reutilizar. Si no hay licencia comercial explícita, no copiar código/medios. El ejemplo oficial Three.js es preferible a depender de un repo externo. Aceternity/Magic UI/21st.dev solo como referencia puntual, no importar diseños genéricos. FFmpeg/Sharp para optimizar medios si ya disponibles. No instalar otra colección de IA.

## 7. Rendimiento
Una sola instancia WebGL, DPR 1–1.5, canvas cargado después del póster, detener render fuera de vista y pestaña oculta, liberar recursos. Detectar ahorro de datos/reduced motion/WebGL ausente y rendimiento bajo; fallback póster o vídeo optimizado. No autoplay de audio. No bloquear la entrega por 3D.

## 8. Entrega obligatoria
Primero ejecutar una escena hero funcional y abrirla en navegador. Después integrar el recorrido y catálogo. npm ci, npm test, npm run build; Playwright móvil 390x844 y escritorio 1440x900, ES/EN/PT, navegación, cotización, reduced motion, error WebGL, JS/overflow. Capturas en varios puntos del scroll y recorrido grabado. Abrir preview privada Codespaces con puerto 4321, no cambiar visibilidad a pública. Si base es /Punta-Cana-Arena-Palmera, usar esa ruta o BASE_PATH=/ para preview según configuración; verificar HTTP 200. Entregar URL, SHA y pruebas. Mantener bloqueo prelaunch para publicación, no exigir datos legales para demo privada. No declarar calidad visual por pasar CI. Comparar contra capturas rechazadas y presentar un resultado sustancialmente distinto. Si 3D no cumple, entregar alternativa cinematográfica que sí funciona. No esperar a que se instale otro agente.