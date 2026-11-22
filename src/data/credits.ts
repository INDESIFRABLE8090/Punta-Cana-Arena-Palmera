/**
 * Créditos de fotografías de terceros (Wikimedia Commons u otras fuentes con licencia).
 * Cada imagen de terceros usada en el sitio DEBE tener aquí su entrada: autor, licencia
 * y enlace. Las licencias CC BY y CC BY-SA exigen atribución; CC BY-SA además exige
 * indicar los cambios (recorte y compresión). `npm test` verifica que no falte ninguna.
 */
export interface Credit {
  /** Nombre del archivo en src/assets/images. */
  file: string;
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

export const credits: Credit[] = [
  {
    file: 'commons-piscina-natural.jpg',
    title: 'Mar Caribe',
    author: 'Melodygar',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Mar_Caribe.jpg',
  },
  {
    file: 'commons-mono-ardilla.jpg',
    title: 'Saimiri sciureus 184553489',
    author: 'Lennart Hudel',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Saimiri_sciureus_184553489.jpg',
  },
  {
    file: 'commons-isla-catalina.jpg',
    title: "Catalina Island, La Romana, Dominican Republic. A line of bright painted bungalows nearby the cost line, shaded with palm trees (landscape)",
    author: 'Mstyslav Chernov',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: "https://commons.wikimedia.org/wiki/File:Catalina_Island,_La_Romana,_Dominican_Republic._A_line_of_bright_painted_bungalows_nearby_the_cost_line,_shaded_with_palm_trees_(landscape).jpg",
  },
  {
    file: 'commons-isla-saona.jpg',
    title: 'Isla Saona III',
    author: 'Melodygar',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Isla_Saona_III.jpg',
  },
  {
    file: 'commons-playa-macao.jpg',
    title: 'Playa Macao Dominican Republic',
    author: 'bogdix (Flickr)',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Playa_Macao_Dominican_Republic.jpg',
  },
];

export const creditFor = (file: string) => credits.find((c) => c.file === file);
