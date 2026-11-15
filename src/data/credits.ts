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

export const credits: Credit[] = [];

export const creditFor = (file: string) => credits.find((c) => c.file === file);
