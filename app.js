import { initTripPlanner } from './planner.js';

const tours = [
  {
    id:'scape-park', name:'Scape Park', en:'Scape Park', category:'nature', categoryLabel:'NATURALEZA · AVENTURA', categoryEn:'NATURE · ADVENTURE',
    short:'Saltos azules, cenotes, canopy y rincones de la cultura taína.', shortEn:'Blue pools, cenotes, canopy and corners of Taíno culture.',
    description:'Un día para conectar con la naturaleza y descubrir paisajes de agua cristalina, aventura y cultura en un mismo lugar.', descriptionEn:'A day to connect with nature and discover crystal-clear water, adventure and culture in one place.',
    inclusions:['Transporte de ida y vuelta','Ruta cultural','Saltos Azules','Hoyo Azul','Zip Line Eco Splash o Canopy','Expedición a la cueva Taína','Iguanalandia'],
    inclusionsEn:['Round-trip transportation','Cultural route','Blue Jumps','Hoyo Azul','Eco Splash Zip Line or Canopy','Expedition to the Taíno cave','Iguanalandia'],
    note:'Tarifa especial para menores de 11 años: consultar.' , noteEn:'Special rate for children under 11: please inquire.',
    search:'scape park saltos azules hoyo azul zipline canopy cueva taina iguana'
  },
  {
    id:'buggies', name:'Buggies, Polaris y ATV', en:'Buggies, Polaris & ATV', category:'adventure', categoryLabel:'AVENTURA · TIERRA', categoryEn:'ADVENTURE · OFF-ROAD',
    short:'Aventura todoterreno, sabores dominicanos y playa Macao.', shortEn:'Off-road adventure, Dominican flavors and Macao Beach.',
    description:'Recorre caminos tropicales, haz una parada artesanal para conocer sabores dominicanos y disfruta de un cenote de agua dulce y playa Macao.', descriptionEn:'Ride tropical trails, stop at an artisan route to discover Dominican flavors, then enjoy a freshwater cenote and Macao Beach.',
    inclusions:['Transporte de ida y vuelta','Parada artesanal: café, cacao, mamajuana, ron dominicano y tabaco','Cenote natural de agua dulce','Playa Macao'],
    inclusionsEn:['Round-trip transportation','Artisan stop: coffee, cacao, mamajuana, Dominican rum and tobacco','Natural freshwater cenote','Macao Beach'],
    note:'El visitante conduce la máquina. Confirma con el operador los requisitos de conducción y seguridad antes de reservar.', noteEn:'Guests drive the vehicle. Confirm driving and safety requirements with the operator before booking.',
    search:'buggies polaris atv four wheels off road macao playa cenote cafe cacao mamajuana'
  },
  {
    id:'catalina', name:'Isla Catalina', en:'Catalina Island', category:'sea', categoryLabel:'MAR · SNORKEL', categoryEn:'SEA · SNORKEL',
    short:'Aguas caribeñas, snorkel, almuerzo buffet y tiempo para disfrutar.', shortEn:'Caribbean waters, snorkeling, buffet lunch and time to enjoy.',
    description:'Una escapada al mar para explorar el mundo submarino, disfrutar del almuerzo y vivir una jornada caribeña con guía y animación.', descriptionEn:'A sea escape to explore the underwater world, enjoy lunch and spend a Caribbean day with a guide and entertainment.',
    inclusions:['Transporte terrestre','Transporte marítimo','Equipo de snorkel','Visita al banco o cardumen de peces','Almuerzo tipo buffet','Barra libre de bebidas alcohólicas y no alcohólicas','Guía oficial y animación'],
    inclusionsEn:['Ground transportation','Marine transportation','Snorkeling equipment','Visit to the school of fish','Buffet-style lunch','Open bar with alcoholic and non-alcoholic drinks','Official guide and entertainment'],
    note:'Tarifa especial para menores de 11 años: consultar.', noteEn:'Special rate for children under 11: please inquire.',
    search:'catalina isla snorkel peces buffet bebida playa boat'
  },
  {
    id:'saona', name:'Isla Saona', en:'Saona Island', category:'sea', categoryLabel:'MAR · ISLA', categoryEn:'SEA · ISLAND',
    short:'Piscina natural, barco de fiesta, playa y sabor dominicano.', shortEn:'Natural pool, party boat, beach time and Dominican flavor.',
    description:'Un clásico del Caribe dominicano: transporte marítimo, piscina natural, música, almuerzo buffet y bebidas para disfrutar el día.', descriptionEn:'A Dominican Caribbean classic: boat transfer, natural pool, music, buffet lunch and drinks to enjoy the day.',
    inclusions:['Transporte terrestre','Transporte marítimo','Party boat / barco de fiesta','Visita a piscina natural','Almuerzo tipo buffet','Bebidas alcohólicas y no alcohólicas','Guía oficial y animación'],
    inclusionsEn:['Ground transportation','Marine transportation','Party boat','Visit to a natural pool','Buffet-style lunch','Alcoholic and non-alcoholic drinks','Official guide and entertainment'],
    note:'Tarifa especial para menores de 11 años: consultar.', noteEn:'Special rate for children under 11: please inquire.',
    search:'saona isla party boat piscina natural almuerzo buffet'
  },
  {
    id:'scuba-doo', name:'Scuba Doo', en:'Scuba Doo', category:'sea', categoryLabel:'MAR · EXPLORACIÓN', categoryEn:'SEA · EXPLORATION',
    short:'Una experiencia submarina diferente con paseo en barco de fondo de cristal.', shortEn:'A different underwater experience with a glass-bottom boat ride.',
    description:'Descubre el paisaje submarino con una experiencia Scuba Doo, equipo de seguridad y un recorrido en barco con fondo de cristal.', descriptionEn:'Discover the underwater world with a Scuba Doo experience, safety equipment and a glass-bottom boat ride.',
    inclusions:['Transporte de ida y vuelta','Bebidas no alcohólicas','Una hora de snorkel','Una hora de inmersión / experiencia Scuba Doo','Snacks ligeros','Equipos de seguridad','Barco con fondo de cristal'],
    inclusionsEn:['Round-trip transportation','Non-alcoholic drinks','One hour of snorkeling','One-hour dive / Scuba Doo experience','Light snacks','Safety equipment','Glass-bottom boat'],
    note:'Confirma con el operador los detalles exactos de la inmersión, condiciones y requisitos de participación.', noteEn:'Confirm exact dive details, conditions and participation requirements with the operator.',
    search:'scuba doo scuba underwater snorkel glass bottom boat dive'
  },
  {
    id:'dolphin', name:'Dolphin Explorer', en:'Dolphin Explorer', category:'sea', categoryLabel:'MAR · VIDA MARINA', categoryEn:'SEA · MARINE LIFE',
    short:'Una experiencia guiada de interacción marina y visita a aves exóticas.', shortEn:'A guided marine interaction experience and exotic bird visit.',
    description:'Una jornada de experiencias guiadas que incluye visita a aves exóticas, interacción con león marino y una experiencia con delfines.', descriptionEn:'A guided experience featuring exotic birds, sea lion interaction and a dolphin experience.',
    inclusions:['Transporte de ida y vuelta','Visita a aves exóticas','Interacción con león marino','Interacción con delfines (1 hora)','Lockers para guardar tus pertenencias','Equipos de seguridad y guías'],
    inclusionsEn:['Round-trip transportation','Visit to exotic birds','Sea lion interaction','Dolphin interaction (1 hour)','Lockers for your belongings','Safety equipment and guides'],
    note:'Las actividades con animales y sus condiciones dependen del operador. Confirma programa, requisitos y disponibilidad antes de reservar.', noteEn:'Animal activities and conditions depend on the operator. Confirm the program, requirements and availability before booking.',
    search:'dolphin explorer dolphin león marino aves birds animals'
  },
  {
    id:'speedboat', name:'Lancha rápida', en:'Speedboat', category:'sea', categoryLabel:'MAR · VELOCIDAD', categoryEn:'SEA · SPEED',
    short:'Recorre la costa de Bávaro–Punta Cana y disfruta de la piscina natural.', shortEn:'Explore the Bávaro–Punta Cana coast and enjoy the natural pool.',
    description:'Sal al mar a bordo de una lancha rápida, recorre la costa de Bávaro–Punta Cana y haz una parada para disfrutar de la piscina natural.', descriptionEn:'Head out on a speedboat, explore the Bávaro–Punta Cana coastline and stop to enjoy the natural pool.',
    inclusions:['Transporte de ida y vuelta','Lancha rápida','Piscina natural','Equipo de snorkel','Recorrido por la costa de Bávaro–Punta Cana','Bebidas no alcohólicas','Guías y equipos de seguridad'],
    inclusionsEn:['Round-trip transportation','Speedboat','Natural pool','Snorkeling equipment','Bávaro–Punta Cana coastal tour','Non-alcoholic drinks','Guides and safety equipment'],
    note:'La ruta y las condiciones del mar pueden influir en el recorrido. Confirma los detalles con el operador.', noteEn:'The route and sea conditions may affect the trip. Confirm details with the operator.',
    search:'lancha rapida speedboat paseo costa bavaro punta cana piscina natural snorkel'
  },
  {
    id:'coco-bongo', name:'Coco Bongo Regular', en:'Coco Bongo Regular', category:'night', categoryLabel:'NOCHE · SHOW', categoryEn:'NIGHT · SHOW',
    short:'Una noche de espectáculo con dos opciones de bebidas para elegir.', shortEn:'A night of entertainment with two drink options to choose from.',
    description:'Disfruta de Coco Bongo con transporte grupal de ida y vuelta y elige el paquete de bebidas que prefieras.', descriptionEn:'Enjoy Coco Bongo with group round-trip transportation and choose the drink package that suits you.',
    inclusions:['Transporte grupal de ida y vuelta','Drink Pack: cinco (5) tragos de bebidas nacionales','Open Bar: barra libre toda la noche de bebidas nacionales (ron, vodka, whisky, gin, tequila y cerveza)','Transporte privado: US$20 adicionales según folleto'],
    inclusionsEn:['Group round-trip transportation','Drink Pack: five (5) national drinks','Open Bar: all-night national drinks (rum, vodka, whisky, gin, tequila and beer)','Private transportation: US$20 extra according to the brochure'],
    note:'Drink Pack y Open Bar son opciones distintas. El suplemento de transporte privado de US$20 aparece en el folleto: confirma vigencia y condiciones antes de reservar.', noteEn:'Drink Pack and Open Bar are separate options. The brochure lists a US$20 private transport supplement: confirm that it is current and check its conditions before booking.',
    search:'coco bongo regular night show drink pack open bar drinks rum vodka'
  },
  {
    id:'fun-park', name:'Fun Park', en:'Fun Park', category:'adventure', categoryLabel:'AVENTURA · MULTIACTIVIDAD', categoryEn:'ADVENTURE · MULTI-ACTIVITY',
    short:'Canopy, buggy familiar, safari ecológico, caballos y playa Macao.', shortEn:'Canopy, family buggy, eco safari, horseback ride and Macao Beach.',
    description:'Un día variado para combinar adrenalina, naturaleza y cultura dominicana: canopy o zipline, buggy doble o familiar, safari ecológico, paseo a caballo y playa Macao.', descriptionEn:'A varied day combining adrenaline, nature and Dominican culture: canopy or zipline, double or family buggy, eco safari, horseback ride and Macao Beach.',
    inclusions:['Transporte de ida y vuelta','Zipline o Canopy','Buggy doble o familiar','Eco Safari','Paseo a caballo','Playa Macao','Comida típica dominicana','Bebidas no alcohólicas','Equipos de seguridad'],
    inclusionsEn:['Round-trip transportation','Zipline or canopy','Double or family buggy','Eco safari','Horseback ride','Macao Beach','Typical Dominican food','Non-alcoholic beverages','Safety equipment'],
    note:'Confirma con el operador las opciones disponibles, requisitos de participación y detalles de seguridad antes de reservar.', noteEn:'Confirm available options, participation requirements and safety details with the operator before booking.',
    search:'fun park canopy zipline buggy safari caballo horse playa macao comida dominicana'
  },
  {
    id:'monkeyland', name:'Monkeyland', en:'Monkeyland', category:'nature', categoryLabel:'NATURALEZA · ANIMALES', categoryEn:'NATURE · ANIMALS',
    short:'Monos ardilla, jardín botánico y degustación de café y cacao.', shortEn:'Squirrel monkeys, botanical garden and coffee and cacao tasting.',
    description:'Explora un entorno tropical con guías experimentados, visita el jardín botánico y conoce flores, árboles frutales y plantas medicinales. El folleto también incluye una visita a una plantación dominicana de café y cacao con degustación.', descriptionEn:'Explore a tropical setting with experienced guides, visit the botanical garden and discover flowers, fruit trees and medicinal plants. The brochure also includes a visit to a Dominican coffee and cacao plantation with tasting.',
    inclusions:['Transporte de ida y vuelta','Interacción con monos ardilla','Guías experimentados','Visita al jardín botánico','Exploración de flores, árboles frutales y plantas medicinales','Visita a plantación dominicana de café y cacao con degustación','Interacción con otros animales'],
    inclusionsEn:['Round-trip transportation','Interaction with squirrel monkeys','Experienced guides','Botanical garden visit','Exploration of flowers, fruit trees and medicinal plants','Visit to a Dominican coffee and cacao plantation with tasting','Interaction with other animals'],
    note:'La interacción con animales está sujeta a las normas del lugar y al bienestar animal. Confirma programa, accesibilidad y condiciones con el operador.', noteEn:'Animal interaction is subject to venue rules and animal welfare. Confirm the program, accessibility and conditions with the operator.',
    search:'monkeyland monos mono ardilla botanical garden cafe cacao naturaleza animales'
  },
  {
    id:'party-boat', name:'Party Boat', en:'Party Boat', category:'sea', categoryLabel:'MAR · FIESTA', categoryEn:'SEA · PARTY',
    short:'Barco, piscina natural, snorkel, DJ y concursos de baile.', shortEn:'Boat, natural pool, snorkeling, DJ and dance competitions.',
    description:'Una salida en barco con ambiente festivo, barra abierta, snorkel en una piscina natural, música nacional e internacional, snacks ligeros y animación.', descriptionEn:'A festive boat outing with open bar, snorkeling in a natural pool, Dominican and international music, light snacks and entertainment.',
    inclusions:['Transporte de ida y vuelta','Barra abierta de bebidas','Snorkel en piscina natural','DJ con música nacional e internacional','Snacks ligeros','Concursos de baile con premios','Animación y shows'],
    inclusionsEn:['Round-trip transportation','Open bar of drinks','Snorkeling in a natural pool','DJ with national and international music','Light snacks','Dance competitions with prizes','Entertainment and shows'],
    note:'Los hoteles de Cap Cana y Uvero Alto pueden requerir una tarifa adicional de transporte según el folleto. Confirma vigencia y monto con el operador.', noteEn:'Hotels in Cap Cana and Uvero Alto may require an additional transportation fee according to the brochure. Confirm the current fee and amount with the operator.',
    search:'party boat barco fiesta snorkel piscina natural dj open bar baile'
  }
];

