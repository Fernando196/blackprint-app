import { resolve } from 'path'
import { readFileSync } from 'fs'
import Anthropic from '@anthropic-ai/sdk'
import type { MapPoint } from '~/types/mapa'
import type { FiltrosHerramienta } from '../utils/chatTools'
import {
  getResumenMercado,
  getTopEstados,
  getDistribucionTipo,
  getDistribucionClase,
  getComparativaEstados,
} from '../utils/chatTools'

interface FiltrosChat extends FiltrosHerramienta {
  totalVisible?: number | null
}

interface ChatBody {
  message: string
  filtros?: FiltrosChat
}

type ToolResult = {
  type: 'tool_result'
  tool_use_id: string
  content: string
}

function readJson<T>(filename: string, blobUrl: string, token: string): Promise<T> | T {
  if (import.meta.dev) {
    const raw = readFileSync(resolve(`server/data/${filename}`), 'utf-8')
    return JSON.parse(raw) as T
  }
  return $fetch<T>(`${blobUrl}/${filename}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'getResumenMercado',
    description: 'KPIs del dataset: total avalúos, valorPromedio, valorMediano, m2Promedio. Acepta filtros opcionales para consultar un subconjunto.',
    input_schema: {
      type: 'object' as const,
      properties: {
        tipo: { type: 'string', description: 'Tipo de inmueble' },
        clase: { type: 'string', description: 'Clase de construcción' },
        entidad: { type: 'string', description: 'ID de entidad federativa' },
        valorMin: { type: 'number' },
        valorMax: { type: 'number' },
        banco: { type: 'string' },
      },
    },
  },
  {
    name: 'getTopEstados',
    description: 'Top N estados por volumen de avalúos con su valorPromedio y porcentaje del total.',
    input_schema: {
      type: 'object' as const,
      properties: {
        tipo: { type: 'string' },
        clase: { type: 'string' },
        valorMin: { type: 'number' },
        valorMax: { type: 'number' },
        banco: { type: 'string' },
        n: { type: 'number', description: 'Cantidad de estados a retornar (default 5)' },
      },
    },
  },
  {
    name: 'getDistribucionTipo',
    description: 'Distribución de avalúos por tipo de inmueble (casa, departamento, etc.) con conteo y porcentaje.',
    input_schema: {
      type: 'object' as const,
      properties: {
        clase: { type: 'string' },
        entidad: { type: 'string' },
        valorMin: { type: 'number' },
        valorMax: { type: 'number' },
      },
    },
  },
  {
    name: 'getDistribucionClase',
    description: 'Distribución de avalúos por clase de construcción con conteo y porcentaje.',
    input_schema: {
      type: 'object' as const,
      properties: {
        tipo: { type: 'string' },
        entidad: { type: 'string' },
        valorMin: { type: 'number' },
        valorMax: { type: 'number' },
      },
    },
  },
  {
    name: 'getComparativaEstados',
    description: 'Compara KPIs entre dos entidades federativas. Usa el ID numérico de entidad como string.',
    input_schema: {
      type: 'object' as const,
      properties: {
        estado1: { type: 'string', description: 'ID de la primera entidad' },
        estado2: { type: 'string', description: 'ID de la segunda entidad' },
      },
      required: ['estado1', 'estado2'],
    },
  },
]

function ejecutarHerramienta(nombre: string, input: Record<string, unknown>, mapa: MapPoint[]): unknown {
  const f: FiltrosHerramienta = {
    tipo: (input.tipo as string) || null,
    clase: (input.clase as string) || null,
    entidad: (input.entidad as string) || null,
    valorMin: (input.valorMin as number) ?? null,
    valorMax: (input.valorMax as number) ?? null,
    banco: (input.banco as string) || null,
  }
  switch (nombre) {
    case 'getResumenMercado': return getResumenMercado(mapa, f)
    case 'getTopEstados': return getTopEstados(mapa, f, (input.n as number) ?? 5)
    case 'getDistribucionTipo': return getDistribucionTipo(mapa, f)
    case 'getDistribucionClase': return getDistribucionClase(mapa, f)
    case 'getComparativaEstados': return getComparativaEstados(mapa, input.estado1 as string, input.estado2 as string)
    default: return { error: 'Herramienta no disponible' }
  }
}

function buildContextoFiltros(filtros?: FiltrosChat): string {
  const partes: string[] = []
  if (filtros?.tipo) partes.push(`tipo "${filtros.tipo}"`)
  if (filtros?.clase) partes.push(`clase "${filtros.clase}"`)
  if (filtros?.entidad) partes.push(`entidad ${filtros.entidad}`)
  if (filtros?.valorMin != null) partes.push(`valor mínimo $${filtros.valorMin.toLocaleString('es-MX')}`)
  if (filtros?.valorMax != null) partes.push(`valor máximo $${filtros.valorMax.toLocaleString('es-MX')}`)
  if (filtros?.banco) partes.push(`banco "${filtros.banco}"`)
  if (!partes.length) return 'El usuario no tiene filtros activos — vista del dataset completo.'
  const vis = filtros?.totalVisible != null ? ` (${filtros.totalVisible.toLocaleString('es-MX')} registros visibles)` : ''
  return `Filtros activos del usuario: ${partes.join(', ')}${vis}. Cuando uses las herramientas, aplica los mismos filtros para responder sobre el subconjunto que el usuario está viendo.`
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ChatBody>(event)
  const config = useRuntimeConfig()
  const apiKey = config.anthropicApiKey || process.env.ANTHROPIC_API_KEY

  if (!apiKey) throw createError({ statusCode: 500, message: 'ANTHROPIC_API_KEY no configurada' })
  if (!body.message?.trim()) throw createError({ statusCode: 400, message: 'Mensaje requerido' })

  const mapa = await readJson<MapPoint[]>('mapa.json', config.blobUrl, config.BlobReadWriteToken)

  const contextoFiltros = buildContextoFiltros(body.filtros)

  const systemPrompt = `Eres un asistente de inteligencia inmobiliaria de BlackPrint.
El dataset contiene avalúos hipotecarios de México de septiembre 2024, aproximadamente 40,000 registros.

CONTEXTO ACTUAL:
${contextoFiltros}

REGLAS ESTRICTAS — ANTI-ALUCINACIONES:
- Solo responde con datos que las herramientas te devuelvan. Nunca inventes valores, nombres ni estadísticas.
- Si una herramienta devuelve total: 0 o array vacío, indica claramente que no hay datos para esa consulta.
- Si el usuario pregunta algo que no puedes responder con las herramientas disponibles, dilo explícitamente.
- Siempre aclara que los datos son avalúos hipotecarios de septiembre 2024, no la totalidad del mercado inmobiliario.
- Cuando hay filtros activos, menciona sobre qué subconjunto estás respondiendo.
- Usa las herramientas disponibles para obtener datos antes de responder cualquier pregunta sobre cifras.
- Responde en español, tono técnico y profesional. Sin emojis ni exclamaciones.
- Máximo 3-4 párrafos por respuesta.`

  const client = new Anthropic({ apiKey })
  const conversacion: Anthropic.MessageParam[] = [{ role: 'user', content: body.message }]

  let respuesta: Anthropic.Message

  do {
    respuesta = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: systemPrompt,
      tools: TOOLS,
      messages: conversacion,
    })

    if (respuesta.stop_reason === 'tool_use') {
      const resultados: ToolResult[] = []
      for (const bloque of respuesta.content) {
        if (bloque.type === 'tool_use') {
          const dato = ejecutarHerramienta(bloque.name, bloque.input as Record<string, unknown>, mapa)
          resultados.push({ type: 'tool_result', tool_use_id: bloque.id, content: JSON.stringify(dato) })
        }
      }
      conversacion.push({ role: 'assistant', content: respuesta.content })
      conversacion.push({ role: 'user', content: resultados })
    }
  } while (respuesta.stop_reason === 'tool_use')

  const texto = respuesta.content.find((b) => b.type === 'text')?.text ?? ''
  return { response: texto }
})
