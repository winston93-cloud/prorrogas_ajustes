'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { permisosPorOperador } from '@/lib/prorrogas/permisos'
import { ProrrogasFilters } from './ProrrogasFilters'
import { ProrrogasTable } from './ProrrogasTable'
import { ProrrogaModal } from './ProrrogaModal'
import { CorreccionModal } from './CorreccionModal'
import type { AlumnoProrrogaRow, ModoBusqueda } from '@/lib/prorrogas/types'

const STORAGE_KEY = 'prorrogas_operador'

export function ProrrogasModule() {
  const searchParams = useSearchParams()
  const [operador, setOperador] = useState('mario')
  const permisos = permisosPorOperador(operador)

  const [nivel, setNivel] = useState(0)
  const [grado, setGrado] = useState(0)
  const [grupo, setGrupo] = useState(0)
  const [modo, setModo] = useState<ModoBusqueda>('activos')
  const [rows, setRows] = useState<AlumnoProrrogaRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; msg: string } | null>(
    null
  )

  const [modalProrroga, setModalProrroga] = useState<AlumnoProrrogaRow | null>(
    null
  )
  const [modalCorreccion, setModalCorreccion] =
    useState<AlumnoProrrogaRow | null>(null)

  useEffect(() => {
    const fromUrl = searchParams.get('operador')
    const stored =
      typeof window !== 'undefined' ? sessionStorage.getItem(STORAGE_KEY) : null
    const initial = fromUrl || stored || 'mario'
    setOperador(initial)
    sessionStorage.setItem(STORAGE_KEY, initial)
  }, [searchParams])

  const tituloTabla =
    modo === 'inscripcion_pendiente'
      ? 'Inscripción pendiente (baja temporal)'
      : 'Prórrogas del grupo'

  const cargar = useCallback(
    async (modoBusqueda: ModoBusqueda) => {
      if (!nivel || !grado) return
      // grupo 0 = N/A (legacy): válido para activos e inscripción pendiente

      setLoading(true)
      setError(null)
      try {
        const qs = new URLSearchParams({
          nivel: String(nivel),
          grado: String(grado),
          grupo: String(grupo),
          modo: modoBusqueda,
        })
        const res = await fetch(`/api/prorrogas/alumnos?${qs}`)
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error ?? 'No se pudo cargar la lista')
        }
        setRows(Array.isArray(data) ? data : [])
        setModo(modoBusqueda)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error de conexión')
        setRows([])
      } finally {
        setLoading(false)
      }
    },
    [nivel, grado, grupo]
  )

  useEffect(() => {
    if (nivel > 0 && grado > 0) {
      cargar('activos')
    }
  }, [grupo, nivel, grado, cargar])

  function showToast(type: 'ok' | 'err', msg: string) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4500)
  }

  async function onGuardado(ok: boolean, msg: string) {
    if (ok) {
      showToast('ok', msg)
      await cargar(modo)
    } else {
      showToast('err', msg)
    }
  }

  if (permisos.sinAcceso) {
    return (
      <div className="pr-alert pr-alert--warn">
        <strong>Sin permiso</strong>
        <p>
          El operador «{operador}» no tiene acceso al módulo de prórrogas. Usa{' '}
          <code>?operador=mario</code> en la URL para pruebas.
        </p>
      </div>
    )
  }

  return (
    <div className="pr-module">
      <div className="pr-operador-bar">
        <span className="pr-operador-label">Operador</span>
        <span className="pr-operador-name">{operador}</span>
        {permisos.puedeCorregir ? (
          <span className="pr-operador-badge">Admin · correcciones</span>
        ) : (
          <span className="pr-operador-badge pr-operador-badge--muted">
            Solo prórrogas
          </span>
        )}
      </div>

      <ProrrogasFilters
        niveles={permisos.niveles}
        nivel={nivel}
        grado={grado}
        grupo={grupo}
        onNivelChange={(v) => {
          setNivel(v)
          setGrado(0)
          setGrupo(0)
          setRows([])
        }}
        onGradoChange={(v) => {
          setGrado(v)
          setGrupo(0)
          setRows([])
        }}
        onGrupoChange={setGrupo}
        onInscripcionPendiente={() => cargar('inscripcion_pendiente')}
        loading={loading}
      />

      {error ? (
        <div className="pr-alert pr-alert--err">
          <strong>Error</strong>
          <p>{error}</p>
          <p className="pr-alert-hint">
            Verifica las variables InsForge en Vercel y que la migración{' '}
            <code>migrations/001_pago_prorroga.sql</code> esté aplicada en el
            proyecto Prórrogas y Ajustes.
          </p>
        </div>
      ) : null}

      <ProrrogasTable
        titulo={tituloTabla}
        rows={rows}
        loading={loading}
        puedeCorregir={permisos.puedeCorregir}
        onAgregar={(row) => {
          if (row.conteo >= 3) {
            showToast('err', 'Se superó el número máximo de prórrogas (3).')
            return
          }
          setModalProrroga(row)
        }}
        onCorregir={(row) => setModalCorreccion(row)}
      />

      {modalProrroga ? (
        <ProrrogaModal
          alumno={modalProrroga}
          operador={operador}
          onClose={() => setModalProrroga(null)}
          onSaved={onGuardado}
        />
      ) : null}

      {modalCorreccion ? (
        <CorreccionModal
          alumno={modalCorreccion}
          operador={operador}
          onClose={() => setModalCorreccion(null)}
          onSaved={onGuardado}
        />
      ) : null}

      {toast ? (
        <div
          className={`pr-toast pr-toast--${toast.type}`}
          role="status"
          aria-live="polite"
        >
          {toast.msg}
        </div>
      ) : null}
    </div>
  )
}
