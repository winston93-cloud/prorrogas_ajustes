'use client'

import { HubNavGrid, HubShell, type HubNavItem } from '@/components/HubShell'

const MODULOS: HubNavItem[] = [
  {
    label: 'Prórrogas',
    desc: 'Registro, consulta y seguimiento de prórrogas de pago escolar',
    path: '/prorrogas',
    accent: 'rose',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <circle cx="12" cy="16" r="3" />
        <polyline points="12 14 12 16 13.5 17.5" />
      </svg>
    ),
  },
  {
    label: 'Ajustes',
    desc: 'Correcciones y ajustes de importes en pagos escolares',
    path: '/ajustes',
    accent: 'amber',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        <path d="m15 5 4 4" />
      </svg>
    ),
  },
]

export default function HomePage() {
  return (
    <HubShell
      title="Prórrogas y Ajustes"
      subtitle="Selecciona un módulo para continuar"
    >
      <HubNavGrid items={MODULOS} />
    </HubShell>
  )
}
