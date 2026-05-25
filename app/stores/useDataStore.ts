import { defineStore } from 'pinia'
import type { MapPoint } from '~/types/mapa'
import type { TipoItem, ClaseItem } from '~/types/metricas'

type FiltrosState = {
  tipo: number | null
  clase: number | null
  entidad: number | null
  conservacion: number | null
  valorMin: number | null
  valorMax: number | null
}

export const useDataStore = defineStore('data', () => {
  const catalog = useCatalogStore()

  const rawMapa = ref<MapPoint[]>([])
  const isLoadingMapa = ref(false)
  const paginaTabla = ref(1)
  const limitePagina = ref(50)

  const filtros = ref<FiltrosState>({
    tipo: null,
    clase: null,
    entidad: null,
    conservacion: null,
    valorMin: null,
    valorMax: null,
  })

  const filtrosActivos = computed<number>(() =>
    Object.values(filtros.value).filter((v) => v !== null).length
  )

  const mapaFiltrado = computed((): MapPoint[] => {
    const { tipo, clase, entidad, valorMin, valorMax } = filtros.value
    const tipoStr =
      tipo !== null ? (catalog.tiposInmueble.find((i) => i.id === tipo)?.nombre ?? null) : null
    const claseStr =
      clase !== null
        ? (catalog.clasesConstruccion.find((i) => i.id === clase)?.nombre ?? null)
        : null
    const entidadStr = entidad !== null ? String(entidad) : null

    return rawMapa.value.filter((p) => {
      if (tipoStr && p.tipo !== tipoStr) return false
      if (claseStr && p.clase !== claseStr) return false
      if (entidadStr && p.entidad !== entidadStr) return false
      if (valorMin !== null && p.valorConcluido < valorMin) return false
      if (valorMax !== null && p.valorConcluido > valorMax) return false
      return true
    })
  })

  const totalMapa = computed<number>(() => mapaFiltrado.value.length)

  const metricasFiltradas = computed(() => {
    const pts = mapaFiltrado.value
    if (!pts.length) {
      return {
        total: 0,
        valorPromedio: 0,
        valorMediano: 0,
        m2Promedio: 0,
        porTipo: [] as TipoItem[],
        porClase: [] as ClaseItem[],
      }
    }

    const valores = pts.map((p) => p.valorConcluido).sort((a, b) => a - b)
    const n = pts.length
    const sum = valores.reduce((a, b) => a + b, 0)
    const mid = Math.floor(n / 2)
    const med =
      n % 2 === 0 ? ((valores[mid - 1] ?? 0) + (valores[mid] ?? 0)) / 2 : (valores[mid] ?? 0)

    const tipoMap = new Map<string, number>()
    const claseMap = new Map<string, number>()
    for (const p of pts) {
      tipoMap.set(p.tipo, (tipoMap.get(p.tipo) ?? 0) + 1)
      claseMap.set(p.clase, (claseMap.get(p.clase) ?? 0) + 1)
    }

    return {
      total: n,
      valorPromedio: sum / n,
      valorMediano: med,
      m2Promedio: pts.reduce((a, p) => a + p.valorM2, 0) / n,
      porTipo: ([...tipoMap].map(([tipo, count]) => ({ tipo, count })) as TipoItem[]).sort(
        (a, b) => b.count - a.count
      ),
      porClase: ([...claseMap].map(([clase, count]) => ({ clase, count })) as ClaseItem[]).sort(
        (a, b) => b.count - a.count
      ),
    }
  })

  async function inicializar(): Promise<void> {
    if (rawMapa.value.length > 0) return
    isLoadingMapa.value = true
    try {
      rawMapa.value = await $fetch<MapPoint[]>('/api/mapa')
    } finally {
      isLoadingMapa.value = false
    }
  }

  function setFiltro<K extends keyof FiltrosState>(key: K, value: FiltrosState[K]): void {
    filtros.value[key] = value
    paginaTabla.value = 1
  }

  function limpiarFiltros(): void {
    filtros.value = {
      tipo: null,
      clase: null,
      entidad: null,
      conservacion: null,
      valorMin: null,
      valorMax: null,
    }
    paginaTabla.value = 1
  }

  function setPagina(n: number): void {
    paginaTabla.value = n
  }

  return {
    rawMapa,
    isLoadingMapa,
    paginaTabla,
    limitePagina,
    filtros,
    filtrosActivos,
    mapaFiltrado,
    totalMapa,
    metricasFiltradas,
    inicializar,
    setFiltro,
    limpiarFiltros,
    setPagina,
  }
})
