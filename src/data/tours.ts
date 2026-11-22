import type { ImageMetadata } from 'astro';
import type { L } from '@/i18n/config';

import scubaDoo from '@/assets/images/scuba-doo.jpg';
import buggies from '@/assets/images/buggies.jpg';
import dolphin from '@/assets/images/dolphin-explorer.jpg';
import lancha from '@/assets/images/lancha-rapida.jpg';
import cocoBongo from '@/assets/images/coco-bongo.jpg';
import playaMacao from '@/assets/images/commons-playa-macao.jpg';
import islaSaona from '@/assets/images/commons-isla-saona.jpg';
import islaCatalina from '@/assets/images/commons-isla-catalina.jpg';
import monoArdilla from '@/assets/images/commons-mono-ardilla.jpg';
import piscinaNatural from '@/assets/images/commons-piscina-natural.jpg';

/**
 * Catálogo comercial autorizado: 11 excursiones.
 * Fuente: folletos del cliente (cliente/folletos). Inclusiones y notas se
 * transcriben de ahí; no se añaden precios, horarios ni duraciones que el
 * folleto no indique. Las descripciones solo reformulan lo que el folleto incluye.
 */
export type Category = 'sea' | 'adventure' | 'nature' | 'night';

export interface TourOption {
  name: L;
  items: L<string[]>;
}

export interface Tour {
  slug: string;
  category: Category;
  name: L;
  /** Línea editorial corta bajo el nombre. */
  tagline: L;
  description: L;
  inclusions: L<string[]>;
  /** Paquetes alternativos (p. ej. Coco Bongo). */
  options?: TourOption[];
  /** Condiciones impresas en el folleto. */
  notes: L<string[]>;
  /** Color de identidad del capítulo. */
  accent: string;
  /** Tono oscuro que acompaña al acento en fondos. */
  deep: string;
  /** `credit`: nombre del archivo en src/data/credits.ts cuando la foto es de terceros. */
  image?: { src: ImageMetadata; alt: L; position?: string; credit?: string };
}

const kidsNote: L = {
  es: 'Niños hasta 11 años tienen precio especial.',
  en: 'Children under 11 have a special price.',
  pt: 'Crianças até 11 anos têm preço especial.',
};

