import { NextRequest, NextResponse } from 'next/server'
import { buscarAlumnosProrrogas } from '@/lib/prorrogas/prorrogasService'
import type { ModoBusqueda } from '@/lib/prorrogas/types'

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams
    const nivel = Number(sp.get('nivel'))
    const grado = Number(sp.get('grado'))
    const grupo = Number(sp.get('grupo') ?? 0)
    const modo = (sp.get('modo') ?? 'activos') as ModoBusqueda

    if (!nivel || !grado) {
      return NextResponse.json([])
    }
    if (modo !== 'inscripcion_pendiente' && !grupo) {
      return NextResponse.json([])
    }

    const rows = await buscarAlumnosProrrogas({ nivel, grado, grupo, modo })
    return NextResponse.json(rows)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al buscar alumnos'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
