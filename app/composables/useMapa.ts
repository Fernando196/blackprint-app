import type { MapPoint } from '~/types/mapa'

export function useMapa() {
  const { data, pending, error } = useFetch<MapPoint[]>('/api/mapa')

  const points = computed<MapPoint[]>(() => data.value ?? [])
  const isLoading = pending
  const hasError = computed(() => !!error.value)

  return { points, isLoading, hasError }
}
