export interface FiltrosAplicados {
  tipo?: number
  clase?: number
  entidad?: number
  valorMin?: number
  valorMax?: number
}

export type FiltrosOpciones = {
  tipos: string[]
  clases: string[]
  entidades: string[]
  bancos: string[]
}

export type DropdownOption = {
  label: string
  value: number | string
}
