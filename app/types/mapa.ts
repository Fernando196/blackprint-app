export type MapPoint = {
  id?: string | number
  lat: number
  lng: number
  tipo: string
  clase: string
  valorConcluido: number
  valorM2: number
  colonia: string
  municipio: string
  entidad: string
}

export type MapState = {
  points: MapPoint[]
  isLoading: boolean
  hasError: boolean
}

export type MapFilters = {
  tipo: string
  clase: string
  entidad: string
  valorMin: number | null
  valorMax: number | null
}
