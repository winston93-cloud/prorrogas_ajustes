import { NextRequest, NextResponse } from 'next/server'
import { calcularImporteProrroga } from '@/lib/prorrogas/precio'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const alumnoId = Number(body.alumno_id)
    const concepto = Number(body.pago_concepto)
    const ciclo = Number(body.pago_ciclo_escolar)
    const conBeca = Boolean(body.con_beca)

    if (!alumnoId || concepto < 0 || !ciclo) {
      return NextResponse.json(
        { ok: false, error: 'Parámetros incompletos' },
        { status: 400 }
      )
    }

    const result = await calcularImporteProrroga(alumnoId, concepto, ciclo, conBeca)
    return NextResponse.json(result)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al calcular importe'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