const translations = {
  es: {
    navHome:'Inicio',navTours:'Excursiones',navPlanner:'Mi viaje',navTransport:'Transporte',navAbout:'Nosotros',navFaq:'Preguntas',navCta:'Cotizar viaje',
    heroEyebrow:'EL LADO MÁS VIVO DEL CARIBE',heroLine1:'El Caribe',heroLine2:'no se cuenta.',heroLine3:'Se vive.',heroDescription:'Playas que parecen un sueño, aventuras que te suben la adrenalina y momentos dominicanos que se quedan contigo.',heroExplore:'Explorar experiencias',heroQuote:'Planear mi aventura',heroLocation:'Punta Cana · Bávaro · República Dominicana',scrollText:'DESLIZA PARA DESCUBRIR',soundOff:'Sonido: apagado',soundOn:'Sonido: encendido',
    introStrip:'EL SOL PONE EL ESCENARIO. <strong>TÚ PONES LA HISTORIA.</strong>',toursEyebrow:'ELIGE TU PRÓXIMO RECUERDO',toursTitle:'Aventuras para<br /><em>salir de la rutina.</em>',toursCopy:'Del azul transparente de nuestras islas a la emoción de recorrer caminos tropicales. Hay una experiencia esperando por ti.',filterAll:'Todas',filterSea:'Mar',filterAdventure:'Aventura',filterNature:'Naturaleza',filterNight:'Noche',searchPlaceholder:'Buscar una experiencia...',catalogueNote:'Los precios y la disponibilidad se confirman al cotizar. Las experiencias y sus inclusiones pueden variar según el operador y la fecha.',
    transportEyebrow:'EL VIAJE TAMBIÉN IMPORTA',transportTitle:'Muévete por<br /><em>el paraíso.</em>',transportCopy:'Que el camino sea parte de la experiencia. Cuéntanos desde dónde sales y hacia dónde quieres llegar.',transferAirport:'Traslados privados',transferAirportCopy:'Consulta traslados desde y hacia el aeropuerto.',transferHotels:'Hoteles y excursiones',transferHotelsCopy:'Coordina tu recogida para disfrutar sin complicaciones.',transferGroups:'Grupos y familias',transferGroupsCopy:'Cuéntanos cuántas personas viajan y armamos una cotización.',transportCta:'Cotizar transporte',
    aboutEyebrow:'EL ESPÍRITU DOMINICANO',aboutTitle:'Más que un destino.<br /><em>Una forma de sentir.</em>',aboutCopy:'Aquí el mar tiene mil tonos de azul, la música aparece sin avisar y cada rincón invita a descubrir algo nuevo. Queremos ayudarte a vivir esa energía desde que comienza el viaje.',aboutCta:'Vamos a planearlo',stepsEyebrow:'FÁCIL, CLARO Y A TU RITMO',stepsTitle:'Tu aventura empieza<br /><em>con tres pasos.</em>',step1Title:'Elige la experiencia',step1Copy:'Explora las excursiones y encuentra la que va contigo.',step2Title:'Pide tu cotización',step2Copy:'Dinos la fecha, cuántos viajan y dónde te encuentras.',step3Title:'Confirma y disfruta',step3Copy:'El operador confirma disponibilidad, precio y detalles. ¡A vivir el Caribe!',
    quoteEyebrow:'VAMOS A HACERLO REALIDAD',quoteTitle:'Cuéntanos qué<br /><em>te gustaría vivir.</em>',quoteCopy:'Completa los detalles y prepara tu solicitud. Te ayudaremos a confirmar disponibilidad, precio y logística.',quoteAssurance:'Tu solicitud no es una reserva confirmada. El operador debe validar todos los detalles antes de cerrar.',formTitle:'PLANEA TU EXPERIENCIA',fieldExperience:'¿Qué te interesa?',selectExperience:'Selecciona una experiencia',fieldDate:'Fecha deseada',fieldPeople:'Personas',fieldChildren:'Menores y edades',childrenPlaceholder:'Ej. 1 niño de 8 años',fieldPickup:'Hotel / zona de recogida',pickupPlaceholder:'¿Dónde te hospedas?',fieldName:'Tu nombre',namePlaceholder:'Nombre y apellido',fieldContact:'WhatsApp o email',contactPlaceholder:'¿Cómo te contactamos?',fieldNotes:'Algo más que debamos saber (opcional)',notesPlaceholder:'Horario preferido, detalles del traslado...',privacyConsent:'Acepto que utilicen estos datos para responder mi solicitud de cotización.',sendQuote:'Preparar mi cotización',formPrivacy:'No se procesa ningún pago aquí. La reserva solo queda confirmada cuando el operador lo indique expresamente.',
    faqEyebrow:'ANTES DE LANZARTE',faqTitle:'Lo que quieres<br /><em>saber.</em>',faqCopy:'Una buena aventura empieza con información clara. Aquí van algunas respuestas útiles.',footerLine:'El Caribe no se cuenta. Se vive.',footerLocation:'Punta Cana · República Dominicana',footerNote:'Experiencias sujetas a confirmación del operador.',floatingCta:'Cotiza tu aventura',includedTitle:'¿Qué incluye?',modalCta:'Cotizar esta experiencia',viewDetails:'Ver experiencia',askPrice:'Consultar precio',noResults:'No encontramos experiencias con esa búsqueda. Prueba con otra palabra.',transportOption:'Transporte / traslado',formSuccess:'Tu solicitud está preparada. ',copySuccess:'El mensaje se copió. Puedes pegarlo en tu WhatsApp o enviarlo a tu asesor.',configureWhatsapp:'El WhatsApp oficial aún no está configurado. Copia el mensaje y compártelo con tu asesor.',copyFailed:'No se pudo copiar automáticamente. Revisa los datos y vuelve a intentarlo.',selectTourError:'Selecciona una experiencia o transporte.',faqQuestions:[['¿Los precios están publicados?','Todavía no se han facilitado tarifas oficiales. Solicita una cotización para confirmar el precio vigente, la moneda y lo que incluye.'],['¿La solicitud confirma mi reserva?','No. El formulario prepara una solicitud. La reserva queda confirmada solo cuando el operador verifica disponibilidad, precio, punto de recogida y condiciones.'],['¿Incluyen transporte?','Cada ficha muestra los traslados que aparecen en el folleto. Para transporte privado, aeropuerto, hotel o rutas concretas, solicita una cotización indicando origen y destino.'],['¿Hay tarifa para niños?','El folleto menciona tarifa especial para menores de 11 años en Scape Park, Isla Catalina e Isla Saona. Confirma el precio y las edades con el operador antes de reservar.'],['¿Qué debo llevar?','Como orientación general: traje de baño, toalla, protección solar, ropa cómoda y una identificación. Revisa las instrucciones específicas que te envíe el operador.'],['¿Cuáles son las políticas de cancelación?','Las condiciones pueden depender de la excursión y del operador. Pide las políticas vigentes por escrito antes de realizar cualquier pago.']] 
  },
  en: {
    navHome:'Home',navTours:'Excursions',navPlanner:'My trip',navTransport:'Transportation',navAbout:'About us',navFaq:'FAQs',navCta:'Get a quote',
    heroEyebrow:'THE MOST VIBRANT SIDE OF THE CARIBBEAN',heroLine1:'The Caribbean',heroLine2:'is not told.',heroLine3:'It is lived.',heroDescription:'Dreamlike beaches, adrenaline-filled adventures and Dominican moments that stay with you.',heroExplore:'Explore experiences',heroQuote:'Plan my adventure',heroLocation:'Punta Cana · Bávaro · Dominican Republic',scrollText:'SCROLL TO DISCOVER',soundOff:'Sound: off',soundOn:'Sound: on',
    introStrip:'THE SUN SETS THE STAGE. <strong>YOU MAKE THE STORY.</strong>',toursEyebrow:'CHOOSE YOUR NEXT MEMORY',toursTitle:'Adventures to<br /><em>break the routine.</em>',toursCopy:'From the crystal-clear blue of our islands to the thrill of tropical trails. There is an experience waiting for you.',filterAll:'All',filterSea:'Sea',filterAdventure:'Adventure',filterNature:'Nature',filterNight:'Night',searchPlaceholder:'Search experiences...',catalogueNote:'Prices and availability are confirmed when you request a quote. Experiences and inclusions may vary by operator and date.',
    transportEyebrow:'THE JOURNEY MATTERS TOO',transportTitle:'Move around<br /><em>paradise.</em>',transportCopy:'Let the journey be part of the experience. Tell us where you are leaving from and where you want to go.',transferAirport:'Private transfers',transferAirportCopy:'Ask about transfers to and from the airport.',transferHotels:'Hotels and excursions',transferHotelsCopy:'Coordinate your pickup and enjoy the day without hassle.',transferGroups:'Groups and families',transferGroupsCopy:'Tell us how many people are travelling and we will prepare a quote.',transportCta:'Get a transport quote',
    aboutEyebrow:'THE DOMINICAN SPIRIT',aboutTitle:'More than a destination.<br /><em>A way to feel.</em>',aboutCopy:'Here the sea has a thousand shades of blue, music appears when you least expect it, and every corner invites you to discover something new. We want to help you feel that energy from the moment your trip begins.',aboutCta:'Let’s plan it',stepsEyebrow:'EASY, CLEAR AND AT YOUR PACE',stepsTitle:'Your adventure starts<br /><em>in three steps.</em>',step1Title:'Choose your experience',step1Copy:'Explore the excursions and find the one that suits you.',step2Title:'Request a quote',step2Copy:'Tell us the date, number of travellers and where you are staying.',step3Title:'Confirm and enjoy',step3Copy:'The operator confirms availability, price and details. Time to live the Caribbean!',
    quoteEyebrow:'LET’S MAKE IT HAPPEN',quoteTitle:'Tell us what you<br /><em>would love to do.</em>',quoteCopy:'Fill in the details and prepare your request. We will help you confirm availability, price and logistics.',quoteAssurance:'Your request is not a confirmed booking. The operator must validate all details before final confirmation.',formTitle:'PLAN YOUR EXPERIENCE',fieldExperience:'What are you interested in?',selectExperience:'Select an experience',fieldDate:'Preferred date',fieldPeople:'Travellers',fieldChildren:'Children and ages',childrenPlaceholder:'e.g. 1 child, age 8',fieldPickup:'Hotel / pickup area',pickupPlaceholder:'Where are you staying?',fieldName:'Your name',namePlaceholder:'First and last name',fieldContact:'WhatsApp or email',contactPlaceholder:'How can we contact you?',fieldNotes:'Anything else we should know? (optional)',notesPlaceholder:'Preferred time, transfer details...',privacyConsent:'I agree to the use of this information to respond to my quote request.',sendQuote:'Prepare my quote',formPrivacy:'No payment is processed here. Your booking is confirmed only when the operator expressly confirms it.',
    faqEyebrow:'BEFORE YOU GO',faqTitle:'What you want<br /><em>to know.</em>',faqCopy:'A great adventure starts with clear information. Here are some useful answers.',footerLine:'The Caribbean is not told. It is lived.',footerLocation:'Punta Cana · Dominican Republic',footerNote:'Experiences subject to operator confirmation.',floatingCta:'Get your quote',includedTitle:'What is included?',modalCta:'Get a quote for this experience',viewDetails:'View experience',askPrice:'Ask for price',noResults:'No experiences match your search. Try another word.',transportOption:'Transportation / transfer',formSuccess:'Your request is ready. ',copySuccess:'The message has been copied. You can paste it into WhatsApp or share it with your travel advisor.',configureWhatsapp:'The official WhatsApp number has not been configured yet. Copy the message and share it with your advisor.',copyFailed:'Automatic copy failed. Please review your details and try again.',selectTourError:'Please select an experience or transportation.',faqQuestions:[['Are prices published?','Official rates have not been provided yet. Request a quote to confirm the current price, currency and inclusions.'],['Does this request confirm my booking?','No. The form prepares a request. A booking is confirmed only after the operator checks availability, price, pickup point and conditions.'],['Is transportation included?','Each excursion card lists the transfers shown in the brochure. For private, airport or specific-route transportation, request a quote with your origin and destination.'],['Are there child rates?','The brochure mentions a special rate for children under 11 at Scape Park, Catalina Island and Saona Island. Confirm the current price and age rules with the operator before booking.'],['What should I bring?','As a general suggestion: swimwear, a towel, sun protection, comfortable clothing and an ID. Follow the specific instructions sent by the operator.'],['What are the cancellation policies?','Conditions may depend on the excursion and operator. Ask for the current policy in writing before making any payment.']]
  }
};

