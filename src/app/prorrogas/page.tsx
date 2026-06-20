'use client'

import { Suspense } from 'react'
import { HubShell } from '@/components/HubShell'
import { ProrrogasModule } from '@/components/prorrogas/ProrrogasModule'

function ProrrogasContent() {
  return (
    <HubShell
      title="Prórrogas"
      subtitle="Gestión de prórrogas de pago escolar"
      backHref="/"
      backLabel="Prórrogas y Ajustes"
      wide
    >
      <ProrrogasModule />
    </HubShell>
  )
}

export default function ProrrogasPage() {
  return (
    <Suspense
      fallback={
        <HubShell
          title="Prórrogas"
          subtitle="Cargando módulo…"
          backHref="/"
          backLabel="Prórrogas y Ajustes"
          wide
        >
          <div className="pr-table-loading" style={{ textAlign: 'center', padding: 48 }}>
            Cargando…
          </div>
        </HubShell>
      }
    >
      <ProrrogasContent />
    </Suspense>
  )
}
