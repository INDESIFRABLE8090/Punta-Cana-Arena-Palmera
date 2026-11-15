/**
 * Datos oficiales del negocio. Única fuente para contacto y marca.
 * No añadir aquí nada que el cliente no haya confirmado.
 */
export const site = {
  name: 'Punta Cana Arena y Palmera',
  shortName: 'Arena y Palmera',
  /** WhatsApp oficial en formato internacional, solo dígitos. */
  whatsapp: '18097798311',
  whatsappDisplay: '+1 (809) 779-8311',
  region: 'Punta Cana, República Dominicana',
  geo: { lat: 18.5601, lng: -68.3725 },
  /** Pendientes de confirmar por el cliente: se muestran solo si tienen valor. */
  email: '',
  instagram: '',
  facebook: '',
} as const;
