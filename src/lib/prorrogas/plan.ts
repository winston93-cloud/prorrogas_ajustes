export function planLabel(planMeses: number, modoInscripcion?: 'nuevo' | 'baja'): string {
  if (modoInscripcion === 'nuevo') return 'Nuevo ingreso (pendiente)'
  if (modoInscripcion === 'baja') return 'Baja temporal (pendiente)'
  if (planMeses === 2) return '11 meses'
  if (planMeses === 1) return '10 meses'
  return 'Sin definir'
}

export function planDescripcion(planMeses: number): string {
  if (planMeses === 2) return 'Plan de pagos: 11 meses (incluye Julio)'
  if (planMeses === 1) return 'Plan de pagos: 10 meses'
  return 'Plan de pagos: sin definir (se aplicará tarifa de 10 meses)'
}
