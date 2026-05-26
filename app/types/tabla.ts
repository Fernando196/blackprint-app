export type TablaRow = {
  id?: string
  colonia: string
  municipio: string
  entidad: string
  cp?: string
  tipo: string
  clase: string
  conservacion?: string
  valorConcluido: number
  valorM2: number
  supConstruida?: number
  supTerreno?: number
  recamaras?: number
  banco?: string
  fechaAvaluo?: string
}

export type TablaFiltros = {
  tipo: string
  clase: string
  entidad: string
  valorMin: number | null
  valorMax: number | null
  banco: string
  grupo: string
}

export type TablaState = {
  rows: TablaRow[]
  total: number
  isLoading: boolean
  hasError: boolean
  pagina: number
  limite: number
}
