<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import type { ClaseItem } from '~/composables/useMetricas'

const PALETTE = ['#0875E3', '#FE2B7C', '#52BCF5', '#FF9E9E', '#646669', '#8D9398']
const fmtN = (n: number) => new Intl.NumberFormat('es-MX').format(n)

const props = defineProps<{ items: ClaseItem[] }>()

const vertLabelPlugin = {
  id: 'vertLabels',
  afterDatasetsDraw(chart: any) {
    const { ctx } = chart
    chart.data.datasets.forEach((_: any, i: number) => {
      const meta = chart.getDatasetMeta(i)
      if (meta.hidden) return
      meta.data.forEach((bar: any, idx: number) => {
        const raw = chart.data.datasets[i].data[idx] as number
        ctx.save()
        ctx.fillStyle = '#B7BCC0'
        ctx.font = '600 11px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        ctx.fillText(fmtN(raw), bar.x, bar.y - 4)
        ctx.restore()
      })
    })
  },
}

const chartData = computed(() => ({
  labels: props.items.map((c) => c.clase),
  datasets: [
    {
      label: 'Avalúos',
      data: props.items.map((c) => c.count),
      backgroundColor: PALETTE,
      borderRadius: 6,
      borderSkipped: false as const,
    },
  ],
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 24 } },
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
        label: (ctx: { parsed: { y: number } }) =>
          ` ${ctx.parsed.y.toLocaleString('es-MX')} avalúos`,
      },
    },
  },
  scales: {
    x: {
      border: { display: false },
      grid: { display: false },
      ticks: {
        color: '#8D9398',
        font: { family: 'Inter, sans-serif', size: 11 },
        maxRotation: 40,
        minRotation: 0,
      },
    },
    y: {
      border: { display: false },
      grid: { color: '#383838', drawTicks: false },
      ticks: {
        color: '#8D9398',
        font: { family: 'Inter, sans-serif', size: 11 },
        padding: 8,
        callback: (value: unknown) => Number(value).toLocaleString('es-MX'),
      },
    },
  },
}
</script>

<template>
  <div class="relative h-[300px]">
    <ClientOnly>
      <Bar :data="chartData" :options="options" :plugins="[vertLabelPlugin]" />
    </ClientOnly>
  </div>
</template>
