'use client'

import { Pencil, Plus } from 'lucide-react'
import type { AlumnoProrrogaRow } from '@/lib/prorrogas/types'

type Props = {
  titulo: string
  rows: AlumnoProrrogaRow[]
  loading: boolean
  puedeCorregir: boolean
  onAgregar: (row: AlumnoProrrogaRow) => void
  onCorregir: (row: AlumnoProrrogaRow) => void
}

export function ProrrogasTable({
  titulo,
  rows,
  loading,
  puedeCorregir,
  onAgregar,
  onCorregir,
}: Props) {
  return (
    <section className="pr-table-card">
      <div className="pr-table-header">
        <h2 className="pr-table-title">{titulo}</h2>
        {loading ? (
          <span className="pr-table-loading">Cargando…</span>
        ) : (
          <span className="pr-table-count">
            {rows.length} alumno{rows.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="pr-table-wrap">
        <table className="pr-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Control</th>
              <th>Nombre del alumno</th>
              <th>Plan</th>
              <th>Prórroga 1</th>
              <th>Prórroga 2</th>
              <th>Prórroga 3</th>
              <th>Total</th>
              <th>Agregar</th>
              {puedeCorregir ? <th>Corregir</th> : null}
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 ? (
              <tr>
                <td colSpan={puedeCorregir ? 10 : 9} className="pr-table-empty">
                  Selecciona nivel, grado y grupo para ver alumnos, o usa
                  «Inscripción pendiente».
                </td>
              </tr>
            ) : null}
            {rows.map((row, i) => {
              const pending = row.plan_label.includes('pendiente')
              return (
                <tr key={row.alumno_id}>
                  <td>{i + 1}</td>
                  <td className="pr-mono">{row.alumno_ref}</td>
                  <td className="pr-name">{row.nombre}</td>
                  <td>
                    <span
                      className={
                        pending ? 'pr-plan-badge pr-plan-badge--pending' : 'pr-plan-badge'
                      }
                    >
                      {row.plan_label}
                    </span>
                  </td>
                  <td className="pr-prorroga-cell">
                    <span>{row.prorroga1}</span>
                    <small>{row.autor1}</small>
                  </td>
                  <td className="pr-prorroga-cell">
                    <span>{row.prorroga2}</span>
                    <small>{row.autor2}</small>
                  </td>
                  <td className="pr-prorroga-cell">
                    <span>{row.prorroga3}</span>
                    <small>{row.autor3}</small>
                  </td>
                  <td>
                    <span className="pr-count-badge">{row.conteo}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="pr-icon-btn pr-icon-btn--add"
                      onClick={() => onAgregar(row)}
                      title="Agregar prórroga"
                      aria-label={`Agregar prórroga a ${row.nombre}`}
                    >
                      <Plus size={18} />
                    </button>
                  </td>
                  {puedeCorregir ? (
                    <td>
                      <button
                        type="button"
                        className="pr-icon-btn pr-icon-btn--edit"
                        onClick={() => onCorregir(row)}
                        title="Corrección manual"
                        aria-label={`Corregir prórroga de ${row.nombre}`}
                      >
                        <Pencil size={16} />
                      </button>
                    </td>
                  ) : null}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
