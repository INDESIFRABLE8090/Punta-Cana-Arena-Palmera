# Trazabilidad del catálogo — Arena & Palmera

**Estado: auditoría interna de materiales compartidos, 20 de noviembre de 2026. No constituye autorización para publicar ni confirma disponibilidad actual.**

## Fuente primaria y cobertura

Se recibieron diez capturas de folletos en la conversación. Se identificaron **diez actividades distintas** (incluyendo las dos anteriormente pendientes: Buggies y Saona). La undécima ficha del prototipo, **Isla Catalina**, no aparece en estas diez imágenes y sigue pendiente de cotejo directo con su folleto; esta limitación no implica que el operador no la ofrezca. Los flyers sí muestran textos ES/EN/PT; el sitio solo tiene ES/EN y debe incorporar PT con revisión comercial antes de publicar.

Los identificadores siguientes describen las capturas de la conversación, **no fotos de alta resolución listas para usar en producción**. No se han distribuido esas fotografías en el sitio ni se ha verificado licencia comercial de imágenes de terceros.

| ID del código | Excursión | Captura recibida | Inclusiones o condiciones verificadas en el folleto | Estado del contenido |
|---|---|---|---|---|
| `buggies` | Buggies / Polaris / ATV | `1001279627.jpg` | Transporte ida/vuelta, parada artesanal de café/cacao/mamajuana/ron/tabaco, cenote de agua dulce, playa Macao. Nota explícita: **el visitante maneja el vehículo**. | **Respaldada por folleto**, requisitos de edad, licencia y seguridad pendientes |
| `saona` | Saona Island | `1001279628.jpg` | Transporte terrestre y marítimo, party boat, piscina natural, buffet, bebidas alcohólicas/no alcohólicas, guía y animación; menor de 11: precio especial (sin importe publicado). | **Respaldada por folleto**, tarifa y condiciones pendientes |
| `scape-park` | Scape Park | `1001279629.jpg` | Transporte, ruta cultural, Saltos Azules, Hoyo Azul, Eco Splash Zip Line o Canopy, cueva taína, Iguanalandia; menores de 11 precio especial. | **Respaldada por folleto**, opciones sujetas a confirmación |
| `speedboat` | Lancha rápida | `1001279630.jpg` | Transporte ida/vuelta, lancha, piscina natural, snorkel, paseo costero Bávaro–Punta Cana, refrescos no alcohólicos, guías/equipos de seguridad. | **Respaldada por folleto** |
| `fun-park` | Fun Park | `1001279631.jpg` | Transporte, zipline/canopy, buggy doble o familiar, eco safari, paseo a caballo, playa Macao, comida dominicana, bebidas no alcohólicas, equipos de seguridad; menores de 11 precio especial. | **Respaldada por folleto** |
| `party-boat` | Party Boat | `1001279632.jpg` | Transporte, barra libre, snorkel en piscina natural, DJ, snacks ligeros, concurso de baile, animación. **Hoteles de Cap Cana/Uvero Alto con suplemento de transporte**. | **Respaldada por folleto**, importe suplemento no verificado |
| `coco-bongo` | Coco Bongo Regular | `1001279633.jpg` | Transporte grupal ida/vuelta. **Drink Pack: 5 tragos** o **Open Bar: barra libre de bebidas nacionales**, son opciones diferentes. Folleto indica **US$20 adicionales por transporte privado**; vigencia por confirmar. | **Respaldada por folleto**, no mezclar modalidades ni hacer precio final |
| `dolphin` | Dolphin Explorer | `1001279634.jpg` | Transporte, aves exóticas, interacción con león marino y delfines (folleto indica 1 hora), lockers, guías y equipamiento de seguridad. | **Respaldada por folleto**, bienestar animal y condiciones del operador por confirmar |
| `monkeyland` | Monkeyland | `1001279635.jpg` | Transporte, monos ardilla, guías, jardín botánico, flora/árboles frutales/plantas medicinales, plantación de café/cacao con degustación, otros animales; menores de 11 precio especial. | **Respaldada por folleto**, condiciones de interacción por confirmar |
| `scuba-doo` | Scuba Doo | `1001279636.jpg` | Transporte, bebidas no alcohólicas, snorkel 1 h, experiencia de inmersión 1 h según flyer, snacks, seguridad y barco fondo de cristal. | **Respaldada por folleto**, límites/edad/salud de la inmersión por confirmar |
| `catalina` | Isla Catalina | *No identificada entre las diez capturas de esta tanda* | El prototipo lista transporte, snorkel, almuerzo y guía. **No declarar verificado sin confrontar el folleto exacto**. | **Pendiente de trazabilidad visual en esta tanda** |

## Resultado comparativo

- Las fichas `buggies` y `saona` **ya no están ausentes de la evidencia aportada**: existían en `app.js` y sus puntos centrales coinciden con los folletos recién compartidos.
- Para las otras ocho excursiones documentadas, las inclusiones principales en `app.js` son coherentes con el folleto. Las notas cautelares de `party-boat` y `coco-bongo` preservan correctamente suplementos/modalidades.
- El sitio presenta **11 tarjetas**, pero en esta auditoría **10/11 tienen referencia visual a la captura recibida**. El catálogo no debe presentarse como 11/11 comprobadas hasta localizar el folleto de Catalina u otra prueba del operador.
- Las fotos de los flyers son miniaturas ilustrativas, no media HD usable para hero ni prueba de titularidad comercial. **No subirlas a la web como galerías premium.**
- Si un flyer tiene falta ortográfica o traducción imperfecta, transcribir contenido sin convertir erratas en promesas. Los textos portugueses del flyer son materia de referencia, no una traducción final automáticamente aprobada.
- No se validaron precios vigentes, calendario, reservas reales, horarios, rutas, flota, permisos, licencias, disponibilidad ni pagos.

## Próximas tareas de producto

1. Cotejar ficha de Isla Catalina y cualquier material adicional del usuario.
2. Completar portugués brasileño ES/EN/PT, incluidos filtros, fichas, interfaz de itinerario y WhatsApp.
3. Usar material fotográfico de calidad con derechos confirmados y, si son ilustraciones IA, declararlo con una nota discreta.
4. Añadir cotizador separado de traslados nacionales punto a punto, sin distancias ni tarifas inventadas.
5. Conservar PR #1 en modo **draft**, sin tocar `main` ni publicar hasta aprobación.
