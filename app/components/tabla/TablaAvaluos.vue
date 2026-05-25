<script setup lang="ts">
  import type { TablaRow } from '~/types/tabla'

  defineProps<{
    rows: TablaRow[]
    isLoading: boolean
  }>()

  const { getEstado } = useCatalog()

  const fmtMXN = (n: number) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(n)

  const fmtN = (n?: number) =>
    n !== undefined ? n.toLocaleString('es-MX') : '—'

  function fmtFecha(f?: string): string {
    if (!f) return '—'
    try {
      return new Date(f).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    } catch {
      return '—'
    }
  }

  function resolveEstado(entidad: string): string {
    const id = Number(entidad)
    return (!Number.isNaN(id) && getEstado(id)?.nombre) || entidad
  }

  const COLS = [
    'Colonia',
    'Municipio',
    'Estado',
    'Tipo',
    'Clase',
    'Conservación',
    'Sup. Construida',
    'Valor Concluido',
    'Valor m²',
    'Banco',
    'Fecha',
  ]
</script>

<template>
  <div class="h-full overflow-auto">
    <table class="w-full border-collapse text-sm">
      <thead class="sticky top-0 z-10">
        <tr>
          <th
            v-for="col in COLS"
            :key="col"
            class="border-b border-[var(--depth-7)] bg-[var(--depth-9)] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--depth-5)] whitespace-nowrap"
          >
            {{ col }}
          </th>
        </tr>
      </thead>

      <tbody>
        <!-- Skeleton loader -->
        <template v-if="isLoading">
          <tr v-for="i in 15" :key="`sk-${i}`">
            <td
              v-for="j in COLS.length"
              :key="j"
              class="border-b border-[var(--depth-7)] px-4 py-3"
              :class="i % 2 === 0 ? 'bg-[var(--depth-8)]' : 'bg-[var(--depth-9)]'"
            >
              <div class="h-3 animate-pulse rounded bg-[var(--depth-7)]" />
            </td>
          </tr>
        </template>

        <!-- Data rows -->
        <template v-else>
          <tr
            v-for="(row, i) in rows"
            :key="row.id ?? i"
            class="border-b border-[var(--depth-7)] transition-colors hover:bg-[var(--depth-7)]"
            :class="i % 2 === 0 ? 'bg-[var(--depth-9)]' : 'bg-[var(--depth-8)]'"
          >
            <td class="px-4 py-3 text-[var(--on-primary)]">{{ row.colonia || '—' }}</td>
            <td class="px-4 py-3 text-[var(--on-primary)]">{{ row.municipio || '—' }}</td>
            <td class="px-4 py-3 text-[var(--on-primary)] whitespace-nowrap">
              {{ resolveEstado(row.entidad) }}
            </td>
            <td class="px-4 py-3 text-[var(--depth-3)] whitespace-nowrap">{{ row.tipo }}</td>
            <td class="px-4 py-3 text-[var(--depth-3)] whitespace-nowrap">{{ row.clase }}</td>
            <td class="px-4 py-3 text-[var(--depth-3)]">{{ row.conservacion || '—' }}</td>
            <td class="px-4 py-3 font-ui text-right text-[var(--depth-3)]">
              {{ row.supConstruida !== undefined ? `${fmtN(row.supConstruida)} m²` : '—' }}
            </td>
            <td class="px-4 py-3 font-ui text-right font-semibold text-[var(--on-primary)] whitespace-nowrap">
              {{ fmtMXN(row.valorConcluido) }}
            </td>
            <td class="px-4 py-3 font-ui text-right text-[var(--depth-3)] whitespace-nowrap">
              {{ fmtMXN(row.valorM2) }}
            </td>
            <td class="px-4 py-3 text-[var(--depth-3)]">{{ row.banco || '—' }}</td>
            <td class="px-4 py-3 font-ui text-[var(--depth-5)] whitespace-nowrap">
              {{ fmtFecha(row.fechaAvaluo) }}
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-if="rows.length === 0">
            <td
              :colspan="COLS.length"
              class="bg-[var(--depth-9)] px-4 py-16 text-center text-sm text-[var(--depth-5)]"
            >
              Sin resultados para los filtros aplicados.
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
