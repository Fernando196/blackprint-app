<script setup lang="ts">
import type { PorEstado } from '~/types/por_estado.type'

const props = defineProps<{ items: PorEstado[] }>()

const { getEstado } = useCatalog()

const fmtMXN = (n: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(n)

const fmtN = (n: number) => n.toLocaleString('es-MX')

const top10 = computed(() =>
  [...props.items].sort((a, b) => b.valorPromedio - a.valorPromedio).slice(0, 10)
)

const nombreEstado = (item: PorEstado) =>
  getEstado(Number(item.entidad))?.nombre || item.nombreEntidad || item.entidad
</script>

<template>
  <div class="rounded-(--r-lg) bg-surface p-(--s-6) shadow-4">
    <p class="text-fg-subtle mb-5 font-sans text-[11px] font-medium tracking-[0.06em] uppercase">
      Top 10 estados · Valor promedio
    </p>

    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th
            class="text-fg-subtle border-[var(--depth-7)] w-8 border-b pb-2 text-left font-sans text-[10px] font-semibold tracking-[0.08em] uppercase"
          >
            #
          </th>
          <th
            class="text-fg-subtle border-[var(--depth-7)] border-b pb-2 text-left font-sans text-[10px] font-semibold tracking-[0.08em] uppercase"
          >
            Estado
          </th>
          <th
            class="text-fg-subtle border-[var(--depth-7)] border-b pb-2 text-right font-sans text-[10px] font-semibold tracking-[0.08em] uppercase"
          >
            Avalúos
          </th>
          <th
            class="text-fg-subtle border-[var(--depth-7)] border-b pb-2 text-right font-sans text-[10px] font-semibold tracking-[0.08em] uppercase"
          >
            Prom.
          </th>
          <th
            class="text-fg-subtle border-[var(--depth-7)] border-b pb-2 text-right font-sans text-[10px] font-semibold tracking-[0.08em] uppercase"
          >
            Mediana
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, idx) in top10"
          :key="item.entidad"
          class="border-[var(--depth-8)] border-b last:border-0"
        >
          <td class="py-2.5 font-mono text-xs">
            <span
              :class="idx < 3 ? 'text-[var(--blue-p)]' : 'text-fg-subtle'"
              class="font-semibold"
            >
              {{ idx + 1 }}
            </span>
          </td>
          <td class="text-fg py-2.5 font-sans text-sm font-medium">
            {{ nombreEstado(item) }}
          </td>
          <td class="text-fg-muted py-2.5 text-right font-mono text-xs">
            {{ fmtN(item.count) }}
          </td>
          <td class="py-2.5 text-right font-mono text-xs font-semibold text-[var(--blue-p)]">
            {{ fmtMXN(item.valorPromedio) }}
          </td>
          <td class="text-fg py-2.5 text-right font-mono text-xs">
            {{ fmtMXN(item.valorMediano) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
