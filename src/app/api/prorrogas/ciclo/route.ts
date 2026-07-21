import { NextResponse } from 'next/server'
import { cicloALabel } from '@/lib/prorrogas/ciclos'
import {
  resolverCicloEscolarTemporada,
  resolverCicloInscripcionTemporada,
} from '@/lib/prorrogas/cicloTemporada'
import { ciclosDisponibles } from '@/lib/prorrogas/ciclos'

export const runtime = 'nodejs'

/** Ciclo de temporada (`es_actual`) + opciones para modales. */
export async function GET() {
  try {
    const cicloEscolar = await resolverCicloEscolarTemporada()
    const cicloInscripcion = await resolverCicloInscripcionTemporada()
    return NextResponse.json({
      ok: true,
      cicloEscolar,
      cicloInscripcion,
      cicloLabel: cicloALabel(cicloEscolar),
      ciclos: ciclosDisponibles(cicloEscolar),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al resolver ciclo'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
