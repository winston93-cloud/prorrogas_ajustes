import { NIVELES_TODOS, type NivelOption } from './niveles'

const ADMINS = new Set(['alan', 'mario', 'carlos', 'emmanuel', 'rafa', 'ruben'])
const MATERNAL_KINDER = new Set(['coordkin', 'fatima'])
const PRIMARIA = new Set(['coordprim', 'controlprim'])
const SECUNDARIA = new Set(['coordsec', 'controlsec', 'josefina'])

export type PermisosOperador = {
  niveles: NivelOption[]
  puedeCorregir: boolean
  sinAcceso: boolean
}

export function permisosPorOperador(operador: string): PermisosOperador {
  const u = operador.trim().toLowerCase()

  if (ADMINS.has(u)) {
    return { niveles: NIVELES_TODOS, puedeCorregir: true, sinAcceso: false }
  }
  if (MATERNAL_KINDER.has(u)) {
    return {
      niveles: NIVELES_TODOS.filter((n) => n.value <= 2),
      puedeCorregir: false,
      sinAcceso: false,
    }
  }
  if (PRIMARIA.has(u)) {
    return {
      niveles: NIVELES_TODOS.filter((n) => n.value === 3),
      puedeCorregir: false,
      sinAcceso: false,
    }
  }
  if (SECUNDARIA.has(u)) {
    return {
      niveles: NIVELES_TODOS.filter((n) => n.value === 4),
      puedeCorregir: false,
      sinAcceso: false,
    }
  }
  return { niveles: [], puedeCorregir: false, sinAcceso: true }
}
