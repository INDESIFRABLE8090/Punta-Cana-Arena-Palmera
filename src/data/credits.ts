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
