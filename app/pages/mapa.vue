<script setup lang="ts">
  import AvaluosMap from '~/components/map/AvaluosMap.vue'
  import MapFilterPanel from '~/components/map/MapFilterPanel.vue'
  import type { MapFilters } from '~/types/mapa'

  const MAX_VISIBLE = 5000

  const { points, isLoading, hasError } = useMapa()

  const filtrosActivos = ref<MapFilters>({
    tipo: '',
    clase: '',
    entidad: '',
    valorMin: null,
    valorMax: null,
  })

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

  function onFiltrosAplicados(filtros: MapFilters): void {
    filtrosActivos.value = filtros
  }

  function onFiltrosLimpiados(): void {
    filtrosActivos.value = { tipo: '', clase: '', entidad: '', valorMin: null, valorMax: null }
  }
</script>

<template>
  <div class="relative h-[calc(100vh-72px)]">
    <AvaluosMap :points="puntosVisibles" />

    <MapFilterPanel
      :result-count="puntosFiltrados.length"
      :total-count="points.length"
      @apply="onFiltrosAplicados"
      @clear="onFiltrosLimpiados"
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