export const tours: Tour[] = [
  {
    slug: 'scuba-doo',
    category: 'sea',
    name: { es: 'Scuba Doo', en: 'Scuba Doo', pt: 'Scuba Doo' },
    tagline: {
      es: 'El mar, visto desde dentro.',
      en: 'The sea, seen from the inside.',
      pt: 'O mar, visto por dentro.',
    },
    description: {
      es: 'Una hora de inmersión y una hora de snorkel, con equipo de seguridad incluido. El trayecto se hace en barco con fondo de cristal, así que el mar te acompaña durante todo el viaje.',
      en: 'One hour of diving and one hour of snorkeling, with safety equipment included. You travel on a glass-bottom boat, so the sea stays with you for the whole trip.',
      pt: 'Uma hora de mergulho e uma hora de snorkel, com equipamento de segurança incluído. O trajeto é feito em um barco com fundo de vidro, para o mar acompanhar você durante toda a viagem.',
    },
    inclusions: {
      es: ['Transporte ida y vuelta', 'Bebidas no alcohólicas', 'Snorkel de 1 hora', 'Inmersión de 1 hora', 'Snacks ligeros', 'Equipos de seguridad', 'Barco con fondo de cristal para disfrutar de todo el viaje'],
      en: ['Round-trip transportation', 'Non-alcoholic beverages', '1 hour of snorkeling', '1-hour dive', 'Light snacks', 'Safety equipment', 'Glass-bottom boat to enjoy the whole trip'],
      pt: ['Transporte de ida e volta', 'Bebidas não alcoólicas', '1 hora de snorkel', '1 hora de mergulho', 'Lanches leves', 'Equipamentos de segurança', 'Barco com fundo de vidro para aproveitar toda a viagem'],
    },
    notes: { es: [], en: [], pt: [] },
    accent: '#18b3c4',
    deep: '#06384d',
    image: {
      src: scubaDoo,
      alt: {
        es: 'Persona explorando un arrecife de coral con peces tropicales en agua turquesa',
        en: 'Person exploring a coral reef with tropical fish in turquoise water',
        pt: 'Pessoa explorando um recife de coral com peixes tropicais em água turquesa',
      },
      position: '60% 50%',
    },
  },
  {
    slug: 'isla-saona',
    category: 'sea',
    name: { es: 'Isla Saona', en: 'Saona Island', pt: 'Ilha Saona' },
    tagline: {
      es: 'Piscina natural, barco de fiesta y playa.',
      en: 'Natural pool, party boat and beach.',
      pt: 'Piscina natural, barco de festa e praia.',
    },
    description: {
      es: 'Un día completo de mar: traslado por tierra y por agua, party boat, parada en una piscina natural y almuerzo tipo buffet, con bebidas, guía oficial y animación.',
      en: 'A full day at sea: ground and boat transfers, a party boat, a stop at a natural pool and a buffet-style lunch, with drinks, an official guide and entertainment.',
      pt: 'Um dia inteiro de mar: traslado por terra e por água, barco de festa, parada em uma piscina natural e almoço tipo bufê, com bebidas, guia oficial e animação.',
    },
    inclusions: {
      es: ['Transporte terrestre', 'Transporte marítimo', 'Party boat', 'Visita a piscina natural', 'Almuerzo tipo buffet', 'Bebidas alcohólicas y no alcohólicas', 'Guía oficial y animación'],
      en: ['Ground transportation', 'Boat transportation', 'Party boat', 'Visit to a natural pool', 'Buffet-style lunch', 'Alcoholic and non-alcoholic drinks', 'Official guide and entertainment'],
      pt: ['Transporte terrestre', 'Transporte marítimo', 'Barco de festa', 'Visita a uma piscina natural', 'Almoço tipo bufê', 'Bebidas alcoólicas e não alcoólicas', 'Guia oficial e animação'],
    },
    notes: { es: [kidsNote.es], en: [kidsNote.en], pt: [kidsNote.pt] },
    accent: '#1fc7b6',
    deep: '#0a4f5c',
    image: {
      src: islaSaona,
      alt: {
        es: 'Playa de Isla Saona con palmeras de coco, arena blanca y agua turquesa',
        en: 'Saona Island beach with coconut palms, white sand and turquoise water',
        pt: 'Praia da Ilha Saona com coqueiros, areia branca e água turquesa',
      },
      credit: 'commons-isla-saona.jpg',
    },
  },
  {
    slug: 'isla-catalina',
    category: 'sea',
    name: { es: 'Isla Catalina', en: 'Catalina Island', pt: 'Ilha Catalina' },
    tagline: {
      es: 'Snorkel entre bancos de peces.',
      en: 'Snorkeling among schools of fish.',
      pt: 'Snorkel entre cardumes de peixes.',
    },
    description: {
      es: 'Traslado por tierra y por mar hasta Isla Catalina, con equipo de snorkel para visitar el banco de peces. Incluye almuerzo tipo buffet, barra libre, guía oficial y animación.',
      en: 'Ground and boat transfers to Catalina Island, with snorkeling equipment to visit the school of fish. Includes a buffet-style lunch, open bar, an official guide and entertainment.',
      pt: 'Traslado por terra e por mar até a Ilha Catalina, com equipamento de snorkel para visitar o cardume de peixes. Inclui almoço tipo bufê, open bar, guia oficial e animação.',
    },
    inclusions: {
      es: ['Transporte terrestre', 'Transporte marítimo', 'Equipo de snorkel', 'Visita al banco de peces', 'Almuerzo tipo buffet', 'Barra libre de bebidas alcohólicas y no alcohólicas', 'Guía oficial y animación'],
      en: ['Ground transportation', 'Boat transportation', 'Snorkeling equipment', 'Visit to the school of fish', 'Buffet-style lunch', 'Open bar with alcoholic and non-alcoholic drinks', 'Official guide and entertainment'],
      pt: ['Transporte terrestre', 'Transporte marítimo', 'Equipamento de snorkel', 'Visita ao cardume de peixes', 'Almoço tipo bufê', 'Open bar de bebidas alcoólicas e não alcoólicas', 'Guia oficial e animação'],
    },
    notes: { es: [kidsNote.es], en: [kidsNote.en], pt: [kidsNote.pt] },
    accent: '#3d9be0',
    deep: '#0b3a66',
    image: {
      src: islaCatalina,
      alt: {
        es: 'Casitas de colores entre palmeras de coco sobre la arena de Isla Catalina',
        en: 'Colourful cabins among coconut palms on the sand of Catalina Island',
        pt: 'Casinhas coloridas entre coqueiros na areia da Ilha Catalina',
      },
      credit: 'commons-isla-catalina.jpg',
    },
  },
  {
    slug: 'buggies-polaris-atv',
    category: 'adventure',
    name: { es: 'Buggies, Polaris y ATV', en: 'Buggies, Polaris & ATV', pt: 'Buggies, Polaris e ATV' },
    tagline: {
      es: 'Tú manejas. El camino pone el barro.',
      en: 'You drive. The trail brings the mud.',
      pt: 'Você dirige. A trilha traz a lama.',
    },
    description: {
      es: 'Una ruta todoterreno que conduces tú, con parada artesanal para degustar café, cacao, mamajuana, ron dominicano y tabaco. El recorrido incluye un cenote natural de agua dulce y Playa Macao.',
      en: 'An off-road route that you drive yourself, with an artisan stop to taste coffee, cacao, mamajuana, Dominican rum and tobacco. The ride includes a natural freshwater cenote and Macao Beach.',
      pt: 'Uma rota off-road que você mesmo dirige, com parada artesanal para degustar café, cacau, mamajuana, rum dominicano e tabaco. O percurso inclui um cenote natural de água doce e a Praia Macao.',
    },
    inclusions: {
      es: ['Transporte ida y vuelta', 'Parada en ruta artesanal: degustación de café, cacao, mamajuana, ron dominicano y tabaco', 'Cenote natural de agua dulce', 'Playa Macao'],
      en: ['Round-trip transportation', 'Stop on the artisan route: tasting of coffee, cacao, mamajuana, Dominican rum and tobacco', 'Natural freshwater cenote', 'Macao Beach'],
      pt: ['Transporte de ida e volta', 'Parada na rota artesanal: degustação de café, cacau, mamajuana, rum dominicano e tabaco', 'Cenote natural de água doce', 'Praia Macao'],
    },
    notes: {
      es: ['Tú manejas la máquina.'],
      en: ['You drive the vehicle.'],
      pt: ['Você dirige a máquina.'],
    },
    accent: '#d9743f',
    deep: '#5a2412',
    image: {
      src: buggies,
      alt: {
        es: 'Dos personas en un buggy levantando polvo en un camino de tierra roja entre palmeras',
        en: 'Two people in a buggy kicking up dust on a red dirt road between palm trees',
        pt: 'Duas pessoas em um buggy levantando poeira em uma estrada de terra vermelha entre palmeiras',
      },
    },
  },
  {
    slug: 'scape-park',
    category: 'nature',
    name: { es: 'Scape Park', en: 'Scape Park', pt: 'Scape Park' },
    tagline: {
      es: 'Hoyo Azul, saltos y cueva taína.',
      en: 'Blue Hole, jumps and a Taíno cave.',
      pt: 'Buraco Azul, saltos e caverna taína.',
    },
    description: {
      es: 'Un parque natural para pasar el día entre agua y selva: ruta cultural, Saltos Azules, Hoyo Azul, Zip Line Eco Splash o Canopy, expedición a la cueva taína e Iguanalandia.',
      en: 'A natural park for a day between water and jungle: cultural route, Blue Jumps, Blue Hole, Eco Splash Zip Line or Canopy, an expedition to the Taíno cave and Iguanalandia.',
      pt: 'Um parque natural para passar o dia entre água e selva: rota cultural, Saltos Azuis, Buraco Azul, Tirolesa Eco Splash ou Canopy, expedição à caverna taína e Iguanalândia.',
    },
    inclusions: {
      es: ['Transporte ida y vuelta', 'Ruta cultural', 'Saltos Azules', 'Hoyo Azul', 'Zip Line Eco Splash o Canopy', 'Expedición a la cueva taína', 'Iguanalandia'],
      en: ['Round-trip transportation', 'Cultural route', 'Blue Jumps', 'Blue Hole', 'Eco Splash Zip Line or Canopy', 'Expedition to the Taíno cave', 'Iguanalandia'],
      pt: ['Transporte de ida e volta', 'Rota cultural', 'Saltos Azuis', 'Buraco Azul', 'Tirolesa Eco Splash ou Canopy', 'Expedição à caverna taína', 'Iguanalândia'],
    },
    notes: { es: [kidsNote.es], en: [kidsNote.en], pt: [kidsNote.pt] },
    accent: '#35c08d',
    deep: '#0d4a3a',
  },
  {
    slug: 'fun-park',
    category: 'adventure',
    name: { es: 'Fun Park', en: 'Fun Park', pt: 'Fun Park' },
    tagline: {
      es: 'Cuatro aventuras en un solo día.',
      en: 'Four adventures in a single day.',
      pt: 'Quatro aventuras em um só dia.',
    },
    description: {
      es: 'El tour 4x1: zipline o canopy, buggy doble o familiar, eco safari y paseo a caballo, con parada en Playa Macao y comida típica dominicana.',
      en: 'The 4x1 tour: zipline or canopy, double or family buggy, eco safari and a horseback ride, with a stop at Macao Beach and typical Dominican food.',
      pt: 'O tour 4x1: tirolesa ou canopy, buggy duplo ou familiar, eco safári e passeio a cavalo, com parada na Praia Macao e comida típica dominicana.',
    },
    inclusions: {
      es: ['Transporte ida y vuelta', 'Zipline o Canopy', 'Buggy doble o familiar', 'Eco Safari', 'Paseo a caballo', 'Playa Macao', 'Comida típica dominicana', 'Bebidas no alcohólicas', 'Equipos de seguridad'],
      en: ['Round-trip transportation', 'Zipline or Canopy', 'Double or family buggy', 'Eco Safari', 'Horseback ride', 'Macao Beach', 'Typical Dominican food', 'Non-alcoholic beverages', 'Safety equipment'],
      pt: ['Transporte de ida e volta', 'Tirolesa ou Canopy', 'Buggy duplo ou familiar', 'Eco Safári', 'Passeio a cavalo', 'Praia Macao', 'Comida típica dominicana', 'Bebidas não alcoólicas', 'Equipamentos de segurança'],
    },
    notes: { es: [kidsNote.es], en: [kidsNote.en], pt: [kidsNote.pt] },
    accent: '#e7b043',
    deep: '#5c3d0a',
    image: {
      src: playaMacao,
      alt: {
        es: 'Playa Macao: arena blanca, agua turquesa, una lancha anclada y acantilados con vegetación',
        en: 'Macao Beach: white sand, turquoise water, an anchored boat and green-topped cliffs',
        pt: 'Praia Macao: areia branca, água turquesa, um barco ancorado e falésias com vegetação',
      },
      credit: 'commons-playa-macao.jpg',
    },
  },
  {
    slug: 'dolphin-explorer',
    category: 'sea',
    name: { es: 'Dolphin Explorer', en: 'Dolphin Explorer', pt: 'Dolphin Explorer' },
    tagline: {
      es: 'Una hora junto a los delfines.',
      en: 'One hour alongside the dolphins.',
      pt: 'Uma hora ao lado dos golfinhos.',
    },
    description: {
      es: 'Una visita guiada con tres encuentros: aves exóticas, interacción con león marino y una hora de interacción con delfines. Tienes lockers para tus pertenencias y equipos de seguridad.',
      en: 'A guided visit with three encounters: exotic birds, a sea lion interaction and one hour of dolphin interaction. Lockers for your belongings and safety equipment are provided.',
      pt: 'Uma visita guiada com três encontros: aves exóticas, interação com leão-marinho e uma hora de interação com golfinhos. Há armários para seus pertences e equipamentos de segurança.',
    },
    inclusions: {
      es: ['Transporte ida y vuelta', 'Visita a aves exóticas', 'Interacción con león marino', 'Interacción con delfines (1 hora)', 'Lockers para guardar tus pertenencias', 'Equipos de seguridad y guías'],
      en: ['Round-trip transportation', 'Visit to exotic birds', 'Sea lion interaction', 'Dolphin interaction (1 hour)', 'Lockers to store your belongings', 'Safety equipment and guides'],
      pt: ['Transporte de ida e volta', 'Visita a aves exóticas', 'Interação com leão-marinho', 'Interação com golfinhos (1 hora)', 'Armários para guardar seus pertences', 'Equipamentos de segurança e guias'],
    },
    notes: { es: [], en: [], pt: [] },
    accent: '#4fb3d9',
    deep: '#0f4560',
    image: {
      src: dolphin,
      alt: {
        es: 'Dos delfines saltando sobre agua turquesa con palmeras al fondo',
        en: 'Two dolphins leaping over turquoise water with palm trees behind',
        pt: 'Dois golfinhos saltando sobre água turquesa com palmeiras ao fundo',
      },
    },
  },
  {
    slug: 'lancha-rapida',
    category: 'sea',
    name: { es: 'Lancha Rápida', en: 'Speedboat', pt: 'Lancha Rápida' },
    tagline: {
      es: 'Toda la costa de Bávaro, a toda velocidad.',
      en: 'The whole Bávaro coast, at full speed.',
      pt: 'Toda a costa de Bávaro, a toda velocidade.',
    },
    description: {
      es: 'Un recorrido en lancha rápida por toda la costa de Bávaro – Punta Cana, con parada en la piscina natural y equipo de snorkel. Vas acompañado de guías y con equipos de seguridad.',
      en: 'A speedboat ride along the entire Bávaro – Punta Cana coast, with a stop at the natural pool and snorkeling equipment. Guides and safety equipment come with you.',
      pt: 'Um passeio de lancha rápida por toda a costa de Bávaro – Punta Cana, com parada na piscina natural e equipamento de snorkel. Você vai acompanhado de guias e com equipamentos de segurança.',
    },
    inclusions: {
      es: ['Transporte ida y vuelta', 'Lancha rápida de calidad', 'Piscina natural', 'Equipo de snorkel', 'Recorrido por toda la costa de Bávaro – Punta Cana', 'Bebidas no alcohólicas', 'Guías y equipos de seguridad'],
      en: ['Round-trip transportation', 'Quality speedboat', 'Natural pool', 'Snorkeling equipment', 'Tour of the entire Bávaro – Punta Cana coast', 'Non-alcoholic beverages', 'Guides and safety equipment'],
      pt: ['Transporte de ida e volta', 'Lancha rápida de qualidade', 'Piscina natural', 'Equipamento de snorkel', 'Passeio por toda a costa de Bávaro – Punta Cana', 'Bebidas não alcoólicas', 'Guias e equipamentos de segurança'],
    },
    notes: { es: [], en: [], pt: [] },
    accent: '#12c2c2',
    deep: '#064a57',
    image: {
      src: lancha,
      alt: {
        es: 'Dos lanchas rápidas navegando sobre agua turquesa frente a una playa de palmeras',
        en: 'Two speedboats cruising over turquoise water off a palm-lined beach',
        pt: 'Duas lanchas rápidas navegando sobre água turquesa em frente a uma praia de palmeiras',
      },
    },
  },
  {
    slug: 'monkeyland',
    category: 'nature',
    name: { es: 'Monkeyland', en: 'Monkeyland', pt: 'Monkeyland' },
    tagline: {
      es: 'Monos ardilla, jardín botánico, café y cacao.',
      en: 'Squirrel monkeys, botanical garden, coffee and cacao.',
      pt: 'Macacos-esquilo, jardim botânico, café e cacau.',
    },
    description: {
      es: 'Interacción con monos ardilla y otros animales junto a guías experimentados. La visita sigue por el jardín botánico, entre flores, árboles frutales y plantas medicinales, y por una plantación de café y cacao dominicano con degustación.',
      en: 'Interaction with squirrel monkeys and other animals alongside experienced guides. The visit continues through the botanical garden, among flowers, fruit trees and medicinal plants, and a Dominican coffee and cacao plantation with a tasting.',
      pt: 'Interação com macacos-esquilo e outros animais ao lado de guias experientes. A visita continua pelo jardim botânico, entre flores, árvores frutíferas e plantas medicinais, e por uma plantação de café e cacau dominicano com degustação.',
    },
    inclusions: {
      es: ['Transporte ida y vuelta', 'Interacción con monos ardilla', 'Guías experimentados', 'Visita al jardín botánico', 'Exploración de flores, árboles frutales y plantas medicinales', 'Visita a plantación de café y cacao dominicano con degustación', 'Interacción con otros animales'],
      en: ['Round-trip transportation', 'Interaction with squirrel monkeys', 'Experienced guides', 'Botanical garden visit', 'Exploration of flowers, fruit trees and medicinal plants', 'Visit to a Dominican coffee and cacao plantation with tasting', 'Interaction with other animals'],
      pt: ['Transporte de ida e volta', 'Interação com macacos-esquilo', 'Guias experientes', 'Visita ao jardim botânico', 'Exploração de flores, árvores frutíferas e plantas medicinais', 'Visita a uma plantação de café e cacau dominicano com degustação', 'Interação com outros animais'],
    },
    notes: { es: [kidsNote.es], en: [kidsNote.en], pt: [kidsNote.pt] },
    accent: '#8fbf4a',
    deep: '#2c4413',
    image: {
      src: monoArdilla,
      alt: {
        es: 'Mono ardilla trepando por el tronco de un árbol entre hojas verdes',
        en: 'Squirrel monkey climbing a tree trunk among green leaves',
        pt: 'Macaco-esquilo subindo no tronco de uma árvore entre folhas verdes',
      },
      position: '40% 45%',
      credit: 'commons-mono-ardilla.jpg',
    },
  },
  {
    slug: 'party-boat',
    category: 'sea',
    name: { es: 'Party Boat', en: 'Party Boat', pt: 'Party Boat' },
    tagline: {
      es: 'DJ, barra libre y piscina natural.',
      en: 'DJ, open bar and a natural pool.',
      pt: 'DJ, open bar e piscina natural.',
    },
    description: {
      es: 'Una fiesta en el mar con barra libre de bebidas, DJ de música nacional e internacional, concursos de baile con premios, animación y shows. Incluye snorkel en una piscina natural y snacks ligeros.',
      en: 'A party at sea with an open bar, a DJ playing Dominican and international music, dance contests with prizes, entertainment and shows. Includes snorkeling in a natural pool and light snacks.',
      pt: 'Uma festa no mar com open bar, DJ de música nacional e internacional, concursos de dança com prêmios, animação e shows. Inclui snorkel em uma piscina natural e lanches leves.',
    },
    inclusions: {
      es: ['Transporte ida y vuelta', 'Barra libre de bebidas', 'Snorkel en piscina natural', 'DJ con música nacional e internacional', 'Snacks ligeros', 'Concursos de baile con premios', 'Animación y shows'],
      en: ['Round-trip transportation', 'Open bar', 'Snorkeling in a natural pool', 'DJ with Dominican and international music', 'Light snacks', 'Dance contests with prizes', 'Entertainment and shows'],
      pt: ['Transporte de ida e volta', 'Open bar de bebidas', 'Snorkel em uma piscina natural', 'DJ com música nacional e internacional', 'Lanches leves', 'Concursos de dança com prêmios', 'Animação e shows'],
    },
    notes: {
      es: ['Los hoteles del área de Cap Cana y Uvero Alto deben pagar una tarifa adicional de transporte.'],
      en: ['Hotels in the Cap Cana and Uvero Alto area must pay an additional transportation fee.'],
      pt: ['Hotéis na área de Cap Cana e Uvero Alto devem pagar uma taxa adicional de transporte.'],
    },
    accent: '#f0806a',
    deep: '#162a5c',
    image: {
      src: piscinaNatural,
      alt: {
        es: 'Piscina natural de agua turquesa y poco profunda cerca de Bávaro, con lanchas y veleros al fondo',
        en: 'Shallow turquoise natural pool near Bávaro, with boats and sailboats in the distance',
        pt: 'Piscina natural de água turquesa e rasa perto de Bávaro, com lanchas e veleiros ao fundo',
      },
      position: '50% 60%',
      credit: 'commons-piscina-natural.jpg',
    },
  },
  {
    slug: 'coco-bongo',
    category: 'night',
    name: { es: 'Coco Bongo Regular', en: 'Coco Bongo Regular', pt: 'Coco Bongo Regular' },
    tagline: {
      es: 'La noche también es Caribe.',
      en: 'The night is Caribbean too.',
      pt: 'A noite também é Caribe.',
    },
    description: {
      es: 'Una noche de show y discoteca en Coco Bongo con transporte grupal de ida y vuelta. Eliges entre dos paquetes: Drink Pack u Open Bar.',
      en: 'A night of show and club at Coco Bongo with round-trip group transportation. You choose between two packages: Drink Pack or Open Bar.',
      pt: 'Uma noite de show e balada no Coco Bongo com transporte em grupo de ida e volta. Você escolhe entre dois pacotes: Drink Pack ou Open Bar.',
    },
    inclusions: {
      es: ['Transporte grupal ida y vuelta'],
      en: ['Round-trip group transportation'],
      pt: ['Transporte em grupo de ida e volta'],
    },
    options: [
      {
        name: { es: 'Drink Pack', en: 'Drink Pack', pt: 'Drink Pack' },
        items: {
          es: ['Transporte grupal ida y vuelta', 'Cinco (5) tragos de bebidas nacionales'],
          en: ['Round-trip group transportation', 'Five (5) national drinks'],
          pt: ['Transporte em grupo de ida e volta', 'Cinco (5) doses de bebidas nacionais'],
        },
      },
      {
        name: { es: 'Open Bar', en: 'Open Bar', pt: 'Open Bar' },
        items: {
          es: ['Transporte grupal ida y vuelta', 'Barra libre toda la noche de bebidas nacionales (ron, vodka, whisky, gin, tequila, cerveza)'],
          en: ['Round-trip group transportation', 'Open bar all night with national drinks (rum, vodka, whiskey, gin, tequila, beer)'],
          pt: ['Transporte em grupo de ida e volta', 'Open bar a noite toda de bebidas nacionais (rum, vodca, uísque, gim, tequila, cerveja)'],
        },
      },
    ],
    notes: {
      es: ['Transporte privado: 20 dólares adicionales.'],
      en: ['Private transportation: 20 additional dollars.'],
      pt: ['Transporte privado: 20 dólares adicionais.'],
    },
    accent: '#d65bf0',
    deep: '#14061f',
    image: {
      src: cocoBongo,
      alt: {
        es: 'Público en una discoteca con acróbatas en aros aéreos, luces de colores y confeti',
        en: 'Crowd in a nightclub with aerial hoop acrobats, coloured lights and confetti',
        pt: 'Público em uma casa noturna com acrobatas em arcos aéreos, luzes coloridas e confete',
      },
      position: '50% 35%',
    },
  },
];

export const tourBySlug = (slug: string) => tours.find((t) => t.slug === slug);
