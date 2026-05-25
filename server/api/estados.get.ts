import { PorEstado } from '../../app/types/por_estado.type'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  // const filePath = resolve('server/data/por_estado.json')
  const data = await $fetch<PorEstado[]>(`${config.blobUrl}/por_estado.json`, {
    headers: {
      Authorization: `Bearer ${config.BlobReadWriteToken}`,
    },
  })
  return data
})
