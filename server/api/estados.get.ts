import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(() => {
  const filePath = resolve('server/data/por_estado.json')
  const raw = readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
})