let currentLang = 'es';
let activeFilter = 'all';
let activeModalTour = null;
let tripPlanner = null;
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
const t = key => translations[currentLang][key] || key;

function tourArtwork(tour){
  const themes={
    'scape-park':{sky:['#62d7d0','#0b7487'],accent:'#d8ffe9',label:'CENOTE + CANOPY'},
    'buggies':{sky:['#e8b56f','#7b4b31'],accent:'#ffd36e',label:'OFF ROAD'},
    'catalina':{sky:['#7ce4e3','#087caa'],accent:'#fff2c9',label:'ISLA CATALINA'},
    'saona':{sky:['#69d7ed','#087d9b'],accent:'#ffe3a0',label:'ISLA SAONA'},
    'scuba-doo':{sky:['#2c9eb3','#052b58'],accent:'#ffe267',label:'EXPLORACIÓN SUBMARINA'},
    'dolphin':{sky:['#82dcf0','#157eaa'],accent:'#e6fbff',label:'VIDA MARINA'},
    'speedboat':{sky:['#62d9ec','#087a9a'],accent:'#fff0cf',label:'LANCHA RÁPIDA'},
    'coco-bongo':{sky:['#36215f','#090d2d'],accent:'#ff69b4',label:'SHOW + NIGHTLIFE'},
    'fun-park':{sky:['#8cdb91','#23764d'],accent:'#ffe38a',label:'AVENTURA TOTAL'},
    'monkeyland':{sky:['#a4df89','#266847'],accent:'#f5d7a0',label:'SELVA TROPICAL'},
    'party-boat':{sky:['#62d9ec','#087a9a'],accent:'#ff87b9',label:'FIESTA EN EL MAR'}
  };
  const p=themes[tour.id]||themes.saona;
  const isNight=tour.id==='coco-bongo';
  const water=['saona','catalina','scuba-doo','dolphin','speedboat','party-boat'].includes(tour.id);
  const palm=`<g transform="translate(80 215)" stroke-linecap="round" fill="none"><path d="M0 0 Q-4 -45 7 -88" stroke="#805638" stroke-width="9"/><path d="M7 -88 Q-35 -126 -68 -112 M7 -88 Q-16 -139 8 -153 M7 -88 Q51 -131 77 -111 M7 -88 Q52 -95 91 -72 M7 -88 Q-45 -83 -83 -54" stroke="#236b54" stroke-width="8"/><path d="M7 -88 Q-35 -126 -68 -112 M7 -88 Q-16 -139 8 -153 M7 -88 Q51 -131 77 -111 M7 -88 Q52 -95 91 -72 M7 -88 Q-45 -83 -83 -54" stroke="#54a66d" stroke-width="3"/></g>`;
  const waves=`<path d="M0 240 Q80 210 160 240 T320 240 T480 240 V340 H0Z" fill="#087d9b" opacity=".86"/><path d="M0 267 Q80 237 160 267 T320 267 T480 267 V340 H0Z" fill="#13b8b4" opacity=".8"/><path d="M0 292 Q80 271 160 292 T320 292 T480 292 V340 H0Z" fill="#b6eee0" opacity=".8"/>`;
  let subject='';
  if(tour.id==='buggies'||tour.id==='fun-park') subject=`<g transform="translate(240 190)"><ellipse cx="0" cy="58" rx="105" ry="13" fill="#092d2b" opacity=".25"/><path d="M-83 2 L-58 -40 H35 L77 -4 L68 30 H-71Z" fill="#54bd37" stroke="#183e32" stroke-width="7"/><path d="M-45 -36 L-26 -77 H27 L49 -36Z" fill="#182f31" stroke="#e5d7ae" stroke-width="6"/><circle cx="-57" cy="35" r="25" fill="#172b2b" stroke="#b6b9a6" stroke-width="8"/><circle cx="57" cy="35" r="25" fill="#172b2b" stroke="#b6b9a6" stroke-width="8"/><path d="M-36 -80 L-55 -120 M35 -80 L59 -121" stroke="#f4d78d" stroke-width="5"/></g>`;
  else if(tour.id==='scuba-doo') subject=`<g transform="translate(240 165)"><circle cx="0" cy="0" r="75" fill="#ffdc43" stroke="#fff2b6" stroke-width="10"/><circle cx="0" cy="0" r="47" fill="#12465c" stroke="#d8f8f3" stroke-width="8"/><path d="M-29 -8 Q0 -30 29 -8 L29 17 Q0 31 -29 17Z" fill="#83e4e8" opacity=".45"/><path d="M-75 71 H75" stroke="#d7d4be" stroke-width="15" stroke-linecap="round"/><circle cx="-25" cy="-3" r="5" fill="#fff"/><circle cx="25" cy="-3" r="5" fill="#fff"/></g><g fill="none" stroke="#c9fff7" stroke-width="4" opacity=".85"><circle cx="112" cy="123" r="8"/><circle cx="360" cy="88" r="12"/><circle cx="390" cy="162" r="5"/></g>`;
  else if(tour.id==='dolphin') subject=`<g transform="translate(245 175)" fill="#d2f4fb"><path d="M-104 0 Q-65 -60 6 -33 Q54 -14 76 -52 Q103 -21 67 12 Q31 51 -31 35 Q-79 25 -104 0Z"/><path d="M-13 -30 L-34 -78 Q3 -67 19 -35Z"/><path d="M-80 13 L-123 49 L-97 1Z"/><path d="M66 -3 L114 -25 L89 8Z"/></g>`;
  else if(tour.id==='monkeyland') subject=`<g transform="translate(245 175)"><path d="M-85 68 Q-120 9 -74 -33 Q-28 -77 9 -34 Q53 -78 91 -29 Q130 30 72 73 Q-3 107 -85 68Z" fill="#986f4b"/><ellipse cx="-28" cy="16" rx="28" ry="36" fill="#f0d1a5"/><ellipse cx="34" cy="16" rx="28" ry="36" fill="#f0d1a5"/><circle cx="-38" cy="5" r="6" fill="#172a27"/><circle cx="-15" cy="5" r="6" fill="#172a27"/><circle cx="24" cy="5" r="6" fill="#172a27"/><circle cx="47" cy="5" r="6" fill="#172a27"/><path d="M-28 38 Q-20 48 -9 38 M34 38 Q42 48 53 38" stroke="#70452e" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
  else if(tour.id==='coco-bongo') subject=`<g transform="translate(240 170)"><path d="M-130 65 V-43 Q0 -155 130 -43 V65" fill="none" stroke="#ff4ca1" stroke-width="15"/><path d="M-105 64 V-31 Q0 -123 105 -31 V64" fill="none" stroke="#54e9ff" stroke-width="6"/><path d="M-125 69 H125" stroke="#ffe26d" stroke-width="14"/><path d="M-70 65 L-87 -38 M0 65 V-61 M70 65 L87 -38" stroke="#a67cff" stroke-width="7"/><circle cx="-150" cy="-60" r="8" fill="#ffe26d"/><circle cx="145" cy="-93" r="10" fill="#6bf4d0"/></g>`;
  else if(tour.id==='speedboat'||tour.id==='party-boat'||tour.id==='saona'||tour.id==='catalina') subject=`<g transform="translate(245 188)"><path d="M-126 6 Q0 53 125 5 L88 47 Q0 83 -94 47Z" fill="#fff7e5" stroke="#0d536b" stroke-width="8"/><path d="M-8 -5 V-116" stroke="#fff6dc" stroke-width="7"/><path d="M-4 -107 L-4 -13 L67 -24Z" fill="#fff0d0"/><path d="M-15 -100 L-15 -24 L-87 -12Z" fill="#f7c86a"/><path d="M-82 54 Q-12 79 74 53" fill="none" stroke="#e7fcfa" stroke-width="6"/></g>`;
  else subject=`<g transform="translate(245 178)"><path d="M-100 52 L-56 -50 H55 L100 52Z" fill="#e7cf9c"/><path d="M-52 -50 Q0 -105 53 -50" fill="#258554"/><path d="M-20 -12 L-20 -67 M20 -12 L20 -67" stroke="#d7f0df" stroke-width="5"/><path d="M-55 53 Q0 30 55 53" fill="none" stroke="#fff0cb" stroke-width="7"/></g>`;
  const horizon=water?`<path d="M0 215 Q120 190 245 212 T480 208 V340 H0Z" fill="#e6cb8a" opacity=".9"/>${palm}`:`<path d="M0 230 Q90 170 185 220 T360 210 L480 185 V340 H0Z" fill="#1d694d"/>${palm}<g transform="translate(415 245) scale(.72)">${palm}</g>`;
  const sun=isNight?`<circle cx="382" cy="60" r="27" fill="#ff4eab" opacity=".88"/>`:`<circle cx="378" cy="66" r="34" fill="#ffe4a1" opacity=".95"/><circle cx="378" cy="66" r="52" fill="#ffe4a1" opacity=".15"/>`;
  const background=isNight?'#130f36':'#79d7d0';
  return `<svg class="theme-art-svg" viewBox="0 0 480 340" role="img" aria-label="Ilustración vectorial generada por código para ${tour.name}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g-${tour.id}" x2="0" y2="1"><stop stop-color="${p.sky[0]}"/><stop offset="1" stop-color="${p.sky[1]}"/></linearGradient><radialGradient id="gl-${tour.id}"><stop stop-color="${p.accent}" stop-opacity=".55"/><stop offset="1" stop-color="${p.accent}" stop-opacity="0"/></radialGradient></defs><rect width="480" height="340" fill="url(#g-${tour.id})"/><circle cx="345" cy="80" r="120" fill="url(#gl-${tour.id})"/>${sun}${horizon}${water?'':`<path d="M0 289 Q100 264 190 290 T370 282 T480 275 V340 H0Z" fill="#e3bd79" opacity=".9"/>`}${water?waves:''}${subject}<g fill="${p.accent}" opacity=".78"><circle cx="45" cy="76" r="2.5"/><circle cx="73" cy="121" r="3"/><circle cx="431" cy="135" r="2"/><circle cx="395" cy="205" r="2.5"/></g><text x="22" y="30" font-family="Arial,sans-serif" font-size="10" letter-spacing="3" fill="white" opacity=".88">${p.label}</text></svg>`;
}

function renderTours(){
  const grid = $('#tourGrid');
  const query = ($('#tourSearch')?.value || '').trim().toLowerCase();
  const visible = tours.filter(tour => {
    const matchesCategory = activeFilter === 'all' || tour.category === activeFilter;
    const haystack = [tour.name,tour.en,tour.short,tour.shortEn,tour.search].join(' ').toLowerCase();
    return matchesCategory && (!query || haystack.includes(query));
  });
  grid.innerHTML = '';
  if(!visible.length){ grid.innerHTML = `<div class="empty-results">${t('noResults')}</div>`; return; }
  visible.forEach(tour=>{
    const card = document.createElement('article');
    card.className = 'tour-card reveal visible'; card.dataset.id = tour.id;
    const name = currentLang==='es'?tour.name:tour.en;
    const short = currentLang==='es'?tour.short:tour.shortEn;
    const label = currentLang==='es'?tour.categoryLabel:tour.categoryEn;
    card.innerHTML = `<div class="tour-card-image">${tourArtwork(tour)}</div><div class="tour-card-content"><div class="tour-card-tag">${label}</div><h3>${name}</h3><p>${short}</p><div class="tour-card-bottom"><small>${t('askPrice')}</small><button type="button" data-tour="${tour.id}">${t('viewDetails')} <span>↗</span></button></div></div>`;
    grid.appendChild(card);
  });
  bindCardTilt();
  tripPlanner?.decorateCards();
}
function openTour(id){
  const tour = tours.find(item=>item.id===id); if(!tour)return;
  activeModalTour = tour;
  const name = currentLang==='es'?tour.name:tour.en;
  $('#modalImage').style.backgroundImage = 'none';
  $('#modalImage').style.backgroundColor = 'transparent';
  setThemedSound(tour);
  $('#modalCategory').textContent = currentLang==='es'?tour.categoryLabel:tour.categoryEn;
  $('#modalTitle').textContent = name;
  $('#modalDescription').textContent = currentLang==='es'?tour.description:tour.descriptionEn;
  $('#modalInclusions').innerHTML = (currentLang==='es'?tour.inclusions:tour.inclusionsEn).map(x=>`<li>${x}</li>`).join('');
  $('#modalNote').textContent = currentLang==='es'?tour.note:tour.noteEn;
  $('#modalQuote').onclick = () => { $('#experienceSelect').value = tour.name; closeTour(); setTimeout(()=>$('#cotizar').scrollIntoView({behavior:'smooth'}),80); };
  tripPlanner?.decorateModal();
  $('#tourModal').classList.add('show'); $('#tourModal').setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); $('#modalClose').focus();
  startTourDiorama(tour);
}
function closeTour(){ if(soundIsOn)setThemedSound(null); $('#tourModal').classList.remove('show'); $('#tourModal').setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); activeModalTour=null; stopTourDiorama(); }

let tour3dRenderer=null, tour3dFrame=0, tour3dResize=null, tour3dPointer={x:0,y:0}, tour3dCanvasRef=null;
function stopTourDiorama(){
  if(tour3dFrame)cancelAnimationFrame(tour3dFrame);
  if(tour3dResize)window.removeEventListener('resize',tour3dResize);
  if(tour3dRenderer){tour3dRenderer.dispose();tour3dRenderer=null;}
  tour3dFrame=0;tour3dResize=null;tour3dCanvasRef=null;
}
async function startTourDiorama(tour){
  stopTourDiorama();
  const canvas=$('#tour3dCanvas'), fallback=$('#sceneFallback'), badge=$('#sceneLabel');
  if(!canvas)return;
  tour3dCanvasRef=canvas;
  fallback.textContent='Preparando escenario 3D…';fallback.style.display='flex';
  try{
    const THREE=await import('three');
    if(!canvas.isConnected || !$('#tourModal').classList.contains('show'))return;
    const scene=new THREE.Scene();
    const seaScene=['catalina','saona','scuba-doo','dolphin','speedboat','party-boat'].includes(tour.id);
    const nightScene=tour.id==='coco-bongo';
    scene.background=new THREE.Color(nightScene?0x07102e:(seaScene?0x0b8796:0x9bd0c3));
    scene.fog=new THREE.Fog(scene.background,14,32);
    const camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.set(8,7,11);camera.lookAt(0,1,0);
    const renderer=new THREE.WebGLRenderer({canvas,alpha:false,antialias:true,powerPreference:'low-power'});
    tour3dRenderer=renderer;renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
    const hemi=new THREE.HemisphereLight(0xd8f8ff,0x26483d,2);scene.add(hemi);
    const key=new THREE.DirectionalLight(0xffe5bd,3);key.position.set(-5,10,7);scene.add(key);
    const fill=new THREE.PointLight(nightScene?0xf02fbd:0x4be5e0,nightScene?35:14,25);fill.position.set(5,4,-3);scene.add(fill);
    const mat=(color,roughness=.72,metalness=0,emissive=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness,emissive,emissiveIntensity:emissive?0.65:0});
    const add=(geo,material,x,y,z,sx=1,sy=1,sz=1,parent=scene)=>{const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;};
    const moving=[];
    const waterGeo=new THREE.PlaneGeometry(36,36,44,44);waterGeo.rotateX(-Math.PI/2);
    const water=add(waterGeo,new THREE.MeshPhysicalMaterial({color:nightScene?0x071d43:0x08a9b5,roughness:.22,metalness:.15,clearcoat:1,transparent:true,opacity:.94}),0,-.42,0);
    const waterPos=waterGeo.attributes.position;
    const sand=mat(0xe8cf9d), green=mat(0x23734e), leaf=mat(0x31965e), trunk=mat(0x80563a), white=mat(0xf7f5e9), dark=mat(0x152a32), yellow=mat(0xffd52b,.38), coral=mat(0xff705f), blue=mat(0x32bfe0,.3), glass= new THREE.MeshPhysicalMaterial({color:0x8defff,transparent:true,opacity:.38,roughness:.1,metalness:.1});
    // Palm-tree prop: curved trunk with a crown of tropical fronds.
    function palm(x,z,h=3.5){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(.12,h*.4,0),new THREE.Vector3(-.08,h*.75,0),new THREE.Vector3(.2,h,0)]);g.add(new THREE.Mesh(new THREE.TubeGeometry(curve,16,.10,7,false),trunk));for(let i=0;i<7;i++){const a=i/7*Math.PI*2;const end=new THREE.Vector3(.2+Math.cos(a)*1.3,h-.2+Math.sin(a*.8)*.18,Math.sin(a)*.9);const mid=new THREE.Vector3(.2+Math.cos(a)*.65,h+.2,Math.sin(a)*.45);g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(.2,h,0),mid,end),12,.055,5,false),leaf));}return g;}
    function boat(x=0,z=0,color=0xf8f5eb,party=false){const g=new THREE.Group();g.position.set(x,.08,z);scene.add(g);add(new THREE.SphereGeometry(1,24,16),mat(color,.3,.12),0,0,0,1.6,.28,.62,g);add(new THREE.BoxGeometry(2.1,.14,.9),white,0,.22,0,1,1,1,g);add(new THREE.BoxGeometry(.72,.5,.65),white,-.15,.52,0,1,1,1,g);add(new THREE.BoxGeometry(.57,.2,.04),mat(0x146b7c,.2,.25),-.15,.58,.34,1,1,1,g);if(party){for(let i=0;i<4;i++){const lamp=add(new THREE.SphereGeometry(.09,10,8),[coral,yellow,blue,mat(0xc85eff, .2,0,0x9b36ff)][i],-.7+i*.45,.48,-.26,.9,.9,.9,g);moving.push({obj:lamp,kind:'pulse',phase:i});}}moving.push({obj:g,kind:'boat',phase:Math.random()*6});return g;}
    function buggy(x=0,z=0){const g=new THREE.Group();g.position.set(x,.08,z);scene.add(g);add(new THREE.BoxGeometry(1.8,.38,1.05),mat(0x65c832,.5),0,.5,0,1,1,1,g);add(new THREE.BoxGeometry(.95,.55,.8),dark,-.18,.92,0,1,1,1,g);for(const xw of [-.67,.67])for(const zw of [-.55,.55]){const w=add(new THREE.CylinderGeometry(.29,.29,.19,18),dark,xw,.28,zw,1,1,1,g);w.rotation.z=Math.PI/2;moving.push({obj:w,kind:'wheel'});}add(new THREE.BoxGeometry(2.2,.08,.18),mat(0x313d39),0,.26,0,1,1,1,g);moving.push({obj:g,kind:'drive'});return g;}
    function fish(x,y,z,c=0xffdb66){const g=new THREE.Group();g.position.set(x,y,z);scene.add(g);add(new THREE.SphereGeometry(.23,16,12),mat(c,.35),0,0,0,1.5,.75,.65,g);const tail=add(new THREE.ConeGeometry(.16,.34,3),mat(c),-.38,0,0,1,1,1,g);tail.rotation.z=Math.PI/2;moving.push({obj:g,kind:'fish',phase:Math.random()*7});}
    function bubbles(){for(let i=0;i<18;i++){const b=add(new THREE.SphereGeometry(.045+Math.random()*.05,8,8),glass,(Math.random()-.5)*7,Math.random()*2,(Math.random()-.5)*7);moving.push({obj:b,kind:'bubble',phase:Math.random()*8});}}
    // Common scene floor/background changes by activity category.
    if(seaScene){add(new THREE.SphereGeometry(1,32,20),sand,-5,-.2,-5,4,.34,2);palm(-6,-5,3.2);palm(-4,-6,2.7);for(let i=0;i<9;i++)fish(-4+Math.random()*8,Math.random()*2.1-.1,-2+Math.random()*5,[0xffdf61,0x40d9b8,0xff8e68][i%3]);bubbles();}
    else{add(new THREE.PlaneGeometry(32,32),sand,0,-.5,0,1,1,1).rotation.x=-Math.PI/2;palm(-6,-5,3.3);palm(6,-4,3.8);palm(-5,5,2.8);}
    if(tour.id==='scape-park'){
      for(let i=0;i<7;i++){const rock=add(new THREE.DodecahedronGeometry(1,1),mat([0x77866b,0x596e5d,0x8a9078][i%3]),-4.7+i*1.5,.15,-3,1.1+Math.random()*.5,1.7+Math.random(),1.2);rock.rotation.set(Math.random(),Math.random(),Math.random());}
      add(new THREE.CircleGeometry(2.35,48),blue,0,-.12,1).rotation.x=-Math.PI/2;add(new THREE.BoxGeometry(.35,2.6,.2),glass,0,.95,-3.05);const cable=add(new THREE.CylinderGeometry(.025,.025,9,8),dark,0,4,-1);cable.rotation.z=.25;const rider=new THREE.Group();scene.add(rider);add(new THREE.SphereGeometry(.22,12,12),mat(0xf3bb8c),0,0,0,1,1,1,rider);add(new THREE.CylinderGeometry(.18,.24,.55,10),coral,0,-.42,0,1,1,1,rider);rider.position.set(-3.2,3.3,-1);moving.push({obj:rider,kind:'zip'});
    }else if(tour.id==='buggies'||tour.id==='fun-park'){
      const road=add(new THREE.BoxGeometry(10,.12,2.2),mat(0xa66d3e),0,-.08,0);road.rotation.y=-.32;buggy(-.5,.4);if(tour.id==='fun-park'){const canopy=add(new THREE.CylinderGeometry(.07,.07,6,10),dark,3,2,-2);canopy.rotation.z=Math.PI/2;const cable=add(new THREE.CylinderGeometry(.025,.025,7,8),yellow,0,3,-2);cable.rotation.z=.12;const horse= new THREE.Group();scene.add(horse);add(new THREE.SphereGeometry(.42,16,12),mat(0x8a5a37),0,.8,0,1.35,.8,.7,horse);add(new THREE.SphereGeometry(.24,12,10),mat(0x8a5a37),.38,1.16,0,.85,1,.8,horse);for(let leg=0;leg<4;leg++)add(new THREE.CylinderGeometry(.07,.08,.65,8),mat(0x5b3929),-.25+(leg%2)*.5,.35,leg<2?-.22:.22,1,1,1,horse);horse.position.set(4,0,1);}
    }else if(tour.id==='catalina'){
      add(new THREE.ConeGeometry(1.8,1.2,8),green,-4,.1,-4,2.3,.85,1.4);palm(-5,-4,3.4);palm(-3,-5,2.6);for(let i=0;i<10;i++)fish(-3+Math.random()*6,.15+Math.random()*1.4,1+Math.random()*3,[0xffd84d,0xff826c,0x59e1c7][i%3]);
    }else if(tour.id==='saona'){
      add(new THREE.ConeGeometry(1.5,1,8),green,-4,.1,-4,2.4,.75,1.5);palm(-5,-4,3.8);palm(-3.5,-5,3);boat(1,-.3);const ring=add(new THREE.TorusGeometry(1.1,.13,10,60),white,-2,-.1,2);ring.rotation.x=Math.PI/2;
    }else if(tour.id==='scuba-doo'){
      const helmet=new THREE.Group();scene.add(helmet);add(new THREE.SphereGeometry(.95,32,24),yellow,0,1.35,0,1,1.13,1,helmet);add(new THREE.SphereGeometry(.57,20,14),mat(0x15465e,.12,.25),0,1.38,.68,1,.85,.3,helmet);add(new THREE.CylinderGeometry(.62,.68,.28,24),mat(0x626a70),0,.6,0,1,1,1,helmet);for(let i=0;i<3;i++)add(new THREE.SphereGeometry(.07,10,8),white,-.36+i*.36,1.42,.94);helmet.rotation.y=-.3;moving.push({obj:helmet,kind:'float'});bubbles();
    }else if(tour.id==='dolphin'){
      const dolphin=new THREE.Group();scene.add(dolphin);add(new THREE.SphereGeometry(.65,24,18),mat(0x5aaec7,.3,.12),0,1.2,0,1.8,.65,.7,dolphin);const nose=add(new THREE.ConeGeometry(.28,.65,16),mat(0x5aaec7),1.05,1.25,0,1,1,1,dolphin);nose.rotation.z=-Math.PI/2;const fin=add(new THREE.ConeGeometry(.35,.72,5),mat(0x32788e),-.1,1.65,0,1,.7,.5,dolphin);fin.rotation.z=Math.PI;const tail=add(new THREE.ConeGeometry(.42,.6,4),mat(0x5aaec7),-.95,1.3,0,1,1,.3,dolphin);tail.rotation.z=Math.PI/2;moving.push({obj:dolphin,kind:'dolphin'});for(let i=0;i<5;i++)fish(-4+i*1.8,.4+Math.random(),-2);
    }else if(tour.id==='speedboat'||tour.id==='party-boat'){
      boat(0,0,tour.id==='party-boat'?0xfff3d8:0xf8f5eb,tour.id==='party-boat');if(tour.id==='party-boat'){for(let i=0;i<5;i++){const beam=add(new THREE.CylinderGeometry(.015,.18,6,8),new THREE.MeshBasicMaterial({color:[0xff4c83,0x42dfff,0xffd64e,0x9b5cff,0x4affb0][i],transparent:true,opacity:.28}),-2+i,2,-1);beam.rotation.z=(i-2)*.18;}}
    }else if(tour.id==='coco-bongo'){
      const stage=add(new THREE.BoxGeometry(7,.55,1.6),mat(0x171b36),0,.15,-2);const arch=add(new THREE.TorusGeometry(2.5,.15,12,64,Math.PI),mat(0xff3d9b,.3,.2,0xff168a),0,2,-2);arch.rotation.z=Math.PI;const columns=[0x33eaff,0xff3d9b,0xffd34d,0x8d65ff];for(let i=0;i<4;i++){const beam=add(new THREE.CylinderGeometry(.03,.22,5,8),new THREE.MeshBasicMaterial({color:columns[i],transparent:true,opacity:.32}),-3+i*2,2,0);beam.rotation.z=(i-1.5)*.18;moving.push({obj:beam,kind:'beam',phase:i});}add(new THREE.BoxGeometry(.45,1.4,.4),coral,-1,.9,-1);add(new THREE.BoxGeometry(.45,1.1,.4),yellow,0,.75,-1);add(new THREE.BoxGeometry(.45,1.6,.4),blue,1,.95,-1);
    }else if(tour.id==='monkeyland'){
      for(let i=0;i<8;i++){const x=-5+(i%4)*3.25,z=-4+Math.floor(i/4)*5;palm(x,z,3+Math.random());const monkey=new THREE.Group();scene.add(monkey);add(new THREE.SphereGeometry(.3,16,12),mat(0x9b704d),0,.95,0,1.1,1.25,.85,monkey);add(new THREE.SphereGeometry(.2,14,10),mat(0xd7bb94),.05,1.05,.2,1,.9,.5,monkey);add(new THREE.SphereGeometry(.1,10,8),dark,-.05,1.12,.33,1,1,.5,monkey);monkey.position.set(x+.55,0,z+.3);moving.push({obj:monkey,kind:'monkey',phase:i});}
    }
    // Atmospheric particles and subtle interactive camera parallax.
    const count=80,points=new Float32Array(count*3);for(let i=0;i<count;i++){points[i*3]=(Math.random()-.5)*16;points[i*3+1]=Math.random()*5;points[i*3+2]=(Math.random()-.5)*15;}
    const particleGeo=new THREE.BufferGeometry();particleGeo.setAttribute('position',new THREE.BufferAttribute(points,3));const particles=new THREE.Points(particleGeo,new THREE.PointsMaterial({color:nightScene?0xffa8d5:0xd7fff5,size:.045,transparent:true,opacity:.62}));scene.add(particles);
    let tick=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const resize=()=>{if(!canvas.isConnected)return;const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);};
    tour3dResize=resize;window.addEventListener('resize',resize);resize();
    canvas.onpointermove=e=>{const r=canvas.getBoundingClientRect();tour3dPointer.x=(e.clientX-r.left)/r.width-.5;tour3dPointer.y=(e.clientY-r.top)/r.height-.5;};
    const animate=()=>{if(!canvas.isConnected||!$('#tourModal').classList.contains('show')){stopTourDiorama();return;}tour3dFrame=requestAnimationFrame(animate);tick+=reduced?.002:.012;
      for(let i=0;i<waterPos.count;i++){const x=waterPos.getX(i),z=waterPos.getZ(i);waterPos.setY(i,Math.sin(x*.45+tick*1.7)*.045+Math.cos(z*.4+tick)*.035);}waterPos.needsUpdate=true;waterGeo.computeVertexNormals();
      moving.forEach(m=>{const o=m.obj,p=m.phase||0;if(m.kind==='boat'){o.position.y=.08+Math.sin(tick*1.4+p)*.12;o.rotation.z=Math.sin(tick+p)*.025;o.rotation.y=Math.sin(tick*.3)*.08;}else if(m.kind==='wheel')o.rotation.x=tick*1.4;else if(m.kind==='drive')o.position.y=.08+Math.abs(Math.sin(tick*4))*.045;else if(m.kind==='fish'){o.position.x+=Math.sin(tick+p)*.002;o.position.y+=Math.sin(tick*2+p)*.002;o.rotation.y=Math.sin(tick+p)*.18;}else if(m.kind==='bubble'){o.position.y=.3+((tick*1.2+p)%3.7);o.position.x+=Math.sin(tick+p)*.0008;}else if(m.kind==='float'){o.position.y=1.35+Math.sin(tick*1.6)*.12;o.rotation.y=-.3+Math.sin(tick*.5)*.12;}else if(m.kind==='dolphin'){o.position.y=1.2+Math.sin(tick*2)*.5;o.rotation.z=Math.sin(tick*1.5)*.12;}else if(m.kind==='monkey'){o.rotation.z=Math.sin(tick*1.8+p)*.11;o.position.y=Math.max(0,Math.sin(tick*2+p)*.11);}else if(m.kind==='zip'){o.position.x=-3.2+Math.sin(tick*.6)*1.1;o.position.y=3.3+Math.cos(tick*.6)*.35;}else if(m.kind==='pulse'){o.scale.setScalar(.85+Math.sin(tick*3+p)*.25);}else if(m.kind==='beam'){o.rotation.y=tick*.22+p;}});
      particles.rotation.y=tick*.02;camera.position.x=8+tour3dPointer.x*1.8;camera.position.y=7-tour3dPointer.y*1.15;camera.lookAt(0,.7,0);renderer.render(scene,camera);
    };animate();fallback.style.display='none';badge.style.opacity='1';
  }catch(error){fallback.innerHTML= tourArtwork(tour) + '<span>ESCENA VECTORIAL · WEBGL NO DISPONIBLE</span>';fallback.style.display='flex';console.info('Themed 3D scene unavailable; code-generated vector artwork is shown instead.',error?.message||error);}
}

function renderFaq(){
  $('#faqList').innerHTML = t('faqQuestions').map((item,i)=>`<article class="faq-item ${i===0?'open':''}"><button class="faq-question" type="button" aria-expanded="${i===0?'true':'false'}"><span>${item[0]}</span><span>+</span></button><div class="faq-answer"><p>${item[1]}</p></div></article>`).join('');
  $$('.faq-question').forEach(btn=>btn.addEventListener('click',()=>{
    const item=btn.closest('.faq-item'); const wasOpen=item.classList.contains('open');
    $$('.faq-item').forEach(el=>{el.classList.remove('open');el.querySelector('.faq-question').setAttribute('aria-expanded','false');});
    if(!wasOpen){item.classList.add('open');btn.setAttribute('aria-expanded','true');}
  }));
}

function setLang(lang){
  currentLang=lang; document.documentElement.lang=lang;
  $$('[data-i18n]').forEach(el=>{const value=t(el.dataset.i18n); if(value.includes('<')) el.innerHTML=value; else el.textContent=value;});
  $$('[data-i18n-placeholder]').forEach(el=>el.placeholder=t(el.dataset.i18nPlaceholder));
  $('#languageToggle').innerHTML = lang==='es'?'ES <span>/</span> EN':'EN <span>/</span> ES';
  const currentValue=$('#experienceSelect').value;
  populateExperienceSelect();
  $('#experienceSelect').value=currentValue;
  renderTours(); renderFaq();
  tripPlanner?.refresh();
  if(activeModalTour) openTour(activeModalTour.id);
  $('#soundToggle span:last-child').textContent=t(soundIsOn?'soundOn':'soundOff');
}

function populateExperienceSelect(){
  const select=$('#experienceSelect');
  const placeholder=select.options[0]; select.innerHTML=''; select.appendChild(placeholder);
  tours.forEach(tour=>{const option=document.createElement('option');option.value=tour.name;option.textContent=currentLang==='es'?tour.name:tour.en;select.appendChild(option);});
  const transport=document.createElement('option');transport.value='Transporte / traslado';transport.textContent=t('transportOption');select.appendChild(transport);
}

function bindCardTilt(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(pointer:fine)').matches)return;
  $$('.tour-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.setProperty('--mx',`${-y*4}deg`);card.style.setProperty('--my',`${x*5}deg`);});
    card.addEventListener('pointerleave',()=>{card.style.setProperty('--mx','0deg');card.style.setProperty('--my','0deg');});
  });
}

function localDateString(){const d=new Date();const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,'0');const day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`;}

