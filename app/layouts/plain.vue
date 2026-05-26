<script setup lang="ts">
  import AppNavbar from '~/components/ui/AppNavbar.vue'
</script>

<template>
  <div class="bg-bg text-fg">
    <AppNavbar />
    <main class="mt-[72px] h-[calc(100vh-72px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <slot />
    </main>
  </div>
</template>
