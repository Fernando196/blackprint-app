import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler((event) => {
  const query = getQuery(event)

  const tipo = query.tipo as string | undefined
  const clase = query.clase as string | undefined
  const entidad = query.entidad as string | undefined
  const valorMin = query.valorMin ? Number(query.valorMin) : undefined
  const valorMax = query.valorMax ? Number(query.valorMax) : undefined
  const limite = query.limite ? Number(query.limite) : 100
  const pagina = query.pagina ? Number(query.pagina) : 1

  const filePath = resolve('server/data/tabla.json')
  const raw = readFileSync(filePath, 'utf-8')
  let registros: Record<string, unknown>[] = JSON.parse(raw)

  if (tipo) {
    registros = registros.filter((r) => r.tipo === tipo)
  }
  if (clase) {
    registros = registros.filter((r) => r.clase === clase)
  }
  if (entidad) {
    registros = registros.filter((r) => r.entidad === entidad)
  }
  if (valorMin !== undefined) {
    registros = registros.filter((r) => (r.valorConcluido as number) >= valorMin)
  }
  if (valorMax !== undefined) {
    registros = registros.filter((r) => (r.valorConcluido as number) <= valorMax)
  }

  const total = registros.length
  const offset = (pagina - 1) * limite
  const datos = registros.slice(offset, offset + limite)

  return { total, pagina, limite, datos }
})
