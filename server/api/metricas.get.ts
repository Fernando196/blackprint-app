export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const data = await $fetch<any[]>(`${config.blobUrl}/metricas.json`, {
    headers: {
      Authorization: `Bearer ${config.BlobReadWriteToken}`,
    },
  })
  return data
})
