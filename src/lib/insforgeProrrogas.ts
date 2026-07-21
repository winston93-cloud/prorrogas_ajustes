import { getInsforgeServicios } from './insforgeServicios'

/**
 * Lectura/escritura de pago_prorroga en Winston Servicios
 * (misma BD que alumno / precios / portal). Solo servidor.
 *
 * Antes: proyecto InsForge separado “Prórrogas y Ajustes” (desalineado del portal).
 */
export function getInsforgeProrrogas() {
  return getInsforgeServicios()
}
