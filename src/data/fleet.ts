import type { L } from '@/i18n/config';

/**
 * Vehículos de transporte privado.
 * Vacío a propósito: el cliente aún no ha confirmado modelos, capacidades ni
 * equipamiento. Al añadir entradas aquí, la sección Transporte las muestra sola.
 * Ejemplo: { name: 'Modelo', details: { es: ['…'], en: ['…'], pt: ['…'] } }
 */
export interface Vehicle {
  name: string;
  details: L<string[]>;
}

export const fleet: Vehicle[] = [];
