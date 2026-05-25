import type { PorEstado } from '../../app/types/por_estado.type'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const ISO_TO_INEGI: Record<string, string> = {
  'MX-AGU': '1',
  'MX-BCN': '2',
  'MX-BCS': '3',
  'MX-CAM': '4',
  'MX-COA': '5',
  'MX-COL': '6',
  'MX-CHP': '7',
  'MX-CHH': '8',
  'MX-CMX': '9',
  'MX-DUR': '10',
  'MX-GUA': '11',
  'MX-GRO': '12',
  'MX-HID': '13',
  'MX-JAL': '14',
  'MX-MEX': '15',
  'MX-MIC': '16',
  'MX-MOR': '17',
  'MX-NAY': '18',
  'MX-NLE': '19',
  'MX-OAX': '20',
  'MX-PUE': '21',
  'MX-QUE': '22',
  'MX-ROO': '23',
  'MX-SLP': '24',
  'MX-SIN': '25',
  'MX-SON': '26',
  'MX-TAB': '27',
  'MX-TAM': '28',
  'MX-TLA': '29',
  'MX-VER': '30',
  'MX-YUC': '31',
  'MX-ZAC': '32',
}

export default defineEventHandler(async (event) => {
  let geoData: any

  if (import.meta.dev) {
    const geoPath = resolve('public/data/estados.geojson')
    geoData = JSON.parse(readFileSync(geoPath, 'utf-8'))
  } else {
    const { origin } = getRequestURL(event)
    geoData = await $fetch(`${origin}/data/estados.geojson`)
  }

  let estadosData: PorEstado[]
  if (import.meta.dev) {
    const estadosPath = resolve('server/data/por_estado.json')
    estadosData = JSON.parse(readFileSync(estadosPath, 'utf-8'))
  } else {
    const config = useRuntimeConfig()
    estadosData = await $fetch<PorEstado[]>(`${config.blobUrl}/por_estado.json`, {
      headers: { Authorization: `Bearer ${config.BlobReadWriteToken}` },
    })
  }

  const countByEntidad = new Map(estadosData.map((e) => [e.entidad, e.count]))

  const features = geoData.features.map((feature: any) => {
    const entidadId = ISO_TO_INEGI[feature.properties.id as string] ?? null
    const count = entidadId ? (countByEntidad.get(entidadId) ?? 0) : 0
    return {
      ...feature,
      properties: { ...feature.properties, entidadId, count },
    }
  })

  return { ...geoData, features }
})
