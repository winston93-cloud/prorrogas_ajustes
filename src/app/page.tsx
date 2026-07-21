import { redirect } from 'next/navigation'

/** Acceso directo al módulo de prórrogas (sin hub de dos tarjetas). */
export default function HomePage() {
  redirect('/prorrogas')
}