function getQuoteMessage(form){
  const data=new FormData(form);
  const lines = currentLang==='es' ? [
    '¡Hola! Quiero solicitar una cotización con Punta Cana Arena y Palmera.',
    `Experiencia: ${data.get('experience')}`,
    `Fecha deseada: ${data.get('date')}`,
    `Personas: ${data.get('people')}`,
    `Menores y edades: ${data.get('children') || 'No indicado'}`,
    `Hotel / zona de recogida: ${data.get('pickup') || 'No indicado'}`,
    `Nombre: ${data.get('name')}`,
    `Contacto: ${data.get('contact')}`,
    `Notas: ${data.get('notes') || 'Sin notas'}`,
    'Entiendo que esta es una solicitud y que la reserva requiere confirmación del operador.'
  ] : [
    'Hello! I would like to request a quote from Punta Cana Arena y Palmera.',
    `Experience: ${data.get('experience')}`,
    `Preferred date: ${data.get('date')}`,
    `Travellers: ${data.get('people')}`,
    `Children and ages: ${data.get('children') || 'Not provided'}`,
    `Hotel / pickup area: ${data.get('pickup') || 'Not provided'}`,
    `Name: ${data.get('name')}`,
    `Contact: ${data.get('contact')}`,
    `Notes: ${data.get('notes') || 'No notes'}`,
    'I understand this is an enquiry and a booking requires operator confirmation.'
  ];
  const savedPlan = tripPlanner?.getItems() || [];
  if (savedPlan.length) {
    lines.splice(2, 0, currentLang === 'es'
      ? 'Mi viaje: experiencias y días sugeridos (a confirmar con el operador):'
      : 'My trip: selected experiences and suggested days (to be confirmed by the operator):',
      ...tripPlanner.quoteLines());
  }
  return lines.join('\n');
}

