import { resolve } from 'path'
import { readFileSync } from 'fs'
import Anthropic from '@anthropic-ai/sdk'
import type { Metricas } from '~/types/metricas'
import type { PorEstado } from '~/types/por_estado.type'

function readJson<T>(filename: string, blobUrl: string, token: string): Promise<T> | T {
  if (import.meta.dev) {
    const raw = readFileSync(resolve(`server/data/${filename}`), 'utf-8')
    return JSON.parse(raw) as T
  }
  return $fetch<T>(`${blobUrl}/${filename}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

function formatMXN(value: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value)
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ message: string; contexto?: Record<string, unknown> }>(event)
  const config = useRuntimeConfig()
  const apiKey = config.anthropicApiKey || process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'ANTHROPIC_API_KEY no configurada' })
  }
  if (!body.message?.trim()) {
    throw createError({ statusCode: 400, message: 'Mensaje requerido' })
  }

  const [metricas, estados] = await Promise.all([
    readJson<Metricas>('metricas.json', config.blobUrl, config.BlobReadWriteToken),
    readJson<PorEstado[]>('por_estado.json', config.blobUrl, config.BlobReadWriteToken),
  ])

  const top5ByActividad = [...estados]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((e) => `${e.nombreEntidad}: ${e.count.toLocaleString('es-MX')} avalúos`)
    .join('\n')

  const top5ByValor = [...estados]
    .sort((a, b) => b.valorPromedio - a.valorPromedio)
    .slice(0, 5)
    .map((e) => `${e.nombreEntidad}: ${formatMXN(e.valorPromedio)} promedio`)
    .join('\n')

  const distribucionTipo = metricas.porTipo
    .slice(0, 6)
    .map((t) => `${t.tipo}: ${t.count.toLocaleString('es-MX')} (${((t.count / metricas.total) * 100).toFixed(1)}%)`)
    .join('\n')

  const distribucionClase = metricas.porClase
    .slice(0, 6)
    .map((c) => `${c.clase}: ${c.count.toLocaleString('es-MX')} (${((c.count / metricas.total) * 100).toFixed(1)}%)`)
    .join('\n')

  const systemPrompt = `Eres un asistente experto en inteligencia inmobiliaria y mercado hipotecario mexicano. Trabajas para BlackPrint, una plataforma de análisis de avalúos hipotecarios.

Tienes acceso a datos reales del dataset de avalúos hipotecarios de México correspondientes a septiembre 2024. Cuando el usuario pregunte sobre el mercado, cita los datos reales a continuación.

DATOS REALES DEL DATASET (septiembre 2024):

Resumen nacional:
- Total de avalúos: ${metricas.total.toLocaleString('es-MX')}
- Valor promedio nacional: ${formatMXN(metricas.valorPromedio)}
- Valor mediano nacional: ${formatMXN(metricas.valorMediano)}
- Valor promedio por m²: ${formatMXN(metricas.m2Promedio)}

Top 5 estados por volumen de avalúos:
${top5ByActividad}

Top 5 estados por valor promedio:
${top5ByValor}

Distribución por tipo de inmueble:
${distribucionTipo}

Distribución por clase de construcción:
${distribucionClase}

INSTRUCCIONES:
- Responde en español, de forma clara y concisa.
- Cita los datos concretos del dataset cuando sean relevantes.
- Si el usuario pregunta algo fuera del alcance del dataset, indícalo claramente.
- Aclara cuando sea pertinente que los datos corresponden a avalúos hipotecarios de septiembre 2024.
- No inventes datos que no estén en el dataset.
- Mantén un tono técnico y profesional, sin emojis ni exclamaciones.
- Máximo 3-4 párrafos por respuesta.`

  const client = new Anthropic({ apiKey })

  const completion = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: systemPrompt,
    messages: [{ role: 'user', content: body.message }],
  })

  const text = completion.content.find((b) => b.type === 'text')?.text ?? ''

  return { response: text }
})
