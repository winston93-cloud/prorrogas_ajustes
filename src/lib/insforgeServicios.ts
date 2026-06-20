import { createAdminClient, type InsForgeClient } from '@insforge/sdk'

function requireServiciosEnv() {
  const baseUrl =
    process.env.INSFORGE_SERVICIOS_URL ??
    process.env.NEXT_PUBLIC_INSFORGE_SERVICIOS_URL
  const apiKey = process.env.INSFORGE_SERVICIOS_API_KEY
  if (!baseUrl || !apiKey) {
    throw new Error(
      'Faltan INSFORGE_SERVICIOS_URL e INSFORGE_SERVICIOS_API_KEY en .env.local (proyecto Winston Servicios).'
    )
  }
  return { baseUrl, apiKey }
}

let client: InsForgeClient | null = null

/** Lectura de alumno, becas y precios — proyecto Winston Servicios. Solo servidor. */
export function getInsforgeServicios() {
  if (!client) {
    client = createAdminClient(requireServiciosEnv())
  }
  return client.database
}
