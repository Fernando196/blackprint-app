<script setup lang="ts">
  import CatalogDropdown from '~/components/ui/CatalogDropdown.vue'
  import type { DropdownOption } from '~/types/filters'

  const props = defineProps<{
    pagina: number
    limite: number
    total: number
  }>()

  const emit = defineEmits<{
    cambiarPagina: [n: number]
    cambiarLimite: [n: number]
  }>()

  const totalPaginas = computed(() => Math.max(1, Math.ceil(props.total / props.limite)))
  const desde = computed(() => (props.total === 0 ? 0 : (props.pagina - 1) * props.limite + 1))
  const hasta = computed(() => Math.min(props.pagina * props.limite, props.total))

  const puedeAnterior = computed(() => props.pagina > 1)
  const puedeSiguiente = computed(() => props.pagina < totalPaginas.value)

  const LIMITE_OPTIONS: DropdownOption[] = [
    { label: '25', value: '25' },
    { label: '50', value: '50' },
    { label: '100', value: '100' },
  ]

  const localLimite = ref<string | null>(String(props.limite))

  watch(
    () => props.limite,
    (v) => {
      localLimite.value = String(v)
    }
  )

  watch(localLimite, (val) => {
    const num = val !== null ? Number(val) : null
    if (num !== null && num !== props.limite) emit('cambiarLimite', num)
  })
</script>

<template>
  <div
    class="flex shrink-0 items-center justify-between gap-(--s-4) border-t border-[var(--depth-7)] bg-[var(--depth-9)] px-(--s-6) py-(--s-3)"
  >
    <!-- Contador de resultados -->
    <p class="font-ui shrink-0 text-xs text-[var(--depth-5)]">
      <template v-if="total === 0">Sin resultados</template>
      <template v-else>
        <span class="font-semibold text-[var(--on-primary)]">
          {{ desde.toLocaleString('es-MX') }} – {{ hasta.toLocaleString('es-MX') }}
        </span>
        &nbsp;de {{ total.toLocaleString('es-MX') }} resultados
      </template>
    </p>

    <!-- Navegación central -->
    <div class="flex shrink-0 items-center gap-(--s-2)">
      <button
        class="rounded-full border border-[var(--depth-7)] px-(--s-4) py-[5px] font-sans text-sm font-medium transition-colors"
        :class="
          puedeAnterior
            ? 'bg-[var(--depth-8)] text-[var(--on-primary)] hover:bg-[var(--depth-7)]'
            : 'cursor-not-allowed bg-[var(--depth-9)] text-[var(--depth-6)] opacity-40'
        "
        :disabled="!puedeAnterior"
        @click="puedeAnterior && emit('cambiarPagina', pagina - 1)"
      >
        Anterior
      </button>

      <span class="font-ui px-(--s-3) text-xs text-[var(--depth-5)]">
        <span class="text-[var(--on-primary)]">{{ pagina }}</span>
        &nbsp;/&nbsp;{{ totalPaginas.toLocaleString('es-MX') }}
      </span>

      <button
        class="rounded-full border border-[var(--depth-7)] px-(--s-4) py-[5px] font-sans text-sm font-medium transition-colors"
        :class="
          puedeSiguiente
            ? 'bg-[var(--depth-8)] text-[var(--on-primary)] hover:bg-[var(--depth-7)]'
            : 'cursor-not-allowed bg-[var(--depth-9)] text-[var(--depth-6)] opacity-40'
        "
        :disabled="!puedeSiguiente"
        @click="puedeSiguiente && emit('cambiarPagina', pagina + 1)"
      >
        Siguiente
      </button>
    </div>

    <!-- Registros por página -->
    <div class="flex shrink-0 items-center gap-(--s-2)">
      <span class="font-sans text-xs text-[var(--depth-5)]">Por página</span>
      <CatalogDropdown
        v-model="localLimite"
        :options="LIMITE_OPTIONS"
        placeholder="50"
        class="w-[90px]"
      />
    </div>
  </div>
</template>