async function copyText(text){
  try{if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(text);return true;}}
  catch(e){}
  const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy');}catch(e){}ta.remove();return ok;
}

function initQuoteForm(){
  const form=$('#quoteForm'); const date=$('#dateInput'); date.min=localDateString(); date.value=localDateString();
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const feedback=$('#formFeedback'); feedback.classList.remove('error');
    if(!form.reportValidity())return;
    const experience=$('#experienceSelect').value;
    if(!experience){feedback.textContent=t('selectTourError');feedback.classList.add('error');return;}
    const message=getQuoteMessage(form);
    const config=window.BRAND_CONFIG||{};
    const number=(config.whatsappNumber||'').replace(/\D/g,'');
    if(number){
      const url=`https://wa.me/${number}?text=${encodeURIComponent(message)}`;
      feedback.textContent=t('formSuccess'); window.open(url,'_blank','noopener,noreferrer');
    }else{
      const copied=await copyText(message);
      feedback.textContent=copied?`${t('configureWhatsapp')} ${t('copySuccess')}`:t('copyFailed');
      if(!copied){feedback.classList.add('error');}
    }
  });
}

let soundIsOn=false;
let audioCtx=null, masterAudioGain=null, noiseBuffer=null, ambienceNodes=[], ambienceTimer=null, currentSoundProfile='ocean';

