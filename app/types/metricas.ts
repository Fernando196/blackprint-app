export type TipoItem = { tipo: string; count: number }
export type ClaseItem = { clase: string; count: number }
export type BancoItem = { banco: string; count: number }

export interface Metricas {
  total: number
  valorPromedio: number
  valorMediano: number
  m2Promedio: number
  porTipo: TipoItem[]
  porClase: ClaseItem[]
  porBanco: BancoItem[]
}

export interface MetricasFiltradas extends Metricas {}
