<script setup lang="ts">
  import type { DropdownOption } from '~/types/filters'

  const model = defineModel<number | null>({ default: null })

  withDefaults(
    defineProps<{
      options: DropdownOption[]
      placeholder?: string
      disabled?: boolean
    }>(),
    { placeholder: 'Todos' },
  )

  const selected = computed({
    get: () => model.value?.toString() ?? '',
    set: (v: string) => {
      model.value = v === '' ? null : Number(v)
    },
  })
</script>

<template>
  <div class="relative">
    <select
      v-model="selected"
      :disabled="disabled"
      class="w-full cursor-pointer appearance-none rounded-[var(--r-pill)] border py-[5px] pl-[var(--s-3)] pr-7 font-sans text-sm text-[var(--on-primary)] outline-none transition-colors focus:ring-2 focus:ring-[var(--blue-p)]"
      :class="[
        model !== null
          ? 'border-[var(--blue-p)] bg-[var(--blue-p)]'
          : 'border-[var(--depth-7)] bg-[var(--depth-8)]',
        disabled && 'cursor-not-allowed opacity-50',
      ]"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value.toString()">
        {{ opt.label }}
      </option>
    </select>
    <span class="pointer-events-none absolute right-[var(--s-3)] top-1/2 -translate-y-1/2">
      <img src="/icons/dropdown.svg" class="h-3.5 w-3.5 opacity-50 invert" alt="" />
    </span>
  </div>
</template>
