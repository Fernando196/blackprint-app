<script setup lang="ts">
  import type { MapFilters } from '~/types/mapa'

  defineProps<{
    resultCount: number
    totalCount: number
  }>()

  const emit = defineEmits<{
    apply: [filters: MapFilters]
    clear: []
  }>()

  const { tipos, clases, entidades } = useFiltros()

  const filtros = ref<MapFilters>({
    tipo: '',
    clase: '',
    entidad: '',
    valorMin: null,
    valorMax: null,
  })

  function aplicar(): void {
    emit('apply', { ...filtros.value })
  }

  function limpiar(): void {
    filtros.value = { tipo: '', clase: '', entidad: '', valorMin: null, valorMax: null }
    emit('clear')
  }

  const hayFiltrosActivos = computed(
    () =>
      filtros.value.tipo ||
      filtros.value.clase ||
      filtros.value.entidad ||
      filtros.value.valorMin !== null ||
      filtros.value.valorMax !== null,
  )
</script>

<template>
  <aside
    class="absolute left-(--s-5) top-(--s-5) z-[1000] flex max-h-[calc(100vh-104px)] w-[350px] flex-col gap-(--s-4) overflow-y-auto rounded-(--r-lg) bg-surface p-(--s-5) shadow-4"
  >
    <!-- Header -->
    <div>
      <p class="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-fg-subtle">
        Explorar datos
      </p>
      <h3 class="font-sans mt-1 text-base font-semibold text-fg">Filtros</h3>
    </div>

    <!-- Tipo de inmueble -->
    <div class="flex flex-col gap-(--s-2)">
      <label class="font-sans text-xs font-medium text-fg-muted">Tipo de inmueble</label>
      <div class="relative">
        <select
          v-model="filtros.tipo"
          class="w-full appearance-none rounded-(--r-md) border border-border bg-surface-raised px-(--s-3) py-2 font-sans text-sm text-fg outline-none transition-colors focus:border-accent"
        >
          <option value="">Todos</option>
          <option v-for="t in tipos" :key="t" :value="t">{{ t }}</option>
        </select>
        <span class="pointer-events-none absolute right-(--s-3) top-1/2 -translate-y-1/2">
          <img src="/icons/dropdown.svg" class="h-4 w-4 invert opacity-50" alt="" />
        </span>
      </div>
    </div>

    <!-- Clase de construcción -->
    <div class="flex flex-col gap-(--s-2)">
      <label class="font-sans text-xs font-medium text-fg-muted">Clase de construcción</label>
      <div class="relative">
        <select
          v-model="filtros.clase"
          class="w-full appearance-none rounded-(--r-md) border border-border bg-surface-raised px-(--s-3) py-2 font-sans text-sm text-fg outline-none transition-colors focus:border-accent"
        >
          <option value="">Todas</option>
          <option v-for="c in clases" :key="c" :value="c">{{ c }}</option>
        </select>
        <span class="pointer-events-none absolute right-(--s-3) top-1/2 -translate-y-1/2">
          <img src="/icons/dropdown.svg" class="h-4 w-4 invert opacity-50" alt="" />
        </span>
      </div>
    </div>

    <!-- Entidad -->
    <div class="flex flex-col gap-(--s-2)">
      <label class="font-sans text-xs font-medium text-fg-muted">Estado</label>
      <div class="relative">
        <select
          v-model="filtros.entidad"
          class="w-full appearance-none rounded-(--r-md) border border-border bg-surface-raised px-(--s-3) py-2 font-sans text-sm text-fg outline-none transition-colors focus:border-accent"
        >
          <option value="">Todos</option>
          <option v-for="e in entidades" :key="e" :value="e">{{ e }}</option>
        </select>
        <span class="pointer-events-none absolute right-(--s-3) top-1/2 -translate-y-1/2">
          <img src="/icons/dropdown.svg" class="h-4 w-4 invert opacity-50" alt="" />
        </span>
      </div>
    </div>

    <!-- Rango de valor -->
    <div class="flex flex-col gap-(--s-2)">
      <label class="font-sans text-xs font-medium text-fg-muted">Valor concluido (MXN)</label>
      <div class="flex gap-(--s-2)">
        <input
          v-model.number="filtros.valorMin"
          type="number"
          placeholder="Mínimo"
          class="w-0 flex-1 rounded-(--r-md) border border-border bg-surface-raised px-(--s-3) py-2 font-ui text-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-accent"
        />
        <input
          v-model.number="filtros.valorMax"
          type="number"
          placeholder="Máximo"
          class="w-0 flex-1 rounded-(--r-md) border border-border bg-surface-raised px-(--s-3) py-2 font-ui text-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-accent"
        />
      </div>
    </div>

    <!-- Botones -->
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

    <!-- Contador de resultados -->
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
