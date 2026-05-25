import { TablaResponse, TablaRecord } from '../../app/types/tabla.interface'
import { resolve } from 'path'
import { readFileSync } from 'fs'

export default defineEventHandler(async () => {
  let data: TablaResponse[] = []

  if (import.meta.dev) {
    const filePath = resolve('server/data/tabla.json')
    const raw = readFileSync(filePath, 'utf-8')
    data = JSON.parse(raw)
  } else {
    const config = useRuntimeConfig()
    data = await $fetch<TablaResponse[]>(`${config.blobUrl}/tabla.json`, {
      headers: {
        Authorization: `Bearer ${config.BlobReadWriteToken}`,
      },
    })
  }
  const registros: TablaResponse[] = data

  const unique = (key: keyof TablaRecord) =>
    [...new Set(registros.map((r) => r[key]).filter(Boolean))].sort()

  return {
    tipos: unique('tipo'),
    clases: unique('clase'),
    entidades: unique('entidad'),
    bancos: unique('banco'),
  }
})
