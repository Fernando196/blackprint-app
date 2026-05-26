<script setup lang="ts">
  import AppNavbar from '~/components/ui/AppNavbar.vue'
  import FilterBar from '~/components/ui/FilterBar.vue'
  import ChatBot from '~/components/ui/ChatBot.vue'
  const { points, puntosFiltrados } = useMapa()
</script>

<template>
  <div class="bg-bg text-fg">
    <AppNavbar />
    <main class="mt-[72px] flex h-[calc(100vh-72px)] overflow-hidden">
      <FilterBar :result-count="puntosFiltrados.length" :total-count="points.length" />
      <div class="flex-1 overflow-hidden h-full">
        <slot />
      </div>
    </main>
    <ChatBot />
  </div>
</template>
