<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="rounded-(--r-lg) bg-surface p-(--s-6) shadow-4">
    <p class="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-fg-subtle mb-5">
      {{ title }}
    </p>
    <slot />
  </div>
</template>
