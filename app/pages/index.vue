<script setup lang="ts">
  import BarChart from '~/components/charts/BarChart.vue'
  import ChartCard from '~/components/charts/ChartCard.vue'
  import DonutChart from '~/components/charts/DonutChart.vue'
  import HorizontalBarChart from '~/components/charts/HorizontalBarChart.vue'
  import KpiCard from '~/components/ui/KpiCard.vue'
  import PageHeader from '~/components/ui/PageHeader.vue'

  const { kpis, porTipo, porClase, porBanco } = useMetricas()
</script>

<template>
  <div class="mx-auto max-w-360 px-(--s-7) py-10">
    <PageHeader
      eyebrow="Inteligencia Inmobiliaria"
      title="Dashboard"
      subtitle="México · Septiembre 2024"
    />

    <div class="mb-(--s-4) grid grid-cols-4 gap-(--s-4)">
      <KpiCard
        v-for="kpi in kpis"
        :key="kpi.label"
        :label="kpi.label"
        :value="kpi.value"
        :unit="kpi.unit"
      />
    </div>

    <div class="mb-(--s-4) grid grid-cols-2 gap-(--s-4)">
      <ChartCard title="Por tipo de inmueble">
        <DonutChart :items="porTipo" />
      </ChartCard>
      <ChartCard title="Por clase de construcción">
        <BarChart :items="porClase" />
      </ChartCard>
    </div>

    <ChartCard title="Top 10 instituciones por número de avalúos">
      <HorizontalBarChart :items="porBanco" />
    </ChartCard>
  </div>
</template>
