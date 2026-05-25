import { MapPoint } from '../../app/types/mapa'
import { resolve } from 'path'
import { readFileSync } from 'fs'

export default defineEventHandler(async () => {
  let data: MapPoint[] = []
  if (import.meta.dev) {
    const filePath = resolve('server/data/mapa.json')
    const raw = readFileSync(filePath, 'utf-8')
    data = JSON.parse(raw)
  } else {
    const config = useRuntimeConfig()
    data = await $fetch<MapPoint[]>(`${config.blobUrl}/mapa.json`, {
      headers: {
        Authorization: `Bearer ${config.BlobReadWriteToken}`,
      },
    })
  }
  return data
})
