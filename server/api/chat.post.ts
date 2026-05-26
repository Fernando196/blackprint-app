import { resolve } from 'path'
import { readFileSync } from 'fs'
import Anthropic from '@anthropic-ai/sdk'
import type { MapPoint } from '~/types/mapa'
import type { FiltrosHerramienta } from '../utils/chatTools'
import type { FiltrosAplicados } from '~/types/filters'
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
        tipo: { type: 'string' },
        clase: { type: 'string' },
        entidad: { type: 'string' },
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
        n: { type: 'number' },
      },
    },
  },
  {
    name: 'getDistribucionTipo',
    description: 'Distribución de avalúos por tipo de inmueble con conteo y porcentaje.',
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
    description: 'Compara KPIs entre dos entidades federativas usando su ID numérico como string.',
    input_schema: {
      type: 'object' as const,
      properties: {
        estado1: { type: 'string' },
        estado2: { type: 'string' },
      },
      required: ['estado1', 'estado2'],
    },
  },
  {
    name: 'aplicarFiltros',
    description: 'Aplica filtros en la aplicación para que el usuario vea un subconjunto específico de avalúos. Usa los IDs numéricos del catálogo.',
    input_schema: {
      type: 'object' as const,
      properties: {
        tipo: { type: 'number', description: 'ID tipo de inmueble: 1=Terreno, 2=Casa Habitación, 3=Casa Condominio, 4=Depto Condominio, 5=Otro, 6=Vivienda Múltiple' },
        clase: { type: 'number', description: 'ID clase construcción: 1=Mínima, 2=Económica, 3=Interés Social, 4=Media, 5=Semilujo, 6=Residencial, 7=Residencial Plus, 8=Única' },
        entidad: { type: 'number', description: 'ID entidad federativa (1-32)' },
        valorMin: { type: 'number', description: 'Valor mínimo del avalúo en pesos MXN' },
        valorMax: { type: 'number', description: 'Valor máximo del avalúo en pesos MXN' },
      },
    },
  },
  {
    name: 'limpiarFiltros',
    description: 'Elimina todos los filtros activos y muestra el dataset completo.',
    input_schema: {
      type: 'object' as const,
      properties: {},
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
  return `Filtros activos del usuario: ${partes.join(', ')}${vis}. Cuando uses las herramientas de datos, aplica los mismos filtros para responder sobre el subconjunto visible.`
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

FORMATO DE RESPUESTA:
- Nunca uses tablas markdown (sin pipes |)
- Nunca uses headers markdown (sin ##)
- Usa listas simples con guión (-) para enumerar
- Usa saltos de línea para separar secciones
- Resalta números importantes con texto plano
- Respuestas conversacionales y concisas

CATÁLOGOS DE REFERENCIA (para aplicarFiltros):

Tipos de inmueble (tipo):
- 1: Terreno, 2: Casa Habitación, 3: Casa en Condominio
- 4: Departamento en Condominio, 5: Otro, 6: Vivienda Múltiple

Clases de construcción (clase):
- 1: Mínima, 2: Económica, 3: Interés Social, 4: Media
- 5: Semilujo, 6: Residencial, 7: Residencial Plus, 8: Única

Entidades federativas (entidad):
- 1: Aguascalientes, 2: Baja California, 3: Baja California Sur, 4: Campeche
- 5: Coahuila, 6: Colima, 7: Chiapas, 8: Chihuahua, 9: Ciudad de México, 10: Durango
- 11: Guanajuato, 12: Guerrero, 13: Hidalgo, 14: Jalisco, 15: Estado de México
- 16: Michoacán, 17: Morelos, 18: Nayarit, 19: Nuevo León, 20: Oaxaca
- 21: Puebla, 22: Querétaro, 23: Quintana Roo, 24: San Luis Potosí, 25: Sinaloa
- 26: Sonora, 27: Tabasco, 28: Tamaulipas, 29: Tlaxcala, 30: Veracruz
- 31: Yucatán, 32: Zacatecas

CONTEXTO ACTUAL:
${contextoFiltros}

INSTRUCCIÓN FILTROS:
Cuando el usuario pida ver, filtrar o explorar un subconjunto específico de datos, usa la tool aplicarFiltros con los parámetros correctos. Confirma al usuario qué filtros aplicaste y qué puede esperar ver.
Cuando el usuario pida quitar filtros o ver todo, usa limpiarFiltros.

REGLAS ESTRICTAS — ANTI-ALUCINACIONES:
- Solo responde con datos que las herramientas te devuelvan. Nunca inventes valores.
- Si una herramienta devuelve total: 0 o array vacío, indica que no hay datos para esa consulta.
- Si el usuario pregunta algo fuera del alcance de las herramientas, dilo explícitamente.
- Siempre aclara que los datos son avalúos hipotecarios de septiembre 2024, no la totalidad del mercado.
- Cuando hay filtros activos, menciona sobre qué subconjunto estás respondiendo.
- Responde en español, tono técnico y profesional. Sin emojis ni exclamaciones.
- Máximo 3-4 párrafos.`

  const client = new Anthropic({ apiKey })
  const conversacion: Anthropic.MessageParam[] = [{ role: 'user', content: body.message }]

  let respuesta: Anthropic.Message
  let filtrosAplicados: FiltrosAplicados | null = null
  let limpiar = false

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
        if (bloque.type !== 'tool_use') continue

        let dato: unknown
        if (bloque.name === 'aplicarFiltros') {
          filtrosAplicados = bloque.input as FiltrosAplicados
          dato = { aplicado: true }
        } else if (bloque.name === 'limpiarFiltros') {
          limpiar = true
          filtrosAplicados = null
          dato = { limpiado: true }
        } else {
          dato = ejecutarHerramienta(bloque.name, bloque.input as Record<string, unknown>, mapa)
        }
        resultados.push({ type: 'tool_result', tool_use_id: bloque.id, content: JSON.stringify(dato) })
      }
      conversacion.push({ role: 'assistant', content: respuesta.content })
      conversacion.push({ role: 'user', content: resultados })
    }
  } while (respuesta.stop_reason === 'tool_use')

  const texto = respuesta.content.find((b) => b.type === 'text')?.text ?? ''

  return {
    response: texto,
    ...(filtrosAplicados ? { filtrosAplicados } : {}),
    ...(limpiar ? { limpiar: true } : {}),
  }
})
