import type { MapPoint } from '~/types/mapa'

export interface FiltrosHerramienta {
  tipo?: string | null
  clase?: string | null
  entidad?: string | null
  valorMin?: number | null
  valorMax?: number | null
  banco?: string | null
}

interface ResumenMercado {
  total: number
  valorPromedio: number
  valorMediano: number
  m2Promedio: number
}

function aplicarFiltros(data: MapPoint[], f: FiltrosHerramienta): MapPoint[] {
  return data.filter((p) => {
    if (f.tipo && p.tipo !== f.tipo) return false
    if (f.clase && p.clase !== f.clase) return false
    if (f.entidad && p.entidad !== f.entidad) return false
    if (f.valorMin != null && p.valorConcluido < f.valorMin) return false
    if (f.valorMax != null && p.valorConcluido > f.valorMax) return false
    if (f.banco && p.banco !== f.banco) return false
    return true
  })
}

function calcStats(pts: MapPoint[]): ResumenMercado {
  if (!pts.length) return { total: 0, valorPromedio: 0, valorMediano: 0, m2Promedio: 0 }
  const vals = pts.map((p) => p.valorConcluido).sort((a, b) => a - b)
  const n = pts.length
  const sum = vals.reduce((a, b) => a + b, 0)
  const mid = Math.floor(n / 2)
  const mediana = n % 2 === 0 ? ((vals[mid - 1]! + vals[mid]!) / 2) : vals[mid]!
  return {
    total: n,
    valorPromedio: Math.round(sum / n),
    valorMediano: Math.round(mediana),
    m2Promedio: Math.round(pts.reduce((a, p) => a + p.valorM2, 0) / n),
  }
}

export function getResumenMercado(mapa: MapPoint[], f: FiltrosHerramienta): ResumenMercado {
  return calcStats(aplicarFiltros(mapa, f))
}

export function getTopEstados(mapa: MapPoint[], f: FiltrosHerramienta, n = 5) {
  const subset = aplicarFiltros(mapa, f)
  const acc = new Map<string, { count: number; suma: number }>()
  for (const p of subset) {
    const prev = acc.get(p.entidad) ?? { count: 0, suma: 0 }
    acc.set(p.entidad, { count: prev.count + 1, suma: prev.suma + p.valorConcluido })
  }
  const total = subset.length || 1
  return [...acc.entries()]
    .map(([entidad, { count, suma }]) => ({
      entidad,
      count,
      valorPromedio: Math.round(suma / count),
      pct: parseFloat(((count / total) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n)
}

export function getDistribucionTipo(mapa: MapPoint[], f: FiltrosHerramienta) {
  const subset = aplicarFiltros(mapa, f)
  const acc = new Map<string, number>()
  for (const p of subset) acc.set(p.tipo, (acc.get(p.tipo) ?? 0) + 1)
  const total = subset.length || 1
  return [...acc.entries()]
    .map(([tipo, count]) => ({ tipo, count, pct: parseFloat(((count / total) * 100).toFixed(1)) }))
    .sort((a, b) => b.count - a.count)
}

export function getDistribucionClase(mapa: MapPoint[], f: FiltrosHerramienta) {
  const subset = aplicarFiltros(mapa, f)
  const acc = new Map<string, number>()
  for (const p of subset) acc.set(p.clase, (acc.get(p.clase) ?? 0) + 1)
  const total = subset.length || 1
  return [...acc.entries()]
    .map(([clase, count]) => ({ clase, count, pct: parseFloat(((count / total) * 100).toFixed(1)) }))
    .sort((a, b) => b.count - a.count)
}

export function getComparativaEstados(mapa: MapPoint[], estado1: string, estado2: string) {
  const s1 = calcStats(mapa.filter((p) => p.entidad === estado1))
  const s2 = calcStats(mapa.filter((p) => p.entidad === estado2))
  return {
    [estado1]: s1.total > 0 ? s1 : null,
    [estado2]: s2.total > 0 ? s2 : null,
  }
}
