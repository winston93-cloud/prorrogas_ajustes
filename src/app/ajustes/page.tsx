'use client'

import { HubPlaceholder, HubShell } from '@/components/HubShell'

export default function AjustesPage() {
  return (
    <HubShell
      title="Ajustes"
      subtitle="Correcciones y ajustes de importes"
      backHref="/"
      backLabel="Prórrogas y Ajustes"
    >
      <HubPlaceholder
        title="Módulo en construcción"
        hint="Aquí irá la gestión de ajustes de pago vinculados a alumnos y conceptos del ciclo escolar."
      />
    </HubShell>
  )
}
