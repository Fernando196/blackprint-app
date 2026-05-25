<script setup lang="ts">
  import { watch, onUnmounted, nextTick } from 'vue'
  import type { Map as LeafletMap } from 'leaflet'
  import type { MapPoint } from '~/types/mapa'

  const props = defineProps<{ points: MapPoint[] }>()

  const MEXICO_CENTER = [23.6345, -102.5528] as [number, number]
  const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  const ATTRIBUTION = '&copy; OpenStreetMap contributors &copy; CARTO'

  let mapInstance: LeafletMap | null = null
  let clusterGroup: any = null

  const fmtMXN = (n: number) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(n)

  function popupHtml(point: MapPoint): string {
    return `
      <div style="min-width:200px;padding:12px">
        <p style="font-family:var(--font-sans);font-size:14px;font-weight:600;color:var(--color-fg);margin:0">${point.tipo}</p>
        <p style="font-family:var(--font-sans);font-size:12px;color:var(--color-fg-muted);margin:4px 0 0">${point.clase}</p>
        <p style="font-family:var(--font-ui);font-size:16px;font-weight:600;color:var(--color-accent);margin:8px 0 0">${fmtMXN(point.valorConcluido)}</p>
        <p style="font-family:var(--font-ui);font-size:12px;color:var(--color-fg-subtle);margin:0">${fmtMXN(point.valorM2)} / m²</p>
        <div style="border-top:1px solid var(--color-border);margin-top:8px;padding-top:8px">
          <p style="font-family:var(--font-sans);font-size:12px;color:var(--color-fg-muted);margin:0">${point.colonia}</p>
          <p style="font-family:var(--font-sans);font-size:12px;color:var(--color-fg-subtle);margin:0">${point.municipio}</p>
        </div>
      </div>
    `
  }

  async function buildCluster(): Promise<void> {
    if (!mapInstance || !props.points || props.points.length === 0) return

    // 1. Forzar a Leaflet a estar en el scope global antes de cargar el plugin
    const LeafletModule = await import('leaflet')
    const L = Object.create(LeafletModule.default || LeafletModule)
    // Aseguramos que esté en el objeto window global para el plugin
    if (typeof window !== 'undefined') {
      window.L = L
    }
    await import('leaflet.markercluster')

    // 2. Limpiar el cluster anterior si existe
    if (clusterGroup) {
      mapInstance.removeLayer(clusterGroup)
      clusterGroup.clearLayers()
    }

    // 3. Inicializar el MarkerClusterGroup usando la instancia global o extendida
    clusterGroup = (window.L as any).markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 60,
      iconCreateFunction(cluster: any) {
        const count = cluster.getChildCount()
        return (window.L as any).divIcon({
          html: `<div class="bp-cluster">${count > 999 ? '999+' : count}</div>`,
          className: '',
          iconSize: (window.L as any).point(40, 40),
        })
      },
    })

    // 4. Crear y añadir los marcadores de forma eficiente
    const markers: any[] = []

    for (const point of props.points) {
      if (!point.lat || !point.lng) continue // Validación por seguridad

      const marker = (window.L as any).circleMarker([point.lat, point.lng], {
        radius: 5,
        color: '#0875E3',
        fillColor: '#0875E3',
        fillOpacity: 0.85,
        weight: 1.5,
      })

      marker.bindPopup(popupHtml(point))
      markers.push(marker)
    }

    // addLayers (en plural) es mucho más rápido que addLayer uno por uno
    clusterGroup.addLayers(markers)
    mapInstance.addLayer(clusterGroup)
  }

  function onMapReady(map: LeafletMap): void {
    mapInstance = map
    // Aseguramos que el DOM y las props estén sincronizados
    nextTick(() => {
      buildCluster()
    })
  }

  // Escucha cambios en los puntos y redibuja
  watch(
    () => props.points,
    () => {
      buildCluster()
    },
    { deep: true }
  )

  onUnmounted(() => {
    if (clusterGroup && mapInstance) {
      mapInstance.removeLayer(clusterGroup)
    }
    clusterGroup = null
    mapInstance = null
  })
</script>

<template>
  <ClientOnly>
    <div class="w-full-container h-full" style="min-height: 500px">
      <LMap :zoom="5" :center="MEXICO_CENTER" class="h-full w-full" @ready="onMapReady">
        <LTileLayer :url="TILE_URL" :attribution="ATTRIBUTION" />
      </LMap>
    </div>
  </ClientOnly>
</template>
