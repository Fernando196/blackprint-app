import { readFileSync } from 'fs'
import { resolve } from 'path'

type TablaRecord = {
  tipo: string
  clase: string
  entidad: string
  banco: string
}

export default defineEventHandler(() => {
  const filePath = resolve('server/data/tabla.json')
  const raw = readFileSync(filePath, 'utf-8')
  const registros: TablaRecord[] = JSON.parse(raw)

  const unique = (key: keyof TablaRecord) =>
    [...new Set(registros.map((r) => r[key]).filter(Boolean))].sort()

  return {
    tipos: unique('tipo'),
    clases: unique('clase'),
    entidades: unique('entidad'),
    bancos: unique('banco'),
  }
})