// Todas las capas ambientales se sintetizan en tiempo real: no se cargan MP3/WAV.
// Este oleaje usa ruido filtrado, envolventes lentas y un grave suave para recrear
// el avance, la espuma y el retroceso de una ola en la orilla.
function addOceanWave(){
  if(!audioCtx||!masterAudioGain||!soundIsOn)return;
  const now=audioCtx.currentTime;
  const source=audioCtx.createBufferSource();source.buffer=makeNoiseBuffer();source.loop=true;
  const high=audioCtx.createBiquadFilter();high.type='highpass';high.frequency.setValueAtTime(115,now);high.Q.value=.55;
  const low=audioCtx.createBiquadFilter();low.type='lowpass';low.frequency.setValueAtTime(480,now);low.frequency.exponentialRampToValueAtTime(2350,now+1.65);low.frequency.exponentialRampToValueAtTime(1450,now+3.3);low.frequency.exponentialRampToValueAtTime(560,now+7.1);low.Q.value=.35;
  const swell=audioCtx.createGain();swell.gain.setValueAtTime(.0001,now);swell.gain.exponentialRampToValueAtTime(.052,now+1.55);swell.gain.exponentialRampToValueAtTime(.024,now+3.5);swell.gain.exponentialRampToValueAtTime(.0001,now+7.4);
  const pan=audioCtx.createStereoPanner?audioCtx.createStereoPanner():null;
  if(pan)pan.pan.setValueAtTime((Math.random()-.5)*.45,now);
  source.connect(high);high.connect(low);low.connect(swell);if(pan){swell.connect(pan);pan.connect(masterAudioGain);}else{swell.connect(masterAudioGain);}
  source.start(now);source.stop(now+7.55);
  ambienceNodes.push(source,high,low,swell);if(pan)ambienceNodes.push(pan);

  // El grave muy discreto aporta el cuerpo de la rompiente, sin convertirse en música.
  const rumble=audioCtx.createOscillator(),rumbleGain=audioCtx.createGain();
  rumble.type='sine';rumble.frequency.setValueAtTime(48+Math.random()*12,now);
  rumbleGain.gain.setValueAtTime(.0001,now);rumbleGain.gain.exponentialRampToValueAtTime(.008,now+1.8);rumbleGain.gain.exponentialRampToValueAtTime(.0001,now+6.8);
  rumble.connect(rumbleGain);rumbleGain.connect(masterAudioGain);rumble.start(now);rumble.stop(now+6.9);
  ambienceNodes.push(rumble,rumbleGain);
}
function stopSoundNodes(){
  if(ambienceTimer){clearInterval(ambienceTimer);ambienceTimer=null;}
  ambienceNodes.forEach(node=>{try{node.stop?.();}catch(e){}try{node.disconnect?.();}catch(e){}});
  ambienceNodes=[];
}
function makeNoiseBuffer(){
  if(noiseBuffer||!audioCtx)return noiseBuffer;
  noiseBuffer=audioCtx.createBuffer(1,audioCtx.sampleRate*3,audioCtx.sampleRate);
  const data=noiseBuffer.getChannelData(0);
  let last=0;
  for(let i=0;i<data.length;i++){const white=Math.random()*2-1;last=.985*last+.015*white;data[i]=last*3.2;}
  return noiseBuffer;
}
function synthTone(freq=440,duration=.22,volume=.02,wave='sine',endFreq=null){
  if(!audioCtx||!masterAudioGain||!soundIsOn)return;
  const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
  osc.type=wave;osc.frequency.setValueAtTime(freq,audioCtx.currentTime);
  if(endFreq)osc.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq),audioCtx.currentTime+duration);
  gain.gain.setValueAtTime(.0001,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(volume,audioCtx.currentTime+.025);gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);
  osc.connect(gain);gain.connect(masterAudioGain);osc.start();osc.stop(audioCtx.currentTime+duration+.04);ambienceNodes.push(osc,gain);
}
function addNoiseLayer({type='lowpass',frequency=500,q=.5,volume=.012,modulation=.06}){
  const source=audioCtx.createBufferSource(),filter=audioCtx.createBiquadFilter(),gain=audioCtx.createGain();
  source.buffer=makeNoiseBuffer();source.loop=true;filter.type=type;filter.frequency.value=frequency;filter.Q.value=q;gain.gain.value=volume;
  source.connect(filter);filter.connect(gain);gain.connect(masterAudioGain);source.start();ambienceNodes.push(source,filter,gain);
  if(modulation){const lfo=audioCtx.createOscillator(),depth=audioCtx.createGain();lfo.frequency.value=modulation;depth.gain.value=volume*.58;lfo.connect(depth);depth.connect(gain.gain);lfo.start();ambienceNodes.push(lfo,depth);}
}
function startSoundscape(profile='ocean'){
  if(!soundIsOn||!audioCtx)return;
  stopSoundNodes();currentSoundProfile=profile;
  addNoiseLayer({type:'lowpass',frequency:profile==='underwater'?240:profile==='forest'?950:profile==='party'?1700:profile==='engine'?360:520,volume:profile==='party'?.005:profile==='forest'?.021:profile==='engine'?.02:profile==='underwater'?.022:(profile==='ocean'||profile==='island')?.006:.009,modulation:profile==='party'?0:.075});
  if(profile==='underwater')addNoiseLayer({type:'highpass',frequency:650,volume:.007,modulation:.11});
  if(profile==='ocean'||profile==='island'){
    addOceanWave();
    ambienceTimer=setInterval(()=>{if(soundIsOn&&(currentSoundProfile==='ocean'||currentSoundProfile==='island'))addOceanWave();},5600);
  }
  if(profile==='forest')addNoiseLayer({type:'bandpass',frequency:1500,q:.7,volume:.006,modulation:.16});
  if(profile==='engine'){
    [62,64.5].forEach((freq,i)=>{const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type='sawtooth';osc.frequency.value=freq;gain.gain.value=.006;osc.connect(gain);gain.connect(masterAudioGain);osc.start();ambienceNodes.push(osc,gain);});
  }
  if(profile==='party'){
    const bass=audioCtx.createOscillator(),bassGain=audioCtx.createGain();bass.type='sine';bass.frequency.value=55;bassGain.gain.value=.022;bass.connect(bassGain);bassGain.connect(masterAudioGain);bass.start();ambienceNodes.push(bass,bassGain);
  }
  if(profile==='forest'||profile==='underwater'||profile==='party'){
    ambienceTimer=setInterval(()=>{
      if(!soundIsOn)return;
      if(profile==='forest'){synthTone(1500+Math.random()*900,.11,.009,'sine',1900+Math.random()*1100);}
      else if(profile==='underwater'){synthTone(420+Math.random()*220,.36,.009,'sine',180+Math.random()*80);}
      else if(profile==='party'){synthTone(Math.random()>.5?880:660,.08,.008,'square');}
      else{synthTone(1200+Math.random()*500,.16,.006,'sine',1800+Math.random()*600);}
    },profile==='party'?410:profile==='underwater'?2100:profile==='forest'?2600:3600);
  }
}
function setThemedSound(tour){
  if(!soundIsOn)return;
  let profile='ocean';
  if(tour){
    if(tour.id==='coco-bongo'||tour.id==='party-boat')profile='party';
    else if(tour.id==='buggies'||tour.id==='fun-park')profile='engine';
    else if(tour.id==='monkeyland'||tour.id==='scape-park')profile='forest';
    else if(tour.id==='scuba-doo')profile='underwater';
    else if(tour.id==='dolphin')profile='island';
  }
  startSoundscape(profile);
}
async function toggleOceanSound(){
  const button=$('#soundToggle');
  if(!soundIsOn){
    try{
      const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass)throw new Error('Audio unavailable');
      audioCtx=audioCtx||new AudioContextClass();await audioCtx.resume();
      if(!masterAudioGain){masterAudioGain=audioCtx.createGain();masterAudioGain.connect(audioCtx.destination);}
      masterAudioGain.gain.cancelScheduledValues(audioCtx.currentTime);masterAudioGain.gain.setValueAtTime(Math.max(.0001,masterAudioGain.gain.value),audioCtx.currentTime);
      soundIsOn=true;masterAudioGain.gain.exponentialRampToValueAtTime(.78,audioCtx.currentTime+1.2);
      startSoundscape(activeModalTour?profileForTour(activeModalTour):'ocean');
      button.setAttribute('aria-pressed','true');button.querySelector('span:last-child').textContent=t('soundOn');
    }catch(err){button.querySelector('span:last-child').textContent=currentLang==='es'?'Audio no disponible':'Audio unavailable';}
  }else{
    soundIsOn=false;stopSoundNodes();
    if(masterAudioGain&&audioCtx){masterAudioGain.gain.setTargetAtTime(.0001,audioCtx.currentTime,.12);}
    button.setAttribute('aria-pressed','false');button.querySelector('span:last-child').textContent=t('soundOff');
  }
}
function profileForTour(tour){
  if(!tour)return'ocean';
  if(tour.id==='coco-bongo'||tour.id==='party-boat')return'party';
  if(tour.id==='buggies'||tour.id==='fun-park')return'engine';
  if(tour.id==='monkeyland'||tour.id==='scape-park')return'forest';
  if(tour.id==='scuba-doo')return'underwater';
  if(tour.id==='dolphin')return'island';
  return'ocean';
}

