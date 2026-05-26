<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import CatalogDropdown from './CatalogDropdown.vue'
  import type { DropdownOption } from '~/types/filters'

  defineProps<{
    resultCount: number
    totalCount: number
  }>()

  const filtersStore = useFilterStore()
  const { filters } = storeToRefs(filtersStore)

  const { tiposOptions, clasesOptions, estadosOptions } = useCatalog()
  const { points } = useMapa()

  const idTipo = computed({
    get: () => filters.value.tipo || null,
    set: (val: string | null) => {
      filtersStore.onChangeFilters({ ...filters.value, tipo: val || '' })
    },
  })

  const idClase = computed({
    get: () => filters.value.clase || null,
    set: (val: string | null) => {
      filtersStore.onChangeFilters({ ...filters.value, clase: val || '' })
    },
  })

  const idEntidad = computed({
    get: () => filters.value.entidad || null,
    set: (val: string | null) => {
      filtersStore.onChangeFilters({ ...filters.value, entidad: val })
    },
  })

  const bancoOptions = computed<DropdownOption[]>(() => {
    const set = new Set<string>()
    for (const p of points.value) {
      if (p.banco) set.add(p.banco)
    }
    return [...set].sort().map((b) => ({ label: b, value: b }))
  })

  const grupoOptions = computed<DropdownOption[]>(() => {
    const set = new Set<string>()
    for (const p of points.value) {
      if (p.grupo) set.add(p.grupo)
    }
    return [...set].sort().map((g) => ({ label: g, value: g }))
  })

  const idBanco = computed({
    get: () => filters.value.banco || null,
    set: (val: string | null) => {
      filtersStore.onChangeFilters({ ...filters.value, banco: val })
    },
  })

  const idGrupo = computed({
    get: () => filters.value.grupo || null,
    set: (val: string | null) => {
      filtersStore.onChangeFilters({ ...filters.value, grupo: val })
    },
  })

  const hayFiltros = computed(
    () =>
      !!idTipo.value ||
      !!idClase.value ||
      !!idEntidad.value ||
      !!idBanco.value ||
      !!idGrupo.value ||
      filters.value.valorMin !== null ||
      filters.value.valorMax !== null
  )

  const tieneInstitucion = computed(
    () => bancoOptions.value.length > 0 || grupoOptions.value.length > 0
  )
</script>

<template>
  <aside
    class="border-border bg-bg flex h-full w-[260px] shrink-0 flex-col overflow-y-auto border-r [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    <!-- Header -->
    <div class="border-border flex h-11 shrink-0 items-center gap-(--s-2) border-b px-(--s-4)">
      <img src="/icons/filter.svg" class="h-3.5 w-3.5 opacity-40 invert" alt="" />
      <span class="text-fg-subtle font-sans text-[11px] font-semibold tracking-[0.06em] uppercase">
        Filtros
      </span>
      <button
        v-if="hayFiltros"
        class="text-fg-muted hover:text-fg ml-auto font-sans text-xs transition-colors"
        @click="filtersStore.onCleanFilters()"
      >
        Limpiar
      </button>
    </div>

    <!-- Scroll area -->
    <div class="flex flex-1 flex-col gap-(--s-5) p-(--s-4)">
      <!-- Inmueble -->
      <div class="flex flex-col gap-(--s-3)">
        <p class="text-fg-subtle font-sans text-[10px] font-semibold tracking-[0.08em] uppercase">
          Inmueble
        </p>
        <div class="flex flex-col gap-(--s-2)">
          <CatalogDropdown v-model="idTipo" :options="tiposOptions" placeholder="Tipo" />
          <CatalogDropdown v-model="idClase" :options="clasesOptions" placeholder="Clase" />
        </div>
      </div>

      <!-- Ubicación -->
      <div class="flex flex-col gap-(--s-3)">
        <p class="text-fg-subtle font-sans text-[10px] font-semibold tracking-[0.08em] uppercase">
          Ubicación
        </p>
        <CatalogDropdown v-model="idEntidad" :options="estadosOptions" placeholder="Estado" />
      </div>

      <!-- Institución (dinámico) -->
      <div v-if="tieneInstitucion" class="flex flex-col gap-(--s-3)">
        <p class="text-fg-subtle font-sans text-[10px] font-semibold tracking-[0.08em] uppercase">
          Institución
        </p>
        <div class="flex flex-col gap-(--s-2)">
          <CatalogDropdown
            v-model="idBanco"
            :options="bancoOptions"
            placeholder="Banco"
            :disabled="bancoOptions.length === 0"
          />
          <CatalogDropdown
            v-model="idGrupo"
            :options="grupoOptions"
            placeholder="Grupo"
            :disabled="grupoOptions.length === 0"
          />
        </div>
      </div>

      <!-- Valor -->
      <div class="flex flex-col gap-(--s-3)">
        <p class="text-fg-subtle font-sans text-[10px] font-semibold tracking-[0.08em] uppercase">
          Valor concluido (MXN)
        </p>
        <div class="flex flex-col gap-(--s-2)">
          <input
            v-model.number="filters.valorMin"
            type="number"
            placeholder="Mínimo"
            class="border-border bg-surface-raised font-ui text-fg placeholder:text-fg-subtle focus:border-accent w-full rounded-(--r-md) border px-(--s-3) py-[6px] text-sm transition-colors outline-none"
          />
          <input
            v-model.number="filters.valorMax"
            type="number"
            placeholder="Máximo"
            class="border-border bg-surface-raised font-ui text-fg placeholder:text-fg-subtle focus:border-accent w-full rounded-(--r-md) border px-(--s-3) py-[6px] text-sm transition-colors outline-none"
          />
        </div>
      </div>
    </div>

    <!-- Footer: conteo -->
    <div class="border-border mt-auto shrink-0 border-t px-(--s-4) py-(--s-3)">
      <p class="font-ui text-fg-subtle text-xs">
        <span class="text-fg font-semibold">{{ resultCount.toLocaleString('es-MX') }}</span>
        de {{ totalCount.toLocaleString('es-MX') }} avalúos
      </p>
    </div>
  </aside>
</template>
