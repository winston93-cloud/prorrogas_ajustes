'use client'

import { HubPlaceholder, HubShell } from '@/components/HubShell'

export default function ProrrogasPage() {
  return (
    <HubShell
      title="Prórrogas"
      subtitle="Gestión de prórrogas de pago escolar"
      backHref="/"
      backLabel="Prórrogas y Ajustes"
    >
      <HubPlaceholder
        title="Módulo en construcción"
        hint="Aquí irá la migración del sistema legacy de prórrogas (filtros por nivel, grado, concepto, registro y consulta)."
      />
    </HubShell>
  )
}