function initNavigation(){
  const menu=$('#mobileMenu');const button=$('#mobileMenuButton');
  button.addEventListener('click',()=>{const open=menu.classList.toggle('open');button.setAttribute('aria-expanded',String(open));});
  $$('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');button.setAttribute('aria-expanded','false');}));
  $('#languageToggle').addEventListener('click',()=>setLang(currentLang==='es'?'en':'es'));
  $('#modalClose').addEventListener('click',closeTour);
  $('#tourModal').addEventListener('click',e=>{if(e.target===$('#tourModal'))closeTour();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeTour();menu.classList.remove('open');button.setAttribute('aria-expanded','false');}});
  $('#soundToggle').addEventListener('click',toggleOceanSound);
  $$('.filter-pill').forEach(btn=>btn.addEventListener('click',()=>{$$('.filter-pill').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeFilter=btn.dataset.filter;renderTours();}));
  $('#tourSearch').addEventListener('input',renderTours);
  $('#tourGrid').addEventListener('click',e=>{const btn=e.target.closest('[data-tour]');if(btn)openTour(btn.dataset.tour);});
  $('#year').textContent=new Date().getFullYear();
}

function initReveal(){
  const items=$$('.reveal');
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){items.forEach(x=>x.classList.add('visible'));return;}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -35px 0px'});
  items.forEach(el=>observer.observe(el));
}

