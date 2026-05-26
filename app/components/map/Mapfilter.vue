<script setup lang="ts">
  import type { MapPoint } from '~/types/mapa'
  import AvaluosMap from './AvaluosMap.vue'
  import EstadoPanel from './EstadoPanel.vue'

  interface Props {
    showExpanded?: boolean
    points: MapPoint[]
    filterPoints: MapPoint[]
    isLoading: boolean
    hasError: boolean
    mapaExpandido?: boolean
  }

  const emit = defineEmits(['onChangeExpanded'])
  const props = withDefaults(defineProps<Props>(), {
    showExpanded: false,
    mapaExpandido: false,
  })

  const filterStore = useFilterStore()
  const { estados } = usePorEstado()
  const { getTipoInmueble } = useCatalog()
  const mapaExpandido = ref<boolean>(props.mapaExpandido ?? false)

  const conteoPorEntidad = computed<Record<string, number>>(() => {
    const acc: Record<string, number> = {}
    for (const p of props.points) {
      acc[p.entidad] = (acc[p.entidad] ?? 0) + 1
    }
    return acc
  })

  const estadoSeleccionado = computed(() => filterStore.filters.entidad)

  const estadoData = computed(() => {
    if (!estadoSeleccionado.value) return null
    return estados.value.find((e) => e.entidad === estadoSeleccionado.value) ?? null
  })

  const porTipoEstado = computed(() => {
    if (!estadoSeleccionado.value) return []
    const entidad = estadoSeleccionado.value
    const tipoMap = new Map<string, number>()
    for (const p of props.points.filter((p) => p.entidad === entidad)) {
      const nombre = getTipoInmueble(p.tipo)
      tipoMap.set(nombre, (tipoMap.get(nombre) ?? 0) + 1)
    }
    return [...tipoMap].map(([tipo, count]) => ({ tipo, count })).sort((a, b) => b.count - a.count)
  })

  function onCerrarPanel(): void {
    filterStore.onChangeFilters({ ...filterStore.filters, entidad: null })
  }

  const handleChangeExpanded = () => {
    mapaExpandido.value = !mapaExpandido.value
    emit('onChangeExpanded', mapaExpandido.value)
  }
</script>
<template>
  <div class="h-full w-full">
    <AvaluosMap :points="points" :conteo-por-entidad="conteoPorEntidad" :expanded="mapaExpandido" />

    <EstadoPanel
      v-if="estadoSeleccionado"
      :nombre="estadoData?.nombreEntidad ?? ''"
      :estado-data="estadoData"
      :por-tipo="porTipoEstado"
      @cerrar="onCerrarPanel"
    />

    <button
      v-if="showExpanded"
      class="bg-surface text-fg-muted hover:text-fg absolute top-(--s-5) right-(--s-5) z-1000 flex items-center gap-2 rounded-full px-(--s-4) py-1.75 font-sans text-sm font-medium shadow-[var(--shadow-4)] transition-colors"
      @click="handleChangeExpanded"
    >
      <img
        :src="mapaExpandido ? '/icons/shrink.svg' : '/icons/fullscreen.svg'"
        class="h-4 w-4 opacity-60 invert"
        alt=""
      />
      {{ mapaExpandido ? 'Ver dashboard' : 'Expandir mapa' }}
    </button>

    <div v-if="isLoading" class="bg-bg/80 absolute inset-0 z-500 flex items-center justify-center">
      <p class="text-fg-muted font-sans text-sm">Cargando puntos...</p>
    </div>

    <div v-if="hasError" class="bg-bg/80 absolute inset-0 z-500 flex items-center justify-center">
      <p class="text-fg-muted font-sans text-sm">Error al cargar los datos del mapa.</p>
    </div>
  </div>
</template>
