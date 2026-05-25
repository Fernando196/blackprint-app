<script setup lang="ts">
  import type { MapFilters } from '~/types/mapa'
  import CatalogDropdown from './CatalogDropdown.vue'

  const props = defineProps<{
    value: MapFilters
    resultCount: number
    totalCount: number
  }>()

  const emit = defineEmits<{
    apply: [filters: MapFilters]
    clear: []
  }>()

  const { tiposOptions, clasesOptions, estadosOptions, getTipoInmueble, getClaseConstruccion } =
    useCatalog()

  const idTipo = ref<number | null>(
    tiposOptions.value.find((o) => o.label === props.value.tipo)?.value ?? null
  )
  const idClase = ref<number | null>(
    clasesOptions.value.find((o) => o.label === props.value.clase)?.value ?? null
  )
  const idEntidad = ref<number | null>(
    props.value.entidad ? Number(props.value.entidad) || null : null
  )
  const valorMin = ref<number | null>(props.value.valorMin)
  const valorMax = ref<number | null>(props.value.valorMax)

  watch(
    () => props.value,
    (v) => {
      idTipo.value = tiposOptions.value.find((o) => o.label === v.tipo)?.value ?? null
      idClase.value = clasesOptions.value.find((o) => o.label === v.clase)?.value ?? null
      idEntidad.value = v.entidad ? Number(v.entidad) || null : null
      valorMin.value = v.valorMin
      valorMax.value = v.valorMax
    },
    { deep: true }
  )

  function aplicar(): void {
    emit('apply', {
      tipo: idTipo.value !== null ? getTipoInmueble(idTipo.value) : '',
      clase: idClase.value !== null ? getClaseConstruccion(idClase.value) : '',
      entidad: idEntidad.value?.toString() ?? '',
      valorMin: valorMin.value,
      valorMax: valorMax.value,
    })
  }

  function limpiar(): void {
    idTipo.value = null
    idClase.value = null
    idEntidad.value = null
    valorMin.value = null
    valorMax.value = null
    emit('clear')
  }

  watch([idTipo, idClase, idEntidad], () => aplicar())

  const hayFiltros = computed(
    () =>
      idTipo.value !== null ||
      idClase.value !== null ||
      idEntidad.value !== null ||
      valorMin.value !== null ||
      valorMax.value !== null
  )
</script>

<template>
  <div
    class="border-border bg-bg flex h-[52px] shrink-0 items-center gap-(--s-3) border-b px-(--s-6)"
  >
    <div class="flex shrink-0 items-center gap-(--s-2)">
      <img src="/icons/filter.svg" class="h-4 w-4 opacity-40 invert" alt="" />
      <span class="text-fg-subtle font-sans text-[11px] font-semibold tracking-[0.06em] uppercase">
        Filtros
      </span>
    </div>

    <div class="bg-border mx-(--s-1) h-4 w-px shrink-0" />

    <CatalogDropdown v-model="idTipo" :options="tiposOptions" placeholder="Tipo" class="shrink-0" />
    <CatalogDropdown
      v-model="idClase"
      :options="clasesOptions"
      placeholder="Clase"
      class="shrink-0"
    />
    <CatalogDropdown
      v-model="idEntidad"
      :options="estadosOptions"
      placeholder="Estado"
      class="shrink-0"
    />

    <div class="bg-border mx-(--s-1) h-4 w-px shrink-0" />

    <input
      v-model.number="valorMin"
      type="number"
      placeholder="Valor mín."
      class="border-border bg-surface-raised font-ui text-fg placeholder:text-fg-subtle focus:border-accent w-[110px] shrink-0 rounded-full border px-(--s-3) py-[5px] text-sm transition-colors outline-none"
      @blur="aplicar"
      @keyup.enter="aplicar"
    />
    <span class="text-fg-subtle font-sans text-xs">—</span>
    <input
      v-model.number="valorMax"
      type="number"
      placeholder="Valor máx."
      class="border-border bg-surface-raised font-ui text-fg placeholder:text-fg-subtle focus:border-accent w-[110px] shrink-0 rounded-full border px-(--s-3) py-[5px] text-sm transition-colors outline-none"
      @blur="aplicar"
      @keyup.enter="aplicar"
    />

    <div class="bg-border mx-(--s-1) h-4 w-px shrink-0" />

    <button
      v-if="hayFiltros"
      class="border-border text-fg-muted hover:border-accent hover:text-fg shrink-0 rounded-full border px-(--s-3) py-[5px] font-sans text-sm font-medium transition-colors"
      @click="limpiar"
    >
      Limpiar
    </button>

    <p class="font-ui text-fg-subtle ml-auto shrink-0 text-xs">
      <span class="text-fg font-semibold">{{ resultCount.toLocaleString('es-MX') }}</span>
      de {{ totalCount.toLocaleString('es-MX') }} avalúos
    </p>
  </div>
</template>
