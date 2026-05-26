<script setup lang="ts">
  import ChartCard from '~/components/charts/ChartCard.vue'
  import RankingEstados from '~/components/charts/RankingEstados.vue'
  import TablaRanking from '~/components/tabla/TablaRanking.vue'
  import PageHeader from '~/components/ui/PageHeader.vue'

  const { estados } = usePorEstado()
</script>

<template>
  <div class="h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <div class="flex flex-col gap-(--s-6) p-(--s-6)">
      <PageHeader
        eyebrow="Inteligencia Inmobiliaria"
        title="Rankings por Estado"
        subtitle="Septiembre 2024 · México"
      />

      <div class="grid grid-cols-2 gap-(--s-5)">
        <ChartCard title="Top 15 estados · Volumen de avalúos">
          <RankingEstados :items="estados" />
        </ChartCard>
        <TablaRanking :items="estados" />
      </div>
    </div>
  </div>
</template>
