'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, X } from 'lucide-react'
import { ciclosDisponibles } from '@/lib/prorrogas/ciclos'
import { conceptosParaModal } from '@/lib/prorrogas/conceptos'
import type { AlumnoProrrogaRow } from '@/lib/prorrogas/types'

type Props = {
  alumno: AlumnoProrrogaRow
  operador: string
  onClose: () => void
  onSaved: (ok: boolean, msg: string) => void
}

export function ProrrogaModal({ alumno, operador, onClose, onSaved }: Props) {
  const [planMes, setPlanMes] = useState(alumno.plan_mes)
  const [planText, setPlanText] = useState('')
  const [concepto, setConcepto] = useState('')
  const [ciclo, setCiclo] = useState('')
  const [fecha, setFecha] = useState('')
  const [conBeca, setConBeca] = useState('')
  const [importePreview, setImportePreview] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [ciclosOpts, setCiclosOpts] = useState(() => ciclosDisponibles())

  const conceptos = useMemo(
    () => conceptosParaModal(planMes, 'prorroga'),
    [planMes]
  )

  useEffect(() => {
    fetch('/api/prorrogas/ciclo')
      .then((r) => r.json())
      .then((d) => {
        if (d.cicloEscolar != null) setCiclo(String(d.cicloEscolar))
        if (Array.isArray(d.ciclos) && d.ciclos.length) setCiclosOpts(d.ciclos)
      })
      .catch(() => {
        /* fallback ciclosDisponibles() ya en state */
      })
  }, [])

  useEffect(() => {
    fetch(`/api/prorrogas/plan?alumno_id=${alumno.alumno_id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.plan_mes != null) setPlanMes(d.plan_mes)
        if (d.plan_descripcion) setPlanText(d.plan_descripcion)
      })
      .catch(() => setPlanText('Plan de pagos'))
  }, [alumno.alumno_id])

  useEffect(() => {
    if (!concepto || conBeca === '' || !ciclo) {
      setImportePreview(null)
      return
    }
    const t = setTimeout(async () => {
      const res = await fetch('/api/prorrogas/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alumno_id: alumno.alumno_id,
          pago_concepto: Number(concepto),
          pago_ciclo_escolar: Number(ciclo),
          con_beca: conBeca === '1',
        }),
      })
      const data = await res.json()
      setImportePreview(data.ok ? data.importe : null)
    }, 300)
    return () => clearTimeout(t)
  }, [concepto, conBeca, ciclo, alumno.alumno_id])

  async function guardar() {
    if (!concepto || !ciclo || !fecha || conBeca === '') {
      onSaved(false, 'Complete todos los campos.')
      return
    }
    if (concepto === '26' && planMes !== 2) {
      onSaved(false, 'Julio solo está disponible para plan de 11 meses.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/prorrogas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alumno_id: alumno.alumno_id,
          alumno_ref: alumno.alumno_ref,
          pago_concepto: Number(concepto),
          pago_ciclo_escolar: Number(ciclo),
          prorroga_fecha: fecha,
          correccion: 0,
          autor: operador,
          con_beca: conBeca === '1',
        }),
      })
      const data = await res.json()
      if (data.ok) {
        onClose()
        onSaved(true, `Prórroga guardada · Importe $${data.importe.toFixed(2)}`)
      } else {
        onSaved(false, data.error ?? 'No se pudo guardar.')
      }
    } catch {
      onSaved(false, 'Error de red al guardar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pr-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="pr-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="pr-modal-title"
        aria-modal="true"
      >
        <header className="pr-modal-head">
          <div>
            <h3 id="pr-modal-title">{alumno.nombre}</h3>
            <p className="pr-modal-sub">{planText || 'Consultando plan…'}</p>
          </div>
          <button type="button" className="pr-modal-close" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </header>

        <div className="pr-modal-body">
          <div className="pr-form-row">
            <label className="pr-field">
              <span>Número de control</span>
              <input type="text" value={alumno.alumno_ref} disabled />
            </label>
            <label className="pr-field">
              <span>Beneficio de beca</span>
              <select value={conBeca} onChange={(e) => setConBeca(e.target.value)}>
                <option value="">Seleccione</option>
                <option value="0">NO</option>
                <option value="1">SÍ</option>
              </select>
            </label>
          </div>

          <div className="pr-form-row">
            <label className="pr-field">
              <span>Concepto de pago</span>
              <select value={concepto} onChange={(e) => setConcepto(e.target.value)}>
                <option value="">Seleccione</option>
                {conceptos.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="pr-field">
              <span>Ciclo escolar</span>
              <select value={ciclo} onChange={(e) => setCiclo(e.target.value)}>
                <option value="">Seleccione</option>
                {ciclosOpts.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="pr-form-row">
            <label className="pr-field">
              <span>Fecha compromiso</span>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </label>
            {importePreview != null ? (
              <div className="pr-importe-preview">
                <span>Importe estimado</span>
                <strong>${importePreview.toFixed(2)}</strong>
              </div>
            ) : null}
          </div>
        </div>

        <footer className="pr-modal-foot">
          <button type="button" className="pr-btn pr-btn--ghost" onClick={onClose}>
            Cerrar
          </button>
          <button
            type="button"
            className="pr-btn pr-btn--primary"
            onClick={guardar}
            disabled={saving}
          >
            <Check size={16} />
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </footer>
      </div>
    </div>
  )
}
