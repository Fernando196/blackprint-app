import type { PorEstado } from '~/types/por_estado.type'

export const usePorEstado = () => {
  const { estadosOptions } = useCatalog()
  const { data: estadosData } = useFetch<PorEstado[]>('/api/estados')

  const estados = computed<PorEstado[]>(() => {
    if (!estadosData.value) return []
    return estadosData.value.map((estado) => ({
      ...estado,
      nombreEntidad:
        estadosOptions.value.find((e) => String(e.value) === estado.entidad)?.label ??
        estado.entidad,
    }))
  })

  return { estados }
}
