import { NextRequest, NextResponse } from 'next/server'
import { obtenerPlanAlumno } from '@/lib/prorrogas/prorrogasService'

export async function GET(request: NextRequest) {
  try {
    const alumnoId = Number(request.nextUrl.searchParams.get('alumno_id'))
    if (!alumnoId) {
      return NextResponse.json({ error: 'alumno_id requerido' }, { status: 400 })
    }
    const plan = await obtenerPlanAlumno(alumnoId)
    return NextResponse.json(plan)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al consultar plan'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
