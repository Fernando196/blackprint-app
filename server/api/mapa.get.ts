import { MapPoint } from '../../app/types/mapa'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const data = await $fetch<MapPoint[]>(`${config.blobUrl}/mapa.json`, {
    headers: {
      Authorization: `Bearer ${config.BlobReadWriteToken}`,
    },
  })
  return data
})
