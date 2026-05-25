import type { FiltrosOpciones } from '~/types/filters'

export function useFiltros() {
  const { data, pending, error } = useFetch<FiltrosOpciones>('/api/filtros')

  const tipos = computed<string[]>(() => data.value?.tipos ?? [])
  const clases = computed<string[]>(() => data.value?.clases ?? [])
  const entidades = computed<string[]>(() => data.value?.entidades ?? [])
  const bancos = computed<string[]>(() => data.value?.bancos ?? [])

  return { tipos, clases, entidades, bancos, pending, error }
}
