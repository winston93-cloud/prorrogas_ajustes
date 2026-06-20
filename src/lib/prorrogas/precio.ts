import { getInsforgeServicios } from '../insforgeServicios'

export type CalculoImporteResult =
  | { ok: true; importe: number; plan_meses: number; alumno_nivel: number }
  | { ok: false; error: string }

export async function calcularImporteProrroga(
  alumnoId: number,
  pagoConcepto: number,
  pagoCicloEscolar: number,
  aplicarBeca: boolean
): Promise<CalculoImporteResult> {
  const db = getInsforgeServicios()

  const { data: alumno, error: errAlumno } = await db
    .from('alumno')
    .select('alumno_nivel, mes')
    .eq('alumno_id', alumnoId)
    .maybeSingle()

  if (errAlumno || !alumno) {
    return { ok: false, error: 'Alumno no encontrado.' }
  }

  let planMeses = Number(alumno.mes)
  if (planMeses !== 1 && planMeses !== 2) planMeses = 1
  const alumnoNivel = Number(alumno.alumno_nivel)

  if (pagoConcepto === 26 && planMeses !== 2) {
    return { ok: false, error: 'Julio solo aplica al plan de 11 meses.' }
  }

  const { data: precios, error: errPrecio } = await db
    .from('pago_boucher_precio')
    .select(
      'precio_colegiatura, precio_colegiatura2, precio_material, precio_agosto'
    )
    .eq('precio_ciclo_escolar', pagoCicloEscolar)
    .eq('alumno_nivel', alumnoNivel)
    .maybeSingle()

  if (errPrecio || !precios) {
    return { ok: false, error: 'No hay precios para el nivel y ciclo seleccionados.' }
  }

  const colegiatura = Number(precios.precio_colegiatura)
  const colegiatura2 = Number(precios.precio_colegiatura2)
  const material = Number(precios.precio_material)
  const agosto = Number(precios.precio_agosto)

  let importe: number
  if (pagoConcepto === 16) importe = material
  else if (pagoConcepto === 0) importe = agosto
  else if (pagoConcepto === 26) importe = colegiatura2
  else importe = planMeses === 2 ? colegiatura2 : colegiatura

  if (aplicarBeca) {
    const { data: beca } = await db
      .from('alumno_beca')
      .select('beca_porcentaje')
      .eq('alumno_id', alumnoId)
      .eq('beca_ciclo_escolar', pagoCicloEscolar)
      .eq('beca_estatus', 1)
      .maybeSingle()

    if (beca?.beca_porcentaje != null) {
      importe -= (importe * Number(beca.beca_porcentaje)) / 100
    }
  }

  return {
    ok: true,
    importe: Math.round(importe * 100) / 100,
    plan_meses: planMeses,
    alumno_nivel: alumnoNivel,
  }
}
