<script setup lang="ts">
  import type { DropdownOption } from '~/types/filters'

  defineProps<{
    resultCount: number
    totalCount: number
  }>()

  const filterStore = useFilterStore()
  const { filters } = storeToRefs(filterStore)

  const { tiposOptions, clasesOptions, estadosOptions } = useCatalog()
  const { points } = useMapa()

  const idTipo = ref<string | null>(filters.value?.tipo || null)
  const idClase = ref<string | null>(filters.value?.clase || null)
  const idEntidad = ref<string | null>(filters.value?.entidad || null)
  const idBanco = ref<string | null>(filters.value?.banco || null)
  const idGrupo = ref<string | null>(filters.value?.grupo || null)
  const valorMin = ref<number | null>(filters.value?.valorMin ?? null)
  const valorMax = ref<number | null>(filters.value?.valorMax ?? null)

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

  function aplicar(): void {
    filterStore.onChangeFilters({
      tipo: idTipo.value || '',
      clase: idClase.value || '',
      entidad: idEntidad.value,
      valorMin: valorMin.value,
      valorMax: valorMax.value,
      banco: idBanco.value,
      grupo: idGrupo.value,
    })
  }

  function limpiar(): void {
    idTipo.value = null
    idClase.value = null
    idEntidad.value = null
    idBanco.value = null
    idGrupo.value = null
    valorMin.value = null
    valorMax.value = null
    filterStore.onCleanFilters()
  }

  const hayFiltrosActivos = computed(
    () =>
      idTipo.value !== null ||
      idClase.value !== null ||
      idEntidad.value !== null ||
      idBanco.value !== null ||
      idGrupo.value !== null ||
      valorMin.value !== null ||
      valorMax.value !== null
  )
</script>

<template>
  <aside
    class="bg-surface shadow-4 absolute top-(--s-5) left-(--s-5) z-[1000] flex max-h-[calc(100vh-104px)] w-[350px] flex-col gap-(--s-4) overflow-y-auto rounded-(--r-lg) p-(--s-5)"
  >
    <div>
      <p class="text-fg-subtle font-sans text-[11px] font-medium tracking-[0.06em] uppercase">
        Explorar datos
      </p>
      <h3 class="text-fg mt-1 font-sans text-base font-semibold">Filtros</h3>
    </div>

    <div class="flex flex-col gap-(--s-2)">
      <label class="text-fg-muted font-sans text-xs font-medium">Tipo de inmueble</label>
      <CatalogDropdown v-model="idTipo" :options="tiposOptions" placeholder="Todos" />
    </div>

    <div class="flex flex-col gap-(--s-2)">
      <label class="text-fg-muted font-sans text-xs font-medium">Clase de construcción</label>
      <CatalogDropdown v-model="idClase" :options="clasesOptions" placeholder="Todas" />
    </div>

    <div class="flex flex-col gap-(--s-2)">
      <label class="text-fg-muted font-sans text-xs font-medium">Estado</label>
      <CatalogDropdown v-model="idEntidad" :options="estadosOptions" placeholder="Todos" />
    </div>

    <div class="flex flex-col gap-(--s-2)">
      <label class="text-fg-muted font-sans text-xs font-medium">Banco</label>
      <CatalogDropdown
        v-model="idBanco"
        :options="bancoOptions"
        placeholder="Todos"
        :disabled="bancoOptions.length === 0"
      />
    </div>

    <div class="flex flex-col gap-(--s-2)">
      <label class="text-fg-muted font-sans text-xs font-medium">Grupo</label>
      <CatalogDropdown
        v-model="idGrupo"
        :options="grupoOptions"
        placeholder="Todos"
        :disabled="grupoOptions.length === 0"
      />
    </div>

    <div class="flex flex-col gap-(--s-2)">
      <label class="text-fg-muted font-sans text-xs font-medium">Valor concluido (MXN)</label>
      <div class="flex gap-(--s-2)">
        <input
          v-model.number="valorMin"
          type="number"
          placeholder="Mínimo"
          class="border-border bg-surface-raised font-ui text-fg placeholder:text-fg-subtle focus:border-accent w-0 flex-1 rounded-(--r-md) border px-(--s-3) py-2 text-sm transition-colors outline-none"
        />
        <input
          v-model.number="valorMax"
          type="number"
          placeholder="Máximo"
          class="border-border bg-surface-raised font-ui text-fg placeholder:text-fg-subtle focus:border-accent w-0 flex-1 rounded-(--r-md) border px-(--s-3) py-2 text-sm transition-colors outline-none"
        />
      </div>
    </div>

    <div class="flex gap-(--s-2)">
      <button
        class="bg-accent hover:bg-accent-soft flex-1 rounded-full px-(--s-4) py-2 font-sans text-sm font-semibold text-white transition-colors"
        @click="aplicar"
      >
        Aplicar filtros
      </button>
      <button
        v-if="hayFiltrosActivos"
        class="border-border text-fg-muted hover:border-accent hover:text-fg rounded-full border px-(--s-4) py-2 font-sans text-sm font-medium transition-colors"
        @click="limpiar"
      >
        Limpiar
      </button>
    </div>

    <div class="border-border border-t pt-(--s-3)">
      <p class="font-ui text-fg-subtle text-xs">
        <span class="text-fg font-semibold">
          {{ resultCount.toLocaleString('es-MX') }}
        </span>
        de {{ totalCount.toLocaleString('es-MX') }} avalúos
      </p>
    </div>
  </aside>
</template>
