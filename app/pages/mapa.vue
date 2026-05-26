<script setup lang="ts">
  import Mapfilter from '~/components/map/Mapfilter.vue'

  const { points, isLoading, hasError, puntosFiltrados } = useMapa()
</script>

<template>
  <div class="relative h-[calc(100vh-72px)]">
    <Mapfilter
      :points="points"
      :filter-points="puntosFiltrados"
      :has-error="hasError"
      :is-loading="isLoading"
    />
  </div>
</template>
