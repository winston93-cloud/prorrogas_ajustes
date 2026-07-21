'use client'

import { Suspense } from 'react'
import { HubShell } from '@/components/HubShell'
import { ProrrogasModule } from '@/components/prorrogas/ProrrogasModule'
import { urlServiciosAdminDashboard } from '@/lib/serviciosAdminConfig'

function ProrrogasContent() {
  return (
    <HubShell
      title="Prórrogas"
      subtitle="Gestión de prórrogas de pago escolar"
      backHref={urlServiciosAdminDashboard()}
      backLabel="Servicios Administrativos"
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
          backHref={urlServiciosAdminDashboard()}
          backLabel="Servicios Administrativos"
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
