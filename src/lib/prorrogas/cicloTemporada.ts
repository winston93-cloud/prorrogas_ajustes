import { getInsforgeServicios } from '../insforgeServicios'
import {
  calcularCicloEscolarPorCorte,
  calcularCicloInscripcion,
} from './ciclos'

/**
 * Ciclo de temporada desde Winston Servicios (`ciclos_escolares.es_actual`).
 * Fallback: corte 07-25 legacy si no hay fila.
 */
export async function resolverCicloEscolarTemporada(): Promise<number> {
  const db = getInsforgeServicios()
  const { data, error } = await db
    .from('ciclos_escolares')
    .select('valor')
    .eq('es_actual', true)
    .maybeSingle()

  if (!error && data?.valor != null) {
    const v = Number(data.valor)
    if (Number.isFinite(v) && v > 0) return v
  }

  return calcularCicloEscolarPorCorte()
}

export async function resolverCicloInscripcionTemporada(): Promise<number> {
  const cea = await resolverCicloEscolarTemporada()
  // Misma proyección que servicios_admin: cen = cea+1 si el catálogo ya avanzó
  // respecto al corte PHP; si es_actual ya es el destino, cen = cea.
  const porCorte = calcularCicloEscolarPorCorte()
  if (cea > porCorte) return cea
  return calcularCicloInscripcion()
}
