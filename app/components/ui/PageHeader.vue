<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="mb-(--s-7)">
    <p class="font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-fg-subtle mb-(--s-3)">
      {{ eyebrow }}
    </p>
    <h2 class="font-sans text-[28px] font-bold leading-[1.2] tracking-[-0.03em] text-fg mb-(--s-2)">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="font-sans text-sm text-fg-subtle">
      {{ subtitle }}
    </p>
  </div>
</template>
