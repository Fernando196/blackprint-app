<script setup lang="ts">
  import { watch, onUnmounted, nextTick } from 'vue'
  import type { Map as LeafletMap } from 'leaflet'
  import type { MapPoint, EstadoGeoCollection } from '~/types/mapa'

  const props = defineProps<{
    points: MapPoint[]
    conteoPorEntidad?: Record<string, number>
    activeEntidad?: string | null
  }>()

  const emit = defineEmits<{
    'entidad-seleccionada': [entidadId: string | null]
  }>()

  const MEXICO_CENTER = [23.6345, -102.5528] as [number, number]
  const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  const ATTRIBUTION = '&copy; OpenStreetMap contributors &copy; CARTO'
  const ZOOM_THRESHOLD = 6

  // Colores literales del brand kit (--depth-7, --depth-5, --blue-p)
  const STYLE_DEFAULT = { fillColor: '#484848', fillOpacity: 0.3, color: '#8d9398', weight: 0.5 }
  const STYLE_HOVER   = { fillColor: '#0875e3', fillOpacity: 0.35, color: '#8d9398', weight: 1 }
  const STYLE_ACTIVE  = { fillColor: '#0875e3', fillOpacity: 0.5,  color: '#0875e3', weight: 1.5 }

  let mapInstance: LeafletMap | null = null
  let clusterGroup: any = null
  let geoLayer: any = null
  let stateMarkersGroup: any = null
  let selectedEntidadId: string | null = null

  const { geoData } = useEstadosGeo()

  // ─── Helpers ─────────────────────────────────────────────────────────────

  const fmtMXN = (n: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)

  const fmtN = (n: number) => n.toLocaleString('es-MX')

  function fmtCompact(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return String(n)
  }

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
      </div>`
  }

  function tooltipHtml(name: string, count: number): string {
    return `<div style="font-family:var(--font-sans);padding:8px 12px">
      <p style="font-size:13px;font-weight:600;color:var(--color-fg);margin:0">${name}</p>
      <p style="font-size:12px;color:var(--color-fg-muted);margin:4px 0 0;font-family:var(--font-ui)">${fmtN(count)} avalúos</p>
    </div>`
  }

  // Centroide del polígono más grande (ignora islas)
  function centroideOf(feature: any): [number, number] {
    const geom = feature.geometry
    let ring: number[][]

    if (geom.type === 'Polygon') {
      ring = geom.coordinates[0] as number[][]
    } else {
      // MultiPolygon: usar el anillo exterior del polígono más grande
      const sorted = [...(geom.coordinates as number[][][][])].sort(
        (a, b) => (b[0]?.length ?? 0) - (a[0]?.length ?? 0),
      )
      ring = (sorted[0]?.[0] ?? []) as number[][]
    }

    const avgLng = ring.reduce((s, c) => s + ((c[0] as number) ?? 0), 0) / ring.length
    const avgLat = ring.reduce((s, c) => s + ((c[1] as number) ?? 0), 0) / ring.length
    return [avgLat, avgLng]
  }

  // Escala con raíz cuadrada para mejor distribución visual
  function bubbleSize(count: number, maxCount: number): number {
    const MIN = 28, MAX = 58
    if (maxCount === 0) return MIN
    return Math.round(MIN + Math.sqrt(count / maxCount) * (MAX - MIN))
  }

  // ─── GeoJSON layer ────────────────────────────────────────────────────────

  function geoFeatureStyle(feature: any) {
    const isActive = selectedEntidadId && feature.properties.entidadId === selectedEntidadId
    return isActive ? STYLE_ACTIVE : STYLE_DEFAULT
  }

  async function buildGeoLayer(): Promise<void> {
    if (!mapInstance || !geoData.value) return

    if (!window.L) {
      const mod = await import('leaflet')
      window.L = Object.create(mod.default || mod)
    }

    if (geoLayer) { mapInstance.removeLayer(geoLayer); geoLayer = null }

    geoLayer = (window.L as any).geoJSON(geoData.value as EstadoGeoCollection, {
      style: geoFeatureStyle,
      onEachFeature(feature: any, layer: any) {
        const { name, entidadId, count } = feature.properties

        layer.bindTooltip(tooltipHtml(name, count), { sticky: true, opacity: 1, className: 'bp-tooltip' })

        layer.on('mouseover', () => {
          if (entidadId !== selectedEntidadId) layer.setStyle(STYLE_HOVER)
        })
        layer.on('mouseout', () => {
          layer.setStyle(entidadId === selectedEntidadId && selectedEntidadId ? STYLE_ACTIVE : STYLE_DEFAULT)
        })
        layer.on('click', () => {
          if (selectedEntidadId === entidadId) {
            selectedEntidadId = null
            geoLayer.resetStyle()
            emit('entidad-seleccionada', null)
          } else {
            selectedEntidadId = entidadId
            geoLayer.resetStyle()
            emit('entidad-seleccionada', entidadId)
          }
        })
      },
    })

    geoLayer.addTo(mapInstance)
  }

  // ─── Zoom helpers ─────────────────────────────────────────────────────────

  function zoomToEntidad(entidadId: string): void {
    if (!mapInstance || !geoLayer) return
    geoLayer.eachLayer((layer: any) => {
      if (layer.feature?.properties?.entidadId === entidadId) {
        mapInstance!.fitBounds(layer.getBounds(), { padding: [40, 40] })
      }
    })
  }

  // ─── State aggregate markers (national view, zoom ≤ 6) ───────────────────

  async function buildStateMarkers(): Promise<void> {
    if (!mapInstance || !geoData.value) return

    if (!window.L) {
      const mod = await import('leaflet')
      window.L = Object.create(mod.default || mod)
    }

    if (stateMarkersGroup) {
      mapInstance.removeLayer(stateMarkersGroup)
      stateMarkersGroup = null
    }

    // Usar conteo completo del padre si está disponible; si no, contar desde props.points
    const counts: Record<string, number> = props.conteoPorEntidad ?? (() => {
      const acc: Record<string, number> = {}
      for (const p of props.points) acc[p.entidad] = (acc[p.entidad] ?? 0) + 1
      return acc
    })()
    const maxCount = Object.values(counts).length ? Math.max(...Object.values(counts)) : 0

    stateMarkersGroup = (window.L as any).layerGroup()

    for (const feature of geoData.value.features) {
      const { name, entidadId } = feature.properties
      if (!entidadId) continue

      const count = counts[entidadId] ?? 0
      if (count === 0) continue

      const size = bubbleSize(count, maxCount)
      const fontSize = size < 36 ? 10 : size < 48 ? 12 : 14
      const isActive = entidadId === selectedEntidadId
      const centroid = centroideOf(feature)

      const icon = (window.L as any).divIcon({
        html: `<div class="bp-state-bubble${isActive ? ' bp-state-bubble--active' : ''}" style="width:${size}px;height:${size}px;font-size:${fontSize}px">${fmtCompact(count)}</div>`,
        className: '',
        iconSize: (window.L as any).point(size, size),
        iconAnchor: (window.L as any).point(size / 2, size / 2),
      })

      const marker = (window.L as any).marker(centroid, { icon })
      marker.bindTooltip(tooltipHtml(name, count), { opacity: 1, className: 'bp-tooltip' })
      marker.on('click', () => {
        const next = selectedEntidadId === entidadId ? null : entidadId
        selectedEntidadId = next
        geoLayer?.resetStyle()
        emit('entidad-seleccionada', next)
        if (next) zoomToEntidad(next)
        buildStateMarkers()
      })

      stateMarkersGroup.addLayer(marker)
    }

    if (mapInstance.getZoom() <= ZOOM_THRESHOLD) {
      stateMarkersGroup.addTo(mapInstance)
    }
  }

  // ─── Cluster layer (zoomed view, zoom > 6) ────────────────────────────────

  async function buildCluster(): Promise<void> {
    if (!mapInstance || !props.points.length) return

    if (typeof window !== 'undefined') {
      if (!window.L || !('markerClusterGroup' in window.L)) {
        const mod = await import('leaflet')
        const L = Object.create(mod.default || mod)
        window.L = L
        await import('leaflet.markercluster')
      }
    }

    if (clusterGroup) {
      mapInstance.removeLayer(clusterGroup)
      clusterGroup.clearLayers()
    }

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

    const markers: any[] = []
    for (const point of props.points) {
      if (!point.lat || !point.lng) continue
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

    clusterGroup.addLayers(markers)

    // Solo añadir al mapa si estamos en zoom > threshold
    if (mapInstance.getZoom() > ZOOM_THRESHOLD) {
      mapInstance.addLayer(clusterGroup)
    }
  }

  // ─── Zoom mode switching ──────────────────────────────────────────────────

  function syncLayers(): void {
    if (!mapInstance) return
    const zoom = mapInstance.getZoom()

    if (zoom <= ZOOM_THRESHOLD) {
      if (clusterGroup && mapInstance.hasLayer(clusterGroup)) mapInstance.removeLayer(clusterGroup)
      if (stateMarkersGroup && !mapInstance.hasLayer(stateMarkersGroup)) stateMarkersGroup.addTo(mapInstance)
    } else {
      if (stateMarkersGroup && mapInstance.hasLayer(stateMarkersGroup)) mapInstance.removeLayer(stateMarkersGroup)
      if (clusterGroup && !mapInstance.hasLayer(clusterGroup)) mapInstance.addLayer(clusterGroup)
    }
  }

  function onZoomEnd(): void {
    syncLayers()
  }

  // ─── Map lifecycle ────────────────────────────────────────────────────────

  function onMapReady(map: LeafletMap): void {
    mapInstance = map
    nextTick(() => {
      buildGeoLayer()
      buildStateMarkers()
      buildCluster()
    })
  }

  watch(
    () => props.points,
    () => buildCluster(),
    { deep: true },
  )

  watch(
    () => props.conteoPorEntidad,
    () => buildStateMarkers(),
  )

  watch(geoData, (val) => {
    if (val && mapInstance) {
      buildGeoLayer()
      buildStateMarkers()
    }
  })

  watch(
    () => props.activeEntidad,
    (val) => {
      selectedEntidadId = val || null
      if (geoLayer) geoLayer.resetStyle()
      if (stateMarkersGroup) buildStateMarkers()
    },
  )

  onUnmounted(() => {
    if (clusterGroup && mapInstance) mapInstance.removeLayer(clusterGroup)
    if (stateMarkersGroup && mapInstance) mapInstance.removeLayer(stateMarkersGroup)
    if (geoLayer && mapInstance) mapInstance.removeLayer(geoLayer)
    clusterGroup = null
    stateMarkersGroup = null
    geoLayer = null
    mapInstance = null
  })
</script>

<template>
  <ClientOnly>
    <div class="h-full w-full" style="min-height: 500px">
      <LMap
        :zoom="5"
        :center="MEXICO_CENTER"
        class="h-full w-full"
        @ready="onMapReady"
        @zoomend="onZoomEnd"
      >
        <LTileLayer :url="TILE_URL" :attribution="ATTRIBUTION" />
      </LMap>
    </div>
  </ClientOnly>
</template>
