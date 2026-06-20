import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prórrogas y Ajustes | Winston',
  description: 'Gestión de prórrogas y ajustes de pago escolar',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="dark">
      <body>{children}</body>
    </html>
  )
}
