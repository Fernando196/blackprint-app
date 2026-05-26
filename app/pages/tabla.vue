<script setup lang="ts">
  import TablaAvaluos from '~/components/tabla/TablaAvaluos.vue'
  import PaginacionTabla from '~/components/tabla/PaginacionTabla.vue'

  const { rows, total, isLoading, hasError, pagina, limite, aplicarFiltros, cambiarPagina } =
    useTabla()
  const filterStore = useFilterStore()

  watch(
    () => filterStore.filters,
    (f) => {
      aplicarFiltros({
        tipo: f.tipo ? f.tipo : '',
        clase: f.clase ? f.clase : '',
        entidad: f.entidad ?? '',
        valorMin: f.valorMin,
        valorMax: f.valorMax,
        banco: f.banco ?? '',
        grupo: f.grupo ?? '',
      })
    },
    { deep: true, immediate: true }
  )
</script>

<template>
  <div class="flex h-[calc(100vh-72px)] flex-col">
    <div
      class="flex shrink-0 items-center justify-between border-b border-[var(--depth-7)] bg-[var(--depth-9)] px-(--s-6) py-(--s-3)"
    >
      <div>
        <p
          class="font-sans text-[11px] font-medium tracking-[0.06em] text-[var(--depth-5)] uppercase"
        >
          Inteligencia Inmobiliaria
        </p>
        <h2 class="mt-0.5 font-sans text-base font-semibold text-[var(--on-primary)]">
          Avalúos Hipotecarios
        </h2>
      </div>
      <p class="font-ui text-xs text-[var(--depth-5)]">
        <span class="font-semibold text-[var(--on-primary)]">
          {{ total.toLocaleString('es-MX') }}
        </span>
        &nbsp;resultados encontrados
      </p>
    </div>

    <div v-if="hasError" class="flex flex-1 items-center justify-center bg-[var(--depth-9)]">
      <p class="font-sans text-sm text-[var(--depth-5)]">Error al cargar los datos.</p>
    </div>

    <template v-else>
      <TablaAvaluos :rows="rows" :is-loading="isLoading" class="flex-1 overflow-hidden" />
      <PaginacionTabla
        :pagina="pagina"
        :limite="limite"
        :total="total"
        @cambiar-pagina="cambiarPagina"
        @cambiar-limite="(n) => (limite.value = n)"
      />
    </template>
  </div>
</template>
