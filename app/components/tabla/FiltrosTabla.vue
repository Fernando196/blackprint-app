<script setup lang="ts">
  import type { TablaFiltros } from '~/types/tabla'

  const emit = defineEmits<{
    filtrosAplicados: [TablaFiltros]
    limpiar: []
  }>()

  const { tiposOptions, clasesOptions, estadosOptions, getTipoInmueble, getClaseConstruccion } =
    useCatalog()

  const idTipo = ref<number | null>(null)
  const idClase = ref<number | null>(null)
  const idEntidad = ref<number | null>(null)
  const valorMin = ref<number | null>(null)
  const valorMax = ref<number | null>(null)

  function aplicar(): void {
    emit('filtrosAplicados', {
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
    emit('limpiar')
  }

  const hayFiltros = computed(
    () =>
      idTipo.value !== null ||
      idClase.value !== null ||
      idEntidad.value !== null ||
      valorMin.value !== null ||
      valorMax.value !== null,
  )
</script>

<template>
  <div
    class="flex shrink-0 flex-wrap items-center gap-(--s-3) border-b border-[var(--depth-7)] bg-[var(--depth-9)] px-(--s-6) py-(--s-3)"
  >
    <div class="flex shrink-0 items-center gap-(--s-2)">
      <img src="/icons/filter.svg" class="h-4 w-4 opacity-40 invert" alt="" />
      <span class="font-sans text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--depth-5)]">
        Filtros
      </span>
    </div>

    <div class="h-4 w-px shrink-0 bg-[var(--depth-7)]" />

    <CatalogDropdown
      v-model="idTipo"
      :options="tiposOptions"
      placeholder="Tipo"
      class="shrink-0"
    />
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

    <div class="h-4 w-px shrink-0 bg-[var(--depth-7)]" />

    <input
      v-model.number="valorMin"
      type="number"
      placeholder="Valor mín."
      class="w-[110px] shrink-0 rounded-full border border-[var(--depth-7)] bg-[var(--depth-8)] px-(--s-3) py-[5px] font-ui text-sm text-[var(--on-primary)] outline-none transition-colors placeholder:text-[var(--depth-6)] focus:border-[var(--blue-p)] focus:ring-2 focus:ring-[var(--blue-p)]"
    />
    <span class="font-sans text-xs text-[var(--depth-5)]">—</span>
    <input
      v-model.number="valorMax"
      type="number"
      placeholder="Valor máx."
      class="w-[110px] shrink-0 rounded-full border border-[var(--depth-7)] bg-[var(--depth-8)] px-(--s-3) py-[5px] font-ui text-sm text-[var(--on-primary)] outline-none transition-colors placeholder:text-[var(--depth-6)] focus:border-[var(--blue-p)] focus:ring-2 focus:ring-[var(--blue-p)]"
    />

    <div class="h-4 w-px shrink-0 bg-[var(--depth-7)]" />

    <button
      class="shrink-0 rounded-full bg-[var(--blue-p)] px-(--s-4) py-[5px] font-sans text-sm font-semibold text-white transition-colors hover:bg-[var(--blue-h)]"
      @click="aplicar"
    >
      Aplicar filtros
    </button>

    <button
      v-if="hayFiltros"
      class="shrink-0 rounded-full border border-[var(--depth-7)] px-(--s-3) py-[5px] font-sans text-sm font-medium text-[var(--depth-5)] transition-colors hover:border-[var(--blue-p)] hover:text-[var(--on-primary)]"
      @click="limpiar"
    >
      Limpiar
    </button>
  </div>
</template>
