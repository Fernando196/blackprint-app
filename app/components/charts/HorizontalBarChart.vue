<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import type { BancoItem } from '~/composables/useMetricas'

const fmtN = (n: number) => new Intl.NumberFormat('es-MX').format(n)

const props = defineProps<{ items: BancoItem[] }>()

const horizLabelPlugin = {
  id: 'horizLabels',
  afterDatasetsDraw(chart: any) {
    const { ctx } = chart
    chart.data.datasets.forEach((_: any, i: number) => {
      const meta = chart.getDatasetMeta(i)
      if (meta.hidden) return
      meta.data.forEach((bar: any, idx: number) => {
        const raw = chart.data.datasets[i].data[idx] as number
        ctx.save()
        ctx.fillStyle = '#8D9398'
        ctx.font = '11px Inter, sans-serif'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText(fmtN(raw), bar.x + 6, bar.y)
        ctx.restore()
      })
    })
  },
}

const chartData = computed(() => ({
  labels: props.items.map((b) => b.banco),
  datasets: [
    {
      label: 'Avalúos',
      data: props.items.map((b) => b.count),
      backgroundColor: props.items.map((_, i) => (i === 0 ? '#0875E3' : i < 3 ? '#52BCF5' : '#484848')),
      barThickness: 26,
      borderRadius: 4,
      borderSkipped: false as const,
    },
  ],
}))

const options = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { right: 72 } },
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
        callback: (value: unknown) => Number(value).toLocaleString('es-MX'),
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
  <div class="relative h-[380px]">
    <ClientOnly>
      <Bar :data="chartData" :options="options" :plugins="[horizLabelPlugin]" />
    </ClientOnly>
  </div>
</template>
