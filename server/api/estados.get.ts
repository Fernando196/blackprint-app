import { resolve } from 'path'
import { readFileSync } from 'fs'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  let data: any[]
  if (import.meta.dev) {
    const filePath = resolve('server/data/por_estado.json')
    const raw = readFileSync(filePath, 'utf-8')
    data = JSON.parse(raw)
  } else {
    data = await $fetch<any[]>(`${config.blobUrl}/por_estado.json`, {
      headers: {
        Authorization: `Bearer ${config.BlobReadWriteToken}`,
      },
    })
  }

  return data
})
