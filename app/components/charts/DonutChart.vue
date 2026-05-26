<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import type { TipoItem } from '~/composables/useMetricas'

const PALETTE = ['#0875E3', '#FE2B7C', '#52BCF5', '#FF9E9E', '#646669', '#8D9398']

const props = defineProps<{ items: TipoItem[] }>()

const chartData = computed(() => ({
  labels: props.items.map((t) => t.tipo),
  datasets: [
    {
      data: props.items.map((t) => t.count),
      backgroundColor: PALETTE,
      borderWidth: 0,
      hoverOffset: 6,
    },
  ],
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: '#B7BCC0',
        font: { family: 'Inter, sans-serif', size: 12 },
        padding: 14,
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 8,
        boxHeight: 8,
      },
    },
    tooltip: {
      backgroundColor: '#383838',
      titleColor: '#ffffff',
      bodyColor: '#B7BCC0',
      borderColor: '#484848',
      borderWidth: 1,
      padding: 10,
      callbacks: {
        label: (ctx: { parsed: number; dataset: { data: number[] } }) => {
          const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
          const pct = ((ctx.parsed / total) * 100).toFixed(1)
          return ` ${ctx.parsed.toLocaleString('es-MX')} avalúos (${pct}%)`
        },
      },
    },
  },
}
</script>

<template>
  <div class="relative h-[300px]">
    <ClientOnly>
      <Doughnut :data="chartData" :options="options" />
    </ClientOnly>
  </div>
</template>
