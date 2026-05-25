<script setup lang="ts">
  import AvaluosMap from '~/components/map/AvaluosMap.vue'
  import MapFilterPanel from '~/components/map/MapFilterPanel.vue'
  import EstadoPanel from '~/components/map/EstadoPanel.vue'
  import type { MapFilters } from '~/types/mapa'
  import type { PorEstado } from '~/types/por_estado.type'

  const MAX_VISIBLE = 5000

  const { points, isLoading, hasError } = useMapa()
  const { data: estadosData } = useFetch<PorEstado[]>('/api/estados')
  const { getEstado } = useCatalog()

  const filtrosActivos = ref<MapFilters>({
    tipo: '',
    clase: '',
    entidad: '',
    valorMin: null,
    valorMax: null,
  })

  const estadoSeleccionado = ref<string | null>(null)

  const puntosFiltrados = computed(() => {
    const { tipo, clase, entidad, valorMin, valorMax } = filtrosActivos.value
    return points.value.filter((p) => {
      if (tipo && p.tipo !== tipo) return false
      if (clase && p.clase !== clase) return false
      if (entidad && p.entidad !== entidad) return false
      if (valorMin !== null && p.valorConcluido < valorMin) return false
      if (valorMax !== null && p.valorConcluido > valorMax) return false
      return true
    })
  })

  const puntosVisibles = computed(() => puntosFiltrados.value.slice(0, MAX_VISIBLE))

  const estadoData = computed<PorEstado | null>(() => {
    if (!estadoSeleccionado.value || !estadosData.value) return null
    return estadosData.value.find((e) => e.entidad === estadoSeleccionado.value) ?? null
  })

  const nombreEstado = computed<string>(() => {
    if (!estadoSeleccionado.value) return ''
    return getEstado(Number(estadoSeleccionado.value))?.nombre ?? estadoSeleccionado.value
  })

  const porTipoEstado = computed(() => {
    if (!estadoSeleccionado.value) return []
    const entidad = estadoSeleccionado.value
    const tipoMap = new Map<string, number>()
    for (const p of points.value.filter((p) => p.entidad === entidad)) {
      tipoMap.set(p.tipo, (tipoMap.get(p.tipo) ?? 0) + 1)
    }
    return [...tipoMap]
      .map(([tipo, count]) => ({ tipo, count }))
      .sort((a, b) => b.count - a.count)
  })

  function onFiltrosAplicados(filtros: MapFilters): void {
    filtrosActivos.value = filtros
  }

  function onFiltrosLimpiados(): void {
    filtrosActivos.value = { tipo: '', clase: '', entidad: '', valorMin: null, valorMax: null }
  }

  function onEntidadSeleccionada(entidadId: string | null): void {
    estadoSeleccionado.value = entidadId
  }

  function onCerrarPanel(): void {
    estadoSeleccionado.value = null
  }
</script>

<template>
  <div class="relative h-[calc(100vh-72px)]">
    <AvaluosMap
      :points="puntosVisibles"
      :active-entidad="estadoSeleccionado"
      @entidad-seleccionada="onEntidadSeleccionada"
    />

    <MapFilterPanel
      :result-count="puntosFiltrados.length"
      :total-count="points.length"
      @apply="onFiltrosAplicados"
      @clear="onFiltrosLimpiados"
    />

    <EstadoPanel
      v-if="estadoSeleccionado && estadoData"
      :nombre="nombreEstado"
      :estado-data="estadoData"
      :por-tipo="porTipoEstado"
      @cerrar="onCerrarPanel"
    />

    <div
      v-if="isLoading"
      class="bg-bg/80 absolute inset-0 z-[500] flex items-center justify-center"
    >
      <p class="text-fg-muted font-sans text-sm">Cargando puntos...</p>
    </div>

    <div v-if="hasError" class="bg-bg/80 absolute inset-0 z-[500] flex items-center justify-center">
      <p class="text-fg-muted font-sans text-sm">Error al cargar los datos del mapa.</p>
    </div>
  </div>
</template>
