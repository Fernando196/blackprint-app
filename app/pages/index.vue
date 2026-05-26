<script setup lang="ts">
  import BarChart from '~/components/charts/BarChart.vue'
  import ChartCard from '~/components/charts/ChartCard.vue'
  import ChatBot from '~/components/ui/ChatBot.vue'
  import DonutChart from '~/components/charts/DonutChart.vue'
  import HorizontalBarChart from '~/components/charts/HorizontalBarChart.vue'
  import KpiCard from '~/components/ui/KpiCard.vue'
  import Mapfilter from '~/components/map/Mapfilter.vue'
  import { fmtMXN, fmtN } from '~/helpers/common'
  import type { TipoItem, ClaseItem, BancoItem } from '~/types/metricas'

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
  const porBanco = computed<BancoItem[]>(() => {
    const bancoMap = new Map<string, number>()
    for (const p of puntosFiltrados.value) {
      if (p.banco) bancoMap.set(p.banco, (bancoMap.get(p.banco) ?? 0) + 1)
    }
    return [...bancoMap]
      .map(([banco, count]) => ({ banco, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  })

  function handleChangeExpanded(expanded: boolean) {
    mapaExpandido.value = expanded
  }
</script>

<template>
  <div
    class="flex h-full [scrollbar-width:none] flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden"
  >
    <div class="flex h-[calc(100vh-72px)] shrink-0 overflow-hidden">
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
      <aside
        v-if="!mapaExpandido"
        class="border-border bg-bg flex w-[500px] shrink-0 [scrollbar-width:none] flex-col overflow-y-auto border-r [&::-webkit-scrollbar]:hidden"
      >
        <div class="flex flex-col gap-(--s-5) p-(--s-6)">
          <div class="flex items-center gap-2">
            <h1 class="text-xl! font-bold">Dashboard -</h1>
            <p>México - Septiembre 2024</p>
          </div>

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
            <HorizontalBarChart :items="porBanco" />
          </ChartCard>
        </div>
      </aside>
    </div>
    <ChatBot />
  </div>
</template>
