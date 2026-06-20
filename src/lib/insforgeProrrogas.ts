import { createAdminClient, type InsForgeClient } from '@insforge/sdk'

function requireProrrogasEnv() {
  const baseUrl =
    process.env.INSFORGE_PRORROGAS_URL ??
    process.env.NEXT_PUBLIC_INSFORGE_PRORROGAS_URL ??
    process.env.NEXT_PUBLIC_INSFORGE_URL ??
    process.env.INSFORGE_URL
  const apiKey =
    process.env.INSFORGE_PRORROGAS_API_KEY ?? process.env.INSFORGE_API_KEY
  if (!baseUrl || !apiKey) {
    throw new Error(
      'Faltan INSFORGE_PRORROGAS_URL e INSFORGE_PRORROGAS_API_KEY en .env.local (proyecto Prórrogas y Ajustes).'
    )
  }
  return { baseUrl, apiKey }
}

let client: InsForgeClient | null = null

/** Lectura/escritura pago_prorroga — proyecto Prórrogas y Ajustes. Solo servidor. */
export function getInsforgeProrrogas() {
  if (!client) {
    client = createAdminClient(requireProrrogasEnv())
  }
  return client.database
}
