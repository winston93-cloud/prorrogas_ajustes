export type ConceptoPago = {
  value: number
  label: string
  soloCorreccion?: boolean
  soloPlan11?: boolean
}

export const CONCEPTOS_BASE: ConceptoPago[] = [
  { value: 0, label: 'Agosto' },
  { value: 1, label: 'Septiembre' },
  { value: 2, label: 'Octubre' },
  { value: 3, label: 'Noviembre' },
  { value: 4, label: 'Diciembre' },
  { value: 5, label: 'Enero' },
  { value: 16, label: 'Evaluación y Herramientas Tec.' },
  { value: 6, label: 'Febrero' },
  { value: 7, label: 'Marzo' },
  { value: 8, label: 'Abril' },
  { value: 9, label: 'Mayo' },
  { value: 10, label: 'Junio' },
  { value: 26, label: 'Julio', soloPlan11: true },
]

export const CONCEPTOS_CORRECCION_EXTRA: ConceptoPago[] = [
  { value: 11, label: 'Reinscripción (Diferido 1)', soloCorreccion: true },
  { value: 12, label: 'Reinscripción (Diferido 2)', soloCorreccion: true },
  { value: 13, label: 'Inscripción completa', soloCorreccion: true },
]

export function conceptosParaModal(
  planMes: number,
  modo: 'prorroga' | 'correccion'
): ConceptoPago[] {
  const esPlan11 = planMes === 2
  const base = CONCEPTOS_BASE.filter((c) => !c.soloPlan11 || esPlan11)
  if (modo === 'correccion') {
    return [...base, ...CONCEPTOS_CORRECCION_EXTRA]
  }
  return base
}

export function conceptoLabel(value: number): string {
  const all = [...CONCEPTOS_BASE, ...CONCEPTOS_CORRECCION_EXTRA]
  return all.find((c) => c.value === value)?.label ?? `Concepto ${value}`
}
