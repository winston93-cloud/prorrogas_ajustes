'use client'

import { ChevronRight, Pencil, Plus } from 'lucide-react'
import type { AlumnoProrrogaRow } from '@/lib/prorrogas/types'

type Props = {
  titulo: string
  rows: AlumnoProrrogaRow[]
  loading: boolean
  puedeCorregir: boolean
  onAgregar: (row: AlumnoProrrogaRow) => void
  onCorregir: (row: AlumnoProrrogaRow) => void
}

function ProrrogaSlot({ fecha, autor }: { fecha: string; autor: string }) {
  const vacio = !fecha || fecha === '—' || fecha.trim() === ''
  return (
    <div className="pr-slot">
      <span className={vacio ? 'pr-slot-date pr-slot-date--empty' : 'pr-slot-date'}>
        {vacio ? '—' : fecha}
      </span>
      {!vacio ? <small className="pr-slot-autor">{autor}</small> : null}
    </div>
  )
}

function RowActions({
  row,
  puedeCorregir,
  onAgregar,
  onCorregir,
  compact,
}: {
  row: AlumnoProrrogaRow
  puedeCorregir: boolean
  onAgregar: (row: AlumnoProrrogaRow) => void
  onCorregir: (row: AlumnoProrrogaRow) => void
  compact?: boolean
}) {
  return (
    <div className={compact ? 'pr-row-actions pr-row-actions--compact' : 'pr-row-actions'}>
      <button
        type="button"
        className="pr-icon-btn pr-icon-btn--add"
        onClick={() => onAgregar(row)}
        title="Agregar prórroga"
        aria-label={`Agregar prórroga a ${row.nombre}`}
      >
        <Plus size={18} />
        {compact ? <span>Prórroga</span> : null}
      </button>
      {puedeCorregir ? (
        <button
          type="button"
          className="pr-icon-btn pr-icon-btn--edit"
          onClick={() => onCorregir(row)}
          title="Corrección manual"
          aria-label={`Corregir prórroga de ${row.nombre}`}
        >
          <Pencil size={16} />
          {compact ? <span>Corregir</span> : null}
        </button>
      ) : null}
    </div>
  )
}

export function ProrrogasTable({
  titulo,
  rows,
  loading,
  puedeCorregir,
  onAgregar,
  onCorregir,
}: Props) {
  const empty = !loading && rows.length === 0

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

      {empty ? (
        <p className="pr-table-empty-block">
          Selecciona nivel, grado y grupo para ver alumnos, o usa «Inscripción
          pendiente».
        </p>
      ) : null}

      {/* Vista tarjetas — móvil / tablet */}
      {!empty ? (
        <div className="pr-mobile-list" aria-label="Lista de alumnos">
          {rows.map((row, i) => {
            const pending = row.plan_label.includes('pendiente')
            return (
              <article key={row.alumno_id} className="pr-mobile-card">
                <div className="pr-mobile-card-top">
                  <span className="pr-mobile-index">{i + 1}</span>
                  <div className="pr-mobile-meta">
                    <span className="pr-mobile-ref">{row.alumno_ref}</span>
                    <h3 className="pr-mobile-name">{row.nombre}</h3>
                  </div>
                  <span
                    className={
                      pending
                        ? 'pr-plan-badge pr-plan-badge--pending'
                        : 'pr-plan-badge'
                    }
                  >
                    {row.plan_label}
                  </span>
                </div>

                <div className="pr-mobile-prorrogas">
                  <ProrrogaSlot fecha={row.prorroga1} autor={row.autor1} />
                  <ProrrogaSlot fecha={row.prorroga2} autor={row.autor2} />
                  <ProrrogaSlot fecha={row.prorroga3} autor={row.autor3} />
                </div>

                <div className="pr-mobile-footer">
                  <span className="pr-count-badge" title="Total prórrogas">
                    {row.conteo} / 3
                  </span>
                  <RowActions
                    row={row}
                    puedeCorregir={puedeCorregir}
                    onAgregar={onAgregar}
                    onCorregir={onCorregir}
                    compact
                  />
                </div>
              </article>
            )
          })}
        </div>
      ) : null}

      {/* Vista tabla — desktop */}
      {!empty ? (
        <div className="pr-table-desktop">
          <p className="pr-table-scroll-hint">
            <ChevronRight size={14} aria-hidden />
            Desliza horizontalmente si no ves todas las columnas
          </p>
          <div className="pr-table-wrap">
            <table className="pr-table">
              <thead>
                <tr>
                  <th className="pr-col-num">#</th>
                  <th className="pr-col-ref">Control</th>
                  <th className="pr-col-name">Nombre del alumno</th>
                  <th className="pr-col-plan">Plan</th>
                  <th>Prórroga 1</th>
                  <th>Prórroga 2</th>
                  <th>Prórroga 3</th>
                  <th className="pr-col-total">Total</th>
                  <th className="pr-col-action pr-table-sticky-end">Agregar</th>
                  {puedeCorregir ? (
                    <th className="pr-col-action pr-table-sticky-end-2">Corregir</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const pending = row.plan_label.includes('pendiente')
                  return (
                    <tr key={row.alumno_id}>
                      <td className="pr-col-num">{i + 1}</td>
                      <td className="pr-mono pr-col-ref">{row.alumno_ref}</td>
                      <td className="pr-name pr-col-name">{row.nombre}</td>
                      <td className="pr-col-plan">
                        <span
                          className={
                            pending
                              ? 'pr-plan-badge pr-plan-badge--pending'
                              : 'pr-plan-badge'
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
                      <td className="pr-col-total">
                        <span className="pr-count-badge">{row.conteo}</span>
                      </td>
                      <td className="pr-col-action pr-table-sticky-end">
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
                        <td className="pr-col-action pr-table-sticky-end-2">
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
        </div>
      ) : null}
    </section>
  )
}
