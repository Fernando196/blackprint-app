import { TablaResponse, TablaRecord } from '../../app/types/tabla.interface'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const data = await $fetch<TablaResponse[]>(`${config.blobUrl}/tabla.json`, {
    headers: {
      Authorization: `Bearer ${config.BlobReadWriteToken}`,
    },
  })
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
