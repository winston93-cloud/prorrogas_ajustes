import { NextRequest, NextResponse } from 'next/server'
import { insertarProrroga } from '@/lib/prorrogas/prorrogasService'
import type { InsertProrrogaPayload } from '@/lib/prorrogas/types'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InsertProrrogaPayload

    const payload: InsertProrrogaPayload = {
      alumno_id: Number(body.alumno_id),
      alumno_ref: Number(body.alumno_ref),
      pago_concepto: Number(body.pago_concepto),
      pago_ciclo_escolar: Number(body.pago_ciclo_escolar),
      prorroga_fecha: String(body.prorroga_fecha),
      correccion: body.correccion === 1 ? 1 : 0,
      autor: String(body.autor ?? ''),
      con_beca: Boolean(body.con_beca),
      pago_importe: body.pago_importe != null ? Number(body.pago_importe) : undefined,
    }

    const result = await insertarProrroga(payload)
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 })
    }
    return NextResponse.json(result)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error al guardar prórroga'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
