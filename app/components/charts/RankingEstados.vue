<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import type { PorEstado } from '~/types/por_estado.type'

const props = defineProps<{ items: PorEstado[] }>()

const { getEstado } = useCatalog()

const fmtMXN = (n: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(n)

const top15 = computed(() =>
  [...props.items].sort((a, b) => b.count - a.count).slice(0, 15)
)

const nombreEstado = (item: PorEstado) =>
  getEstado(Number(item.entidad))?.nombre || item.nombreEntidad || item.entidad

const promedioPlugin = {
  id: 'promedioLabels',
  afterDatasetsDraw(chart: any) {
    const { ctx } = chart
    chart.data.datasets.forEach((_: any, i: number) => {
      const meta = chart.getDatasetMeta(i)
      if (meta.hidden) return
      meta.data.forEach((bar: any, idx: number) => {
        const item = top15.value[idx]
        if (!item) return
        ctx.save()
        ctx.fillStyle = '#8D9398'
        ctx.font = '11px Inter, sans-serif'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText(fmtMXN(item.valorPromedio), bar.x + 6, bar.y)
        ctx.restore()
      })
    })
  },
}

const chartData = computed(() => ({
  labels: top15.value.map(nombreEstado),
  datasets: [
    {
      label: 'Avalúos',
      data: top15.value.map((e) => e.count),
      backgroundColor: top15.value.map((_, i) =>
        i === 0 ? '#0875E3' : i < 3 ? '#52BCF5' : '#484848'
      ),
      barThickness: 18,
      borderRadius: 4,
      borderSkipped: false as const,
    },
  ],
}))

const options = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { right: 120 } },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#383838',
      titleColor: '#ffffff',
      bodyColor: '#B7BCC0',
      borderColor: '#484848',
      borderWidth: 1,
      padding: 10,
      callbacks: {
        label: (ctx: { parsed: { x: number } }) =>
          ` ${ctx.parsed.x.toLocaleString('es-MX')} avalúos`,
      },
    },
  },
  scales: {
    x: {
      border: { display: false },
      grid: { color: '#383838', drawTicks: false },
      ticks: {
        color: '#8D9398',
        font: { family: 'Inter, sans-serif', size: 11 },
        padding: 8,
        callback: (v: unknown) => Number(v).toLocaleString('es-MX'),
      },
    },
    y: {
      border: { display: false },
      grid: { display: false },
      ticks: {
        color: '#B7BCC0',
        font: { family: 'Inter, sans-serif', size: 12 },
        padding: 10,
      },
    },
  },
}
</script>

<template>
  <div class="relative h-[460px]">
    <ClientOnly>
      <Bar :data="chartData" :options="options" :plugins="[promedioPlugin]" />
    </ClientOnly>
  </div>
</template>