async function initTransportDiorama(){
  const canvas=$('#transport3d');if(!canvas)return;
  if(!('IntersectionObserver' in window))return;
  const section=$('#transporte');let renderer,frame=0,resizeHandler;
  try{
    const THREE=await import('three');
    const scene=new THREE.Scene();scene.background=new THREE.Color(0x0b6970);scene.fog=new THREE.Fog(0x0b6970,12,34);
    const camera=new THREE.PerspectiveCamera(42,1,.1,80);camera.position.set(7,6,10);camera.lookAt(0,.7,0);
    renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.25));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
    scene.add(new THREE.HemisphereLight(0xc9f8ff,0x284237,2));const sun=new THREE.DirectionalLight(0xffe7bd,2.6);sun.position.set(-5,9,5);scene.add(sun);
    const mat=(c,r=.7)=>new THREE.MeshStandardMaterial({color:c,roughness:r});
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(30,30),mat(0x2e7051));ground.rotation.x=-Math.PI/2;ground.position.y=-.5;scene.add(ground);
    const road=new THREE.Mesh(new THREE.PlaneGeometry(8,34),mat(0xb18b5d));road.rotation.x=-Math.PI/2;road.position.y=-.46;scene.add(road);
    for(let z=-12;z<=12;z+=6){for(const x of [-6,6]){const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.12,.2,2.3,8),mat(0x825737));trunk.position.set(x, .55,z);scene.add(trunk);const crown=new THREE.Group();crown.position.set(x,1.75,z);scene.add(crown);for(let i=0;i<7;i++){const frond=new THREE.Mesh(new THREE.ConeGeometry(.22,2.1,5),mat(0x31935f));frond.position.set(Math.cos(i/7*Math.PI*2)*.65,.1,Math.sin(i/7*Math.PI*2)*.65);frond.rotation.z=Math.PI/2-Math.cos(i/7*Math.PI*2)*.45;frond.rotation.x=Math.sin(i/7*Math.PI*2)*.45;crown.add(frond);}}}
    const van=new THREE.Group();scene.add(van);const body=new THREE.Mesh(new THREE.BoxGeometry(2.7,1.05,1.3),mat(0xfff6e8,.38));body.position.y=.55;van.add(body);const roof=new THREE.Mesh(new THREE.BoxGeometry(1.7,.55,1.22),mat(0xfafafa,.42));roof.position.set(-.15,1.3,0);van.add(roof);const glass=new THREE.Mesh(new THREE.BoxGeometry(.06,.44,1.12),mat(0x0b7181,.15));glass.position.set(1.36,.82,0);van.add(glass);const wheels=[];for(const x of [-.85,.85])for(const z of [-.72,.72]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.16,16),mat(0x172b2b));wheel.rotation.z=Math.PI/2;wheel.position.set(x,.29,z);van.add(wheel);wheels.push(wheel);}van.position.set(0,-.1,4);
    let active=false,tick=0;
    const resize=()=>{const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);};resizeHandler=resize;window.addEventListener('resize',resize);
    const draw=()=>{if(!active)return;frame=requestAnimationFrame(draw);tick+=matchMedia('(prefers-reduced-motion: reduce)').matches?.002:.008;van.position.z=3.1+Math.sin(tick)*1.2;van.position.y=-.1+Math.sin(tick*3)*.03;wheels.forEach(w=>w.rotation.x=tick*1.8);camera.position.x=7+Math.sin(tick*.4)*.25;camera.lookAt(0,.5,0);renderer.render(scene,camera);};
    const observer=new IntersectionObserver(entries=>{active=entries.some(e=>e.isIntersecting);if(active){resize();cancelAnimationFrame(frame);draw();}else{cancelAnimationFrame(frame);}}, {threshold:.1});observer.observe(section);
    canvas.addEventListener('webglcontextlost',()=>{active=false;cancelAnimationFrame(frame);},{once:true});
  }catch(error){console.info('Transport 3D unavailable; the coded visual background remains active.',error?.message||error);}
}

async function initThreeHero(){
  const canvas=$('#hero3d');if(!canvas)return;
  try{
    const THREE=await import('three');
    const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x0b6670,.012);
    const camera=new THREE.PerspectiveCamera(42,1,.1,120);camera.position.set(0,8.3,15.8);camera.lookAt(0,.2,-3.2);
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
    scene.add(new THREE.HemisphereLight(0xc9fbff,0x174b47,2.0));
    const sunLight=new THREE.DirectionalLight(0xffe6b5,2.2);sunLight.position.set(-7,12,6);scene.add(sunLight);
    const fill=new THREE.DirectionalLight(0x51d7d3,.8);fill.position.set(8,6,-4);scene.add(fill);

    // Animated open-water surface, generated procedurally so no external 3D model is required.
    const waterSegments=window.innerWidth<700?58:94;const waterGeo=new THREE.PlaneGeometry(48,48,waterSegments,waterSegments);waterGeo.rotateX(-Math.PI/2);
    const waterMat=new THREE.MeshPhysicalMaterial({color:0x13a9ad,metalness:.18,roughness:.24,clearcoat:.9,clearcoatRoughness:.16,transparent:true,opacity:.86});
    const water=new THREE.Mesh(waterGeo,waterMat);water.position.set(0,-.72,-2);scene.add(water);
    const waterPositions=waterGeo.attributes.position;

    // Warm sandbar and green island ridge on the horizon.
    const sand=new THREE.Mesh(new THREE.SphereGeometry(1,40,24),new THREE.MeshStandardMaterial({color:0xe4c58a,roughness:.95}));sand.scale.set(5.3,.33,2.2);sand.position.set(-4.8,-.47,-8.7);scene.add(sand);
    const island=new THREE.Mesh(new THREE.SphereGeometry(1,40,24),new THREE.MeshStandardMaterial({color:0x287a55,roughness:1}));island.scale.set(4.55,.82,1.9);island.position.set(-4.9,-.16,-9.15);scene.add(island);
    const islandGlow=new THREE.Mesh(new THREE.SphereGeometry(1,30,20),new THREE.MeshBasicMaterial({color:0x9bd79b,transparent:true,opacity:.27}));islandGlow.scale.set(3.9,.55,1.65);islandGlow.position.set(-4.9,.13,-9.05);scene.add(islandGlow);

    function makePalm(x,z,height,lean=0){
      const group=new THREE.Group();group.position.set(x,-.22,z);scene.add(group);
      const pts=[new THREE.Vector3(0,0,0),new THREE.Vector3(lean*.25,height*.34,0),new THREE.Vector3(lean*.62,height*.72,0),new THREE.Vector3(lean,height,0)];
      const curve=new THREE.CatmullRomCurve3(pts);const trunk=new THREE.Mesh(new THREE.TubeGeometry(curve,18,.105,7,false),new THREE.MeshStandardMaterial({color:0x91623e,roughness:1}));group.add(trunk);
      const top=new THREE.Vector3(lean,height,0);
      for(let i=0;i<7;i++){
        const a=(i/7)*Math.PI*2;const end=new THREE.Vector3(lean+Math.cos(a)*1.25,height+.12+Math.sin(a*.7)*.22,Math.sin(a)*.82);
        const mid=new THREE.Vector3(lean+Math.cos(a)*.6,height+.56,Math.sin(a)*.42);
        const leafCurve=new THREE.QuadraticBezierCurve3(top,mid,end);
        const leaf=new THREE.Mesh(new THREE.TubeGeometry(leafCurve,14,.045,5,false),new THREE.MeshStandardMaterial({color:i%2?0x2c8559:0x3c9b61,roughness:.9}));group.add(leaf);
        const tip=new THREE.Mesh(new THREE.ConeGeometry(.07,.48,5),new THREE.MeshStandardMaterial({color:0x3c9b61}));tip.position.copy(end);tip.rotation.z=-Math.cos(a)*.3;tip.rotation.x=Math.sin(a)*.4;group.add(tip);
      }
      return group;
    }
    makePalm(-7.9,-8.8,3.3,-.35);makePalm(-3.2,-9.35,2.7,.18);makePalm(-1.2,-8.2,2.25,.35);

    // Small stylized day boat with sail and canopy, floating above the moving water.
    const boat=new THREE.Group();boat.position.set(5.1,.05,-.4);scene.add(boat);
    const hull=new THREE.Mesh(new THREE.SphereGeometry(1,32,22),new THREE.MeshStandardMaterial({color:0xfaf6e9,roughness:.35,metalness:.08}));hull.scale.set(1.35,.24,.55);boat.add(hull);
    const deck=new THREE.Mesh(new THREE.BoxGeometry(1.65,.13,.75),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.5}));deck.position.y=.19;boat.add(deck);
    const cabin=new THREE.Mesh(new THREE.BoxGeometry(.62,.43,.48),new THREE.MeshStandardMaterial({color:0xfff9e9,roughness:.55}));cabin.position.set(-.14,.46,0);boat.add(cabin);
    const windows=new THREE.Mesh(new THREE.BoxGeometry(.48,.16,.5),new THREE.MeshStandardMaterial({color:0x0c6875,metalness:.15,roughness:.18}));windows.position.set(-.14,.56,0);boat.add(windows);
    const mast=new THREE.Mesh(new THREE.CylinderGeometry(.035,.045,1.8,8),new THREE.MeshStandardMaterial({color:0xf8f4e9}));mast.position.set(.58,1.06,0);boat.add(mast);
    const sail=new THREE.Mesh(new THREE.PlaneGeometry(.73,1.05),new THREE.MeshStandardMaterial({color:0xf8f0dd,side:THREE.DoubleSide,roughness:.9}));sail.position.set(.27,1.06,.05);sail.rotation.y=.18;boat.add(sail);
    const flag=new THREE.Mesh(new THREE.PlaneGeometry(.32,.15),new THREE.MeshBasicMaterial({color:0xff765e,side:THREE.DoubleSide}));flag.position.set(.58,1.95,0);boat.add(flag);

    // Golden sun glow.
    const sun=new THREE.Mesh(new THREE.SphereGeometry(1.05,32,24),new THREE.MeshBasicMaterial({color:0xffd48a}));sun.position.set(6.1,5.2,-13);scene.add(sun);
    const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;const ctx=glowCanvas.getContext('2d');const gradient=ctx.createRadialGradient(64,64,2,64,64,64);gradient.addColorStop(0,'rgba(255,226,165,.8)');gradient.addColorStop(1,'rgba(255,226,165,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
    const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(glowCanvas),transparent:true,depthWrite:false}));glow.position.copy(sun.position);glow.scale.set(7,7,1);scene.add(glow);

    // Tiny sunlit particles, deliberately sparse.
    const points=[];for(let i=0;i<95;i++)points.push((Math.random()-.5)*25,Math.random()*4-1,(Math.random()-.5)*24-2);
    const particleGeo=new THREE.BufferGeometry();particleGeo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
    const particles=new THREE.Points(particleGeo,new THREE.PointsMaterial({color:0xc6fff0,size:.035,transparent:true,opacity:.55,sizeAttenuation:true}));scene.add(particles);

    let frame=0;let scrollY=0;window.addEventListener('scroll',()=>{scrollY=window.scrollY;},{passive:true});
    function resize(){const w=canvas.clientWidth||window.innerWidth;const h=canvas.clientHeight||window.innerHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
    window.addEventListener('resize',resize);resize();
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    function animate(){if(!canvas.isConnected){renderer.dispose();return;}requestAnimationFrame(animate);frame += reduced ? .002 : .009;
      for(let i=0;i<waterPositions.count;i++){const x=waterPositions.getX(i);const z=waterPositions.getZ(i);const wave=Math.sin(x*.38+frame*1.3)*.075+Math.cos(z*.45+frame)*.055+Math.sin((x+z)*.2+frame*.6)*.04;waterPositions.setZ(i,wave);}
      waterPositions.needsUpdate=true;waterGeo.computeVertexNormals();boat.position.y=.06+Math.sin(frame*1.5)*.12;boat.rotation.z=Math.sin(frame*.7)*.025;boat.rotation.y=-.22+Math.sin(frame*.25)*.08;
      particles.rotation.y=frame*.018;camera.position.x=Math.sin(frame*.18)*.22+(window.innerWidth<700 ? .6 : 0);camera.position.y=8.3+Math.sin(frame*.14)*.11;camera.position.z=15.8;camera.lookAt(.1+scrollY*.00018,.1,-3.2);renderer.render(scene,camera);
    }
    animate();
  }catch(error){
    console.info('3D scene unavailable; the procedural CSS backdrop remains active.',error?.message||error);
  }
}

function init(){
  populateExperienceSelect();renderTours();renderFaq();initNavigation();
  tripPlanner = initTripPlanner({ tours, getLanguage: () => currentLang, getModalTour: () => activeModalTour });
  initQuoteForm();initReveal();initThreeHero();initTransportDiorama();
}
init();
