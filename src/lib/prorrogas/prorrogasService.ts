import { getInsforgeProrrogas } from '../insforgeProrrogas'
import { getInsforgeServicios } from '../insforgeServicios'
import {
  calcularCicloEscolar,
  calcularCicloInscripcion,
} from './ciclos'
import { planDescripcion, planLabel } from './plan'
import { calcularImporteProrroga } from './precio'
import type {
  AlumnoProrrogaRow,
  InsertProrrogaPayload,
  InsertProrrogaResult,
  ModoBusqueda,
} from './types'

type AlumnoDb = {
  alumno_id: number
  alumno_ref: number | null
  alumno_app: string | null
  alumno_apm: string | null
  alumno_nombre: string | null
  mes: number
  alumno_nuevo_ingreso: number
}

type ProrrogaDb = {
  prorroga_registro: string
  autor: string | null
  prorroga_no: number | null
  prorroga_ciclo_escolar: number
  correccion: number
}

function nombreCompleto(a: AlumnoDb): string {
  return [a.alumno_app, a.alumno_apm, a.alumno_nombre]
    .filter(Boolean)
    .join(' ')
    .trim()
}

function filtroCicloProrroga(
  modo: ModoBusqueda,
  cicloActual: number
): (p: ProrrogaDb) => boolean {
  const cicloSig = cicloActual + 1
  const cicloInsc = calcularCicloInscripcion()
  if (modo === 'inscripcion_pendiente') {
    const set = new Set([cicloActual, cicloSig, cicloInsc])
    return (p) => set.has(p.prorroga_ciclo_escolar)
  }
  return (p) => p.prorroga_ciclo_escolar === cicloActual
}

export async function buscarAlumnosProrrogas(params: {
  nivel: number
  grado: number
  grupo: number
  modo: ModoBusqueda
}): Promise<AlumnoProrrogaRow[]> {
  const servicios = getInsforgeServicios()
  const prorrogasDb = getInsforgeProrrogas()
  const cicloActual = calcularCicloEscolar()

  let query = servicios
    .from('alumno')
    .select(
      'alumno_id, alumno_ref, alumno_app, alumno_apm, alumno_nombre, mes, alumno_nuevo_ingreso'
    )
    .eq('alumno_nivel', params.nivel)
    .eq('alumno_grado', params.grado)

  if (params.modo === 'inscripcion_pendiente') {
    query = query.eq('alumno_status', 2)
    if (params.grupo > 0) query = query.eq('alumno_grupo', params.grupo)
  } else {
    query = query
      .eq('alumno_grupo', params.grupo)
      .eq('alumno_ciclo_escolar', cicloActual)
      .eq('alumno_status', 1)
  }

  const { data: alumnos, error } = await query.order('alumno_app', {
    ascending: true,
  })

  if (error) throw new Error(error.message)
  if (!alumnos?.length) return []

  const ids = alumnos.map((a) => a.alumno_id as number)
  const { data: prorrogasRaw, error: errPr } = await prorrogasDb
    .from('pago_prorroga')
    .select(
      'alumno_id, prorroga_registro, autor, prorroga_no, prorroga_ciclo_escolar, correccion'
    )
    .in('alumno_id', ids)
    .order('prorroga_registro', { ascending: true })

  if (errPr) throw new Error(errPr.message)

  const cicloFilter = filtroCicloProrroga(params.modo, cicloActual)
  const porAlumno = new Map<number, ProrrogaDb[]>()

  for (const row of prorrogasRaw ?? []) {
    const p = row as ProrrogaDb & { alumno_id: number }
    if (p.correccion === 1) continue
    if (!cicloFilter(p)) continue
    const list = porAlumno.get(p.alumno_id) ?? []
    list.push(p)
    porAlumno.set(p.alumno_id, list)
  }

  const resultados: AlumnoProrrogaRow[] = []

  for (const raw of alumnos as AlumnoDb[]) {
    const list = porAlumno.get(raw.alumno_id) ?? []
    const fechas = list.map((p) =>
      String(p.prorroga_registro).slice(0, 10)
    )
    const autores = list.map((p) => p.autor?.trim() || '—')

    let planLbl: string
    if (params.modo === 'inscripcion_pendiente') {
      planLbl = planLabel(
        raw.mes,
        raw.alumno_nuevo_ingreso === 1 ? 'nuevo' : 'baja'
      )
    } else {
      planLbl = planLabel(raw.mes)
    }

    resultados.push({
      alumno_id: raw.alumno_id,
      nombre: nombreCompleto(raw),
      alumno_ref: raw.alumno_ref ?? 0,
      plan_mes: raw.mes,
      plan_label: planLbl,
      modo_busqueda: params.modo,
      prorroga1: fechas[0] ?? '—',
      prorroga2: fechas[1] ?? '—',
      prorroga3: fechas[2] ?? '—',
      autor1: autores[0] ?? '—',
      autor2: autores[1] ?? '—',
      autor3: autores[2] ?? '—',
      conteo: list.length,
    })
  }

  resultados.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  return resultados
}

export async function obtenerPlanAlumno(alumnoId: number) {
  const { data, error } = await getInsforgeServicios()
    .from('alumno')
    .select('mes')
    .eq('alumno_id', alumnoId)
    .maybeSingle()

  if (error || !data) {
    throw new Error('Alumno no encontrado.')
  }

  const planMes = Number(data.mes)
  return {
    plan_mes: planMes,
    plan_label: planLabel(planMes),
    plan_descripcion: planDescripcion(planMes),
  }
}

export async function insertarProrroga(
  payload: InsertProrrogaPayload
): Promise<InsertProrrogaResult> {
  const {
    alumno_id,
    alumno_ref,
    pago_concepto,
    pago_ciclo_escolar,
    prorroga_fecha,
    correccion,
    autor,
    con_beca,
    pago_importe,
  } = payload

  if (
    alumno_id <= 0 ||
    alumno_ref <= 0 ||
    pago_ciclo_escolar <= 0 ||
    !prorroga_fecha
  ) {
    return { ok: false, error: 'Faltan datos obligatorios.' }
  }

  if ([11, 12, 13].includes(pago_concepto) && correccion !== 1) {
    return {
      ok: false,
      error: 'Los conceptos de inscripción solo se registran desde corrección.',
    }
  }

  let importe: number

  if (correccion === 0) {
    const calc = await calcularImporteProrroga(
      alumno_id,
      pago_concepto,
      pago_ciclo_escolar,
      Boolean(con_beca)
    )
    if (!calc.ok) return calc
    importe = calc.importe
  } else {
    importe = Number(pago_importe)
    if (!importe || importe <= 0) {
      return { ok: false, error: 'Importe de corrección inválido.' }
    }
  }

  const db = getInsforgeProrrogas()
  const { count, error: errCount } = await db
    .from('pago_prorroga')
    .select('*', { count: 'exact', head: true })
    .eq('alumno_id', alumno_id)

  if (errCount) return { ok: false, error: errCount.message }

  const prorrogaNo = (count ?? 0) + 1

  const { error: errInsert } = await db.from('pago_prorroga').insert({
    alumno_id,
    alumno_ref,
    pago_concepto,
    pago_importe: importe,
    prorroga_fecha,
    prorroga_status: 1,
    prorroga_ciclo_escolar: pago_ciclo_escolar,
    prorroga_no: prorrogaNo,
    correccion,
    autor: autor || 'sistema',
  })

  if (errInsert) {
    return { ok: false, error: `Error al insertar: ${errInsert.message}` }
  }

  return { ok: true, importe, prorroga_no: prorrogaNo }
}
