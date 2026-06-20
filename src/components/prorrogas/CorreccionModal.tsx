'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, X } from 'lucide-react'
import { calcularCicloEscolar, ciclosDisponibles } from '@/lib/prorrogas/ciclos'
import { conceptosParaModal } from '@/lib/prorrogas/conceptos'
import type { AlumnoProrrogaRow } from '@/lib/prorrogas/types'

type Props = {
  alumno: AlumnoProrrogaRow
  operador: string
  onClose: () => void
  onSaved: (ok: boolean, msg: string) => void
}

export function CorreccionModal({ alumno, operador, onClose, onSaved }: Props) {
  const [planMes, setPlanMes] = useState(alumno.plan_mes)
  const [planText, setPlanText] = useState('')
  const [importe, setImporte] = useState('')
  const [concepto, setConcepto] = useState('')
  const [ciclo, setCiclo] = useState(String(calcularCicloEscolar()))
  const [fecha, setFecha] = useState('')
  const [saving, setSaving] = useState(false)

  const conceptos = useMemo(
    () => conceptosParaModal(planMes, 'correccion'),
    [planMes]
  )
  const ciclos = useMemo(() => ciclosDisponibles(), [])

  useEffect(() => {
    fetch(`/api/prorrogas/plan?alumno_id=${alumno.alumno_id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.plan_mes != null) setPlanMes(d.plan_mes)
        if (d.plan_descripcion) setPlanText(d.plan_descripcion)
      })
      .catch(() => setPlanText('Plan de pagos'))
  }, [alumno.alumno_id])

  async function guardar() {
    if (!importe || !concepto || !ciclo || !fecha) {
      onSaved(false, 'Complete todos los campos.')
      return
    }
    if (concepto === '26' && planMes !== 2) {
      onSaved(false, 'Julio solo está disponible para plan de 11 meses.')
      return
    }
    const conceptNum = Number(concepto)
    if ([11, 12, 13].includes(conceptNum) && parseFloat(importe) <= 0) {
      onSaved(false, 'Indique el importe de inscripción.')
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
          pago_concepto: conceptNum,
          pago_ciclo_escolar: Number(ciclo),
          prorroga_fecha: fecha,
          correccion: 1,
          autor: operador,
          pago_importe: parseFloat(importe),
        }),
      })
      const data = await res.json()
      if (data.ok) {
        onClose()
        onSaved(true, `Corrección guardada · Importe $${data.importe.toFixed(2)}`)
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
        className="pr-modal pr-modal--correccion"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="pr-modal-cor-title"
        aria-modal="true"
      >
        <header className="pr-modal-head">
          <div>
            <h3 id="pr-modal-cor-title">{alumno.nombre}</h3>
            <p className="pr-modal-sub">{planText || 'Consultando plan…'}</p>
            <span className="pr-modal-tag">Corrección manual</span>
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
              <span>Importe</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={importe}
                onChange={(e) => setImporte(e.target.value)}
                placeholder="0.00"
              />
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
                {ciclos.map((c) => (
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
          </div>
        </div>

        <footer className="pr-modal-foot">
          <button type="button" className="pr-btn pr-btn--ghost" onClick={onClose}>
            Cerrar
          </button>
          <button
            type="button"
            className="pr-btn pr-btn--primary pr-btn--amber"
            onClick={guardar}
            disabled={saving}
          >
            <Check size={16} />
            {saving ? 'Guardando…' : 'Guardar corrección'}
          </button>
        </footer>
      </div>
    </div>
  )
}
