'use client'

import { Search } from 'lucide-react'
import type { NivelOption } from '@/lib/prorrogas/niveles'
import { gradosPorNivel, GRUPOS } from '@/lib/prorrogas/niveles'

type Props = {
  niveles: NivelOption[]
  nivel: number
  grado: number
  grupo: number
  onNivelChange: (v: number) => void
  onGradoChange: (v: number) => void
  onGrupoChange: (v: number) => void
  onInscripcionPendiente: () => void
  loading: boolean
}

export function ProrrogasFilters({
  niveles,
  nivel,
  grado,
  grupo,
  onNivelChange,
  onGradoChange,
  onGrupoChange,
  onInscripcionPendiente,
  loading,
}: Props) {
  const grados = nivel > 0 ? gradosPorNivel(nivel) : []

  return (
    <section className="pr-filter-card" aria-label="Filtro de prórrogas">
      <h2 className="pr-filter-title">Filtro de prórrogas</h2>
      <div className="pr-filter-grid">
        <label className="pr-field">
          <span>Nivel</span>
          <select
            value={nivel || ''}
            onChange={(e) => onNivelChange(Number(e.target.value))}
            disabled={loading}
          >
            <option value="">Seleccione un nivel</option>
            {niveles.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </select>
        </label>

        <label className="pr-field">
          <span>Grado</span>
          <select
            value={grado || ''}
            onChange={(e) => onGradoChange(Number(e.target.value))}
            disabled={!nivel || loading}
          >
            <option value="">Seleccione un grado</option>
            {grados.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </label>

        <label className="pr-field">
          <span>Grupo</span>
          <select
            value={String(grupo)}
            onChange={(e) => onGrupoChange(Number(e.target.value))}
            disabled={!grado || loading}
          >
            {GRUPOS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </label>

        <div className="pr-field pr-field--action">
          <span>Inscripción pendiente</span>
          <button
            type="button"
            className="pr-btn pr-btn--secondary"
            onClick={onInscripcionPendiente}
            disabled={!nivel || !grado || loading}
            title="Alumnos de nuevo ingreso con pago de inscripción pendiente"
          >
            <Search size={16} aria-hidden />
            Mostrar
          </button>
        </div>
      </div>
    </section>
  )
}
