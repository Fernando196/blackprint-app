<script setup lang="ts">
  import BarChart from '~/components/charts/BarChart.vue'
  import ChartCard from '~/components/charts/ChartCard.vue'
  import DonutChart from '~/components/charts/DonutChart.vue'
  import HorizontalBarChart from '~/components/charts/HorizontalBarChart.vue'
  import FilterBar from '~/components/ui/FilterBar.vue'
  import KpiCard from '~/components/ui/KpiCard.vue'
  import PageHeader from '~/components/ui/PageHeader.vue'
  import Mapfilter from '~/components/map/Mapfilter.vue'
  import { fmtMXN, fmtN } from '~/helpers/common'
  import type { TipoItem, ClaseItem } from '~/types/metricas'

  const MAX_VISIBLE = 5000

  const { points, isLoading, hasError, puntosFiltrados } = useMapa()
  const { getTipoInmueble, getClaseConstruccion } = useCatalog()

  const mapaExpandido = ref(false)

  const puntosVisibles = computed(() => puntosFiltrados.value.slice(0, MAX_VISIBLE))

  const metricasFiltradas = computed(() => {
    const pts = puntosFiltrados.value
    if (!pts.length) {
      return {
        total: 0,
        valorPromedio: 0,
        valorMediano: 0,
        m2Promedio: 0,
        porTipo: [] as TipoItem[],
        porClase: [] as ClaseItem[],
      }
    }

    const valores = pts.map((p) => p.valorConcluido).sort((a, b) => a - b)
    const n = pts.length
    const sum = valores.reduce((a, b) => a + b, 0)
    const mid = Math.floor(n / 2)
    const med =
      n % 2 === 0 ? ((valores[mid - 1] ?? 0) + (valores[mid] ?? 0)) / 2 : (valores[mid] ?? 0)

    const tipoMap = new Map<string, number>()
    const claseMap = new Map<string, number>()
    for (const p of pts) {
      tipoMap.set(p.tipo, (tipoMap.get(p.tipo) ?? 0) + 1)
      claseMap.set(p.clase, (claseMap.get(p.clase) ?? 0) + 1)
    }

    return {
      total: n,
      valorPromedio: sum / n,
      valorMediano: med,
      m2Promedio: pts.reduce((a, p) => a + p.valorM2, 0) / n,
      porTipo: [...tipoMap]
        .map(([id, count]) => ({ tipo: getTipoInmueble(id) || id, count }))
        .sort((a, b) => b.count - a.count) as TipoItem[],
      porClase: [...claseMap]
        .map(([id, count]) => ({ clase: getClaseConstruccion(id) || id, count }))
        .sort((a, b) => b.count - a.count) as ClaseItem[],
    }
  })

  const kpis = computed(() => [
    { label: 'Total de avalúos', value: fmtN(metricasFiltradas.value.total), unit: 'registros' },
    { label: 'Valor promedio', value: fmtMXN(metricasFiltradas.value.valorPromedio) },
    { label: 'Valor mediano', value: fmtMXN(metricasFiltradas.value.valorMediano) },
    { label: 'Promedio por m²', value: fmtMXN(metricasFiltradas.value.m2Promedio), unit: '/ m²' },
  ])
  function handleChangeExpanded(expanded: boolean) {
    mapaExpandido.value = expanded
  }
</script>

<template>
  <div class="flex h-[calc(100vh-72px)] flex-col">
    <div class="flex flex-1 overflow-hidden">
      <aside
        v-if="!mapaExpandido"
        class="border-border bg-bg flex w-1/3 shrink-0 [scrollbar-width:none] flex-col overflow-y-auto border-r [&::-webkit-scrollbar]:hidden"
      >
        <div class="flex flex-col gap-(--s-5) p-(--s-6)">
          <PageHeader
            eyebrow="Inteligencia Inmobiliaria"
            title="Dashboard"
            subtitle="México · Septiembre 2024"
          />

          <div class="grid grid-cols-2 gap-(--s-3)">
            <KpiCard
              v-for="kpi in kpis"
              :key="kpi.label"
              :label="kpi.label"
              :value="kpi.value"
              :unit="kpi.unit"
            />
          </div>

          <ChartCard title="Por tipo de inmueble">
            <DonutChart :items="metricasFiltradas.porTipo" />
          </ChartCard>

          <ChartCard title="Por clase de construcción">
            <BarChart :items="metricasFiltradas.porClase" />
          </ChartCard>

          <ChartCard title="Top 10 instituciones">
            <!-- <HorizontalBarChart :items="porBanco" /> -->
          </ChartCard>
        </div>
      </aside>

      <div class="relative flex-1">
        <Mapfilter
          :points="puntosVisibles"
          :filter-points="puntosFiltrados"
          :is-loading="isLoading"
          :has-error="hasError"
          :show-expanded="true"
          @on-change-expanded="handleChangeExpanded"
        />
      </div>
    </div>
  </div>
</template>
