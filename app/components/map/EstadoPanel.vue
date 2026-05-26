<script setup lang="ts">
  import type { PorEstado } from '~/types/por_estado.type'

  const props = defineProps<{
    nombre: string
    estadoData: PorEstado | null
    porTipo: { tipo: string; count: number }[]
  }>()

  const emit = defineEmits<{ cerrar: [] }>()

  const fmtMXN = (n: number) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(n)

  const totalTipo = computed(() => props.porTipo.reduce((a, b) => a + b.count, 0))

  function pct(count: number): string {
    if (!totalTipo.value) return '0%'
    return ((count / totalTipo.value) * 100).toFixed(1) + '%'
  }
</script>

<template>
  <aside
    class="bg-surface absolute top-(--s-5) right-(--s-5) z-2000 flex w-[320px] flex-col gap-(--s-4) rounded-(--r-lg) p-(--s-5) shadow-[var(--shadow-4)]"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-(--s-3)">
      <div>
        <p class="text-fg-subtle font-sans text-[11px] font-medium tracking-[0.06em] uppercase">
          Estado
        </p>
        <h3 class="text-fg mt-0.5 font-sans text-base font-semibold">{{ nombre }}</h3>
      </div>
      <button
        class="text-fg-muted hover:text-fg mt-0.5 shrink-0 rounded-full p-1 transition-colors"
        @click="emit('cerrar')"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M12 4L4 12M4 4l8 8"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>

    <!-- Skeleton loading -->
    <template v-if="!estadoData">
      <div class="grid grid-cols-3 gap-(--s-2)">
        <div
          v-for="i in 3"
          :key="i"
          class="h-14 animate-pulse rounded-(--r-md) bg-[var(--depth-8)]"
        />
      </div>
      <div class="flex flex-col gap-(--s-2)">
        <div class="h-3 w-24 animate-pulse rounded-full bg-[var(--depth-8)]" />
        <div v-for="i in 4" :key="i" class="h-6 animate-pulse rounded bg-[var(--depth-8)]" />
      </div>
    </template>

    <!-- KPIs -->
    <template v-else>
      <div class="grid grid-cols-3 gap-(--s-2)">
        <div class="flex flex-col gap-0.5 rounded-(--r-md) bg-[var(--depth-8)] p-(--s-3)">
          <span
            class="text-fg-subtle font-sans text-[10px] font-medium tracking-[0.06em] uppercase"
          >
            Avalúos
          </span>
          <span class="text-fg font-mono text-sm font-semibold">
            {{ estadoData.count.toLocaleString('es-MX') }}
          </span>
        </div>
        <div class="flex flex-col gap-0.5 rounded-(--r-md) bg-[var(--depth-8)] p-(--s-3)">
          <span
            class="text-fg-subtle font-sans text-[10px] font-medium tracking-[0.06em] uppercase"
          >
            Promedio
          </span>
          <span class="font-mono text-xs font-semibold text-[var(--blue-p)]">
            {{ fmtMXN(estadoData.valorPromedio) }}
          </span>
        </div>
        <div class="flex flex-col gap-0.5 rounded-(--r-md) bg-[var(--depth-8)] p-(--s-3)">
          <span
            class="text-fg-subtle font-sans text-[10px] font-medium tracking-[0.06em] uppercase"
          >
            Mediano
          </span>
          <span class="text-fg font-mono text-xs font-semibold">
            {{ fmtMXN(estadoData.valorMediano) }}
          </span>
        </div>
      </div>

      <!-- Por tipo -->
      <div class="flex flex-col gap-(--s-2)">
        <p class="text-fg-subtle font-sans text-[11px] font-medium tracking-[0.06em] uppercase">
          Por tipo de inmueble
        </p>
        <ul class="flex flex-col gap-(--s-2)">
          <li v-for="item in porTipo" :key="item.tipo" class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <span class="text-fg-muted font-sans text-xs">{{ item.tipo }}</span>
              <span class="text-fg font-mono text-xs font-medium">{{ pct(item.count) }}</span>
            </div>
            <div class="h-1 w-full overflow-hidden rounded-full bg-[var(--depth-7)]">
              <div
                class="h-full rounded-full bg-[var(--blue-p)]"
                :style="{ width: pct(item.count) }"
              />
            </div>
          </li>
        </ul>
      </div>
    </template>
  </aside>
</template>
