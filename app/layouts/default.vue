<script setup lang="ts">
  import AppNavbar from '~/components/ui/AppNavbar.vue'
</script>

<template>
  <div class="bg-bg text-fg min-h-screen">
    <AppNavbar />

    <main class="pt-[72px]">
      <slot />
    </main>
  </div>
</template>
