/** Ciclo escolar — alineado con servicios_admin / catálogo `es_actual`. */

export function cicloALabel(ciclo: number): string {
  const inicio = ciclo + 2003
  return `${inicio}-${inicio + 1}`
}

/**
 * Fallback por calendario (corte 25-jul), misma regla que legacy PHP
 * `calculateSchoolCycle` en prorrogas/module/callback.php.
 * Preferir siempre `resolverCicloEscolarTemporada()` (BD es_actual).
 */
export function calcularCicloEscolarPorCorte(fecha = new Date()): number {
  const cmd = `${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`
  const y = fecha.getFullYear() % 100
  return cmd < '07-25' ? y - 4 : y - 3
}

/** Ciclo de inscripción (cen) — legacy calculateInscriptionCycle, corte 07-25. */
export function calcularCicloInscripcion(fecha = new Date()): number {
  const cmd = `${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`
  const y = fecha.getFullYear() % 100
  const cea = cmd < '07-25' ? y - 4 : y - 3
  return cmd < '07-25' ? cea + 1 : cea
}

/** @deprecated Usar resolverCicloEscolarTemporada o calcularCicloEscolarPorCorte. */
export function calcularCicloEscolar(fecha = new Date()): number {
  return calcularCicloEscolarPorCorte(fecha)
}

export function ciclosDisponibles(cicloActual?: number): { value: number; label: string }[] {
  const actual = cicloActual ?? calcularCicloEscolarPorCorte()
  const min = Math.min(19, actual - 2)
  const max = Math.max(actual + 1, actual)
  const list: { value: number; label: string }[] = []
  for (let c = min; c <= max; c++) {
    list.push({ value: c, label: cicloALabel(c) })
  }
  return list
}
