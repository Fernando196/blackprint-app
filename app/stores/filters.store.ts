import type { MapFilters } from '~/types/mapa'

export const useFilterStore = defineStore('filters', () => {
  const filters = ref<MapFilters>({
    tipo: '',
    clase: '',
    entidad: null,
    valorMin: null,
    valorMax: null,
    banco: null,
    grupo: null,
  })

  const resetMapTrigger = ref(0)

  function onChangeFilters(newFilters: MapFilters) {
    filters.value = newFilters
  }

  function onCleanFilters() {
    filters.value = {
      tipo: '',
      clase: '',
      entidad: null,
      valorMin: null,
      valorMax: null,
      banco: null,
      grupo: null,
    }
    resetMapTrigger.value++
  }

  return {
    filters,
    resetMapTrigger,
    onChangeFilters,
    onCleanFilters,
  }
})
