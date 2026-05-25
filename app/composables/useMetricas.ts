export interface TipoItem { tipo: string; count: number }
export interface ClaseItem { clase: string; count: number }
export interface BancoItem { banco: string; count: number }

export interface Metricas {
  total: number
  valorPromedio: number
  valorMediano: number
  m2Promedio: number
  porTipo: TipoItem[]
  porClase: ClaseItem[]
  porBanco: BancoItem[]
}

const fmtMXN = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)

const fmtN = (n: number) => new Intl.NumberFormat('es-MX').format(n)

export function useMetricas() {
  const { data: metricas, pending, error } = useFetch<Metricas>('/api/metricas')

  const kpis = computed(() => [
    { label: 'Total de avalúos', value: fmtN(metricas.value?.total ?? 0), unit: 'registros' },
    { label: 'Valor promedio', value: fmtMXN(metricas.value?.valorPromedio ?? 0) },
    { label: 'Valor mediano', value: fmtMXN(metricas.value?.valorMediano ?? 0) },
    { label: 'Valor promedio por m²', value: fmtMXN(metricas.value?.m2Promedio ?? 0), unit: '/ m²' },
  ])

  const porTipo = computed(() => metricas.value?.porTipo ?? [])
  const porClase = computed(() => metricas.value?.porClase ?? [])
  const porBanco = computed(() => metricas.value?.porBanco ?? [])

  return { pending, error, kpis, porTipo, porClase, porBanco }
}
