import type { EstadoGeoCollection } from '~/types/mapa'

export function useEstadosGeo() {
  const { data, pending, error } = useFetch<EstadoGeoCollection>('/api/estados-geo')

  const geoData = computed(() => data.value ?? null)

  return { geoData, pending, error }
}
