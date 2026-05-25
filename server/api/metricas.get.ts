import { resolve } from 'path'
import { readFileSync } from 'fs'

export default defineEventHandler(async () => {
  let data: any[] = []
  if (import.meta.dev) {
    const filePath = resolve('server/data/metricas.json')
    const raw = readFileSync(filePath, 'utf-8')
    data = JSON.parse(raw)
  } else {
    const config = useRuntimeConfig()
    data = await $fetch<any[]>(`${config.blobUrl}/metricas.json`, {
      headers: {
        Authorization: `Bearer ${config.BlobReadWriteToken}`,
      },
    })
  }
  return data
})
