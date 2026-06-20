export type ModoBusqueda = 'activos' | 'inscripcion_pendiente'

export type AlumnoProrrogaRow = {
  alumno_id: number
  nombre: string
  alumno_ref: number
  plan_mes: number
  plan_label: string
  modo_busqueda: ModoBusqueda
  prorroga1: string
  prorroga2: string
  prorroga3: string
  autor1: string
  autor2: string
  autor3: string
  conteo: number
}

export type InsertProrrogaPayload = {
  alumno_id: number
  alumno_ref: number
  pago_concepto: number
  pago_ciclo_escolar: number
  prorroga_fecha: string
  correccion: 0 | 1
  autor: string
  con_beca?: boolean
  pago_importe?: number
}

export type InsertProrrogaResult =
  | { ok: true; importe: number; prorroga_no: number }
  | { ok: false; error: string }
