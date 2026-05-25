<script setup lang="ts">
  import FiltrosTabla from '~/components/tabla/FiltrosTabla.vue'
  import TablaAvaluos from '~/components/tabla/TablaAvaluos.vue'
  import PaginacionTabla from '~/components/tabla/PaginacionTabla.vue'
  import type { TablaFiltros } from '~/types/tabla'

  const { rows, total, isLoading, hasError, pagina, limite, aplicarFiltros, cambiarPagina, limpiarFiltros } = useTabla()

  function onFiltrosAplicados(filtros: TablaFiltros): void {
    aplicarFiltros(filtros)
  }

  function onLimpiar(): void {
    limpiarFiltros()
  }

  function onCambiarPagina(n: number): void {
    cambiarPagina(n)
  }

  function onCambiarLimite(n: number): void {
    limite.value = n
  }
</script>

<template>
  <div class="flex h-[calc(100vh-72px)] flex-col">
    <FiltrosTabla @filtros-aplicados="onFiltrosAplicados" @limpiar="onLimpiar" />

    <div class="flex shrink-0 items-center justify-between border-b border-[var(--depth-7)] bg-[var(--depth-9)] px-(--s-6) py-(--s-3)">
      <div>
        <p class="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--depth-5)]">
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

    <div
      v-if="hasError"
      class="flex flex-1 items-center justify-center bg-[var(--depth-9)]"
    >
      <p class="font-sans text-sm text-[var(--depth-5)]">Error al cargar los datos.</p>
    </div>

    <template v-else>
      <TablaAvaluos :rows="rows" :is-loading="isLoading" class="flex-1 overflow-hidden" />
      <PaginacionTabla
        :pagina="pagina"
        :limite="limite"
        :total="total"
        @cambiar-pagina="onCambiarPagina"
        @cambiar-limite="onCambiarLimite"
      />
    </template>
  </div>
</template>
