<script setup lang="ts">
  import type { MapFilters } from '~/types/mapa'

  const props = defineProps<{
    resultCount: number
    totalCount: number
    initialFilters?: MapFilters
  }>()

  const emit = defineEmits<{
    apply: [filters: MapFilters]
    clear: []
  }>()

  const { tiposOptions, clasesOptions, estadosOptions, getTipoInmueble, getClaseConstruccion } =
    useCatalog()

  const idTipo = ref<number | null>(
    tiposOptions.value.find((o) => o.label === props.initialFilters?.tipo)?.value ?? null,
  )
  const idClase = ref<number | null>(
    clasesOptions.value.find((o) => o.label === props.initialFilters?.clase)?.value ?? null,
  )
  const idEntidad = ref<number | null>(
    props.initialFilters?.entidad ? Number(props.initialFilters.entidad) || null : null,
  )
  const valorMin = ref<number | null>(props.initialFilters?.valorMin ?? null)
  const valorMax = ref<number | null>(props.initialFilters?.valorMax ?? null)

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

  const hayFiltrosActivos = computed(
    () =>
      idTipo.value !== null ||
      idClase.value !== null ||
      idEntidad.value !== null ||
      valorMin.value !== null ||
      valorMax.value !== null,
  )
</script>

<template>
  <aside
    class="absolute left-(--s-5) top-(--s-5) z-[1000] flex max-h-[calc(100vh-104px)] w-[350px] flex-col gap-(--s-4) overflow-y-auto rounded-(--r-lg) bg-surface p-(--s-5) shadow-4"
  >
    <div>
      <p class="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-fg-subtle">
        Explorar datos
      </p>
      <h3 class="mt-1 font-sans text-base font-semibold text-fg">Filtros</h3>
    </div>

    <div class="flex flex-col gap-(--s-2)">
      <label class="font-sans text-xs font-medium text-fg-muted">Tipo de inmueble</label>
      <CatalogDropdown v-model="idTipo" :options="tiposOptions" placeholder="Todos" />
    </div>

    <div class="flex flex-col gap-(--s-2)">
      <label class="font-sans text-xs font-medium text-fg-muted">Clase de construcción</label>
      <CatalogDropdown v-model="idClase" :options="clasesOptions" placeholder="Todas" />
    </div>

    <div class="flex flex-col gap-(--s-2)">
      <label class="font-sans text-xs font-medium text-fg-muted">Estado</label>
      <CatalogDropdown v-model="idEntidad" :options="estadosOptions" placeholder="Todos" />
    </div>

    <div class="flex flex-col gap-(--s-2)">
      <label class="font-sans text-xs font-medium text-fg-muted">Valor concluido (MXN)</label>
      <div class="flex gap-(--s-2)">
        <input
          v-model.number="valorMin"
          type="number"
          placeholder="Mínimo"
          class="w-0 flex-1 rounded-(--r-md) border border-border bg-surface-raised px-(--s-3) py-2 font-ui text-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-accent"
        />
        <input
          v-model.number="valorMax"
          type="number"
          placeholder="Máximo"
          class="w-0 flex-1 rounded-(--r-md) border border-border bg-surface-raised px-(--s-3) py-2 font-ui text-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-accent"
        />
      </div>
    </div>

    <div class="flex gap-(--s-2)">
      <button
        class="flex-1 rounded-full bg-accent px-(--s-4) py-2 font-sans text-sm font-semibold text-white transition-colors hover:bg-accent-soft"
        @click="aplicar"
      >
        Aplicar filtros
      </button>
      <button
        v-if="hayFiltrosActivos"
        class="rounded-full border border-border px-(--s-4) py-2 font-sans text-sm font-medium text-fg-muted transition-colors hover:border-accent hover:text-fg"
        @click="limpiar"
      >
        Limpiar
      </button>
    </div>

    <div class="border-t border-border pt-(--s-3)">
      <p class="font-ui text-xs text-fg-subtle">
        <span class="font-semibold text-fg">
          {{ resultCount.toLocaleString('es-MX') }}
        </span>
        de {{ totalCount.toLocaleString('es-MX') }} avalúos
      </p>
    </div>
  </aside>
</template>
