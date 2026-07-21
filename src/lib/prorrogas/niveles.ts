export type NivelOption = { value: number; label: string }

export const NIVELES_TODOS: NivelOption[] = [
  { value: 1, label: 'Maternal' },
  { value: 2, label: 'Kinder' },
  { value: 3, label: 'Primaria' },
  { value: 4, label: 'Secundaria' },
]

export function gradosPorNivel(nivel: number): { value: number; label: string }[] {
  switch (nivel) {
    case 1:
      return [
        { value: 1, label: 'A' },
        { value: 2, label: 'B' },
      ]
    case 2:
      return [1, 2, 3].map((g) => ({ value: g, label: String(g) }))
    case 3:
      return [1, 2, 3, 4, 5, 6].map((g) => ({ value: g, label: String(g) }))
    case 4:
      return [
        { value: 1, label: '7mo' },
        { value: 2, label: '8vo' },
        { value: 3, label: '9no' },
      ]
    default:
      return []
  }
}

export const GRUPOS = [
  { value: 0, label: 'N/A' },
  { value: 1, label: 'A' },
  { value: 2, label: 'B' },
  { value: 3, label: 'C' },
]
