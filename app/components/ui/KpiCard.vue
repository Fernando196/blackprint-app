<script setup lang="ts">
defineProps<{
  label: string
  value: string
  unit?: string
}>()
</script>

<template>
  <div class="flex flex-col gap-(--s-2) rounded-(--r-lg) bg-surface p-(--s-6) shadow-4">
    <p class="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-fg-subtle">
      {{ label }}
    </p>
    <p class="font-ui text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-fg">
      {{ value }}
    </p>
    <p v-if="unit" class="font-ui text-xs tracking-[-0.01em] text-fg-subtle">
      {{ unit }}
    </p>
  </div>
</template>
