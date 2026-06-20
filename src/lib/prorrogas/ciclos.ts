/** Ciclo escolar activo (corte 15-jul). */
export function calcularCicloEscolar(fecha = new Date()): number {
  const year = fecha.getFullYear()
  const month = fecha.getMonth() + 1
  const day = fecha.getDate()
  const startYear = month > 7 || (month === 7 && day >= 15) ? year : year - 1
  return startYear - 2003
}

/** Ciclo de inscripción (legacy calculateInscriptionCycle). */
export function calcularCicloInscripcion(fecha = new Date()): number {
  const month = fecha.getMonth() + 1
  const day = fecha.getDate()
  const yy = fecha.getFullYear() % 100
  const antesCambio = month < 7 || (month === 7 && day < 10)
  const cea = antesCambio ? yy - 4 : yy - 3
  return antesCambio ? cea + 1 : cea
}

export function cicloALabel(ciclo: number): string {
  const inicio = ciclo + 2003
  return `${inicio}-${inicio + 1}`
}

/** Ciclos disponibles en modales (19–23 + dinámicos). */
export function ciclosDisponibles(): { value: number; label: string }[] {
  const actual = calcularCicloEscolar()
  const min = Math.min(19, actual - 2)
  const max = Math.max(23, actual + 1)
  const list: { value: number; label: string }[] = []
  for (let c = min; c <= max; c++) {
    list.push({ value: c, label: cicloALabel(c) })
  }
  return list
}
