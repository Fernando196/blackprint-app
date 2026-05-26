import type { MapPoint } from '~/types/mapa'

export function useMapa() {
  const { data, pending, error } = useFetch<MapPoint[]>('/api/mapa')

  const points = computed<MapPoint[]>(() => data.value ?? [])
  const isLoading = pending
  const hasError = computed(() => !!error.value)
  const filtersStore = useFilterStore()
  const { filters } = storeToRefs(filtersStore)

  const puntosFiltrados = computed(() => {
    const { tipo, clase, entidad, valorMin, valorMax, banco, grupo } = filters.value
    return points.value.filter((p) => {
      if (tipo && p.tipo?.toString() !== tipo) return false
      if (clase && p.clase?.toString() !== clase) return false
      if (entidad && p.entidad?.toString() !== entidad) return false
      if (banco && p.banco !== banco) return false
      if (grupo && p.grupo !== grupo) return false
      if (valorMin !== null && p.valorConcluido < valorMin) return false
      if (valorMax !== null && p.valorConcluido > valorMax) return false
      return true
    })
  })

  return { points, isLoading, hasError, puntosFiltrados }
}
