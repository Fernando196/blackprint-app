import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { createReadStream } from 'fs'
import { parse } from 'csv-parse'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── CATÁLOGOS ───────────────────────────────────────────────
const catalogos = {
  vigilancia: {
    0: 'No aplica',
    1: 'Municipal',
    2: 'Autónoma privada',
    3: 'No existe',
  },
  telefonoSuministro: {
    0: 'No aplica',
    1: 'Red aérea',
    2: 'Red subterránea',
  },
  redDistribucion: {
    0: 'No aplica',
    1: 'Con suministro al inmueble',
    2: 'Sin suministro al inmueble',
  },
  suministro: {
    0: 'No aplica',
    1: 'Existe',
    2: 'No existe',
  },
  proximidad: {
    1: 'Céntrica',
    2: 'Intermedia',
    3: 'Periférica',
    4: 'De expansión',
    5: 'Rural',
  },
  equipamiento: {
    1: 'Básico',
    2: 'Con iglesia, mercado, escuelas y parques',
    3: 'Con transporte público',
    4: 'Con hospitales, bancos y más',
  },
  vialidades: {
    0: 'No aplica',
    1: 'Terracería',
    2: 'Asfalto',
    3: 'Concreto',
    4: 'Empedrado',
    5: 'Adoquín',
    6: 'Otro',
    7: 'No existe',
    8: 'Pavimentación permeable',
  },
  guarniciones: {
    0: 'No aplica',
    1: 'Concreto',
    2: 'Otro',
    3: 'No existe',
  },
  banquetas: {
    0: 'No aplica',
    1: 'Concreto',
    2: 'Empedrado',
    3: 'Adoquín',
    4: 'Otro',
    5: 'No existe',
  },
  conservacion: {
    0: 'No aplica',
    1: 'Ruinoso',
    2: 'Malo',
    3: 'Regular',
    4: 'Bueno',
    5: 'Muy bueno',
    6: 'Nuevo',
    7: 'Recientemente remodelado',
  },
  clasesConstruccion: {
    0: 'No aplica',
    1: 'Mínima',
    2: 'Económica',
    3: 'Interés social',
    4: 'Media',
    5: 'Semilujo',
    6: 'Residencial',
    7: 'Residencial Plus',
    8: 'Única',
  },
  alumbrado: {
    0: 'No aplica',
    1: 'Sin alumbrado',
    2: 'Aéreo',
    3: 'Subterráneo',
  },
  calidadProyecto: {
    0: 'No aplica',
    1: 'Funcional',
    2: 'No funcional',
    3: 'Adecuado a su época',
  },
  tipoInmueble: {
    1: 'Terreno',
    2: 'Casa habitación',
    3: 'Casa en condominio',
    4: 'Departamento en condominio',
    5: 'Otro',
    6: 'Vivienda múltiple',
  },
}

// ─── HELPERS ─────────────────────────────────────────────────
const decode = (catalogo, valor) => catalogo[parseInt(valor)] ?? valor
const num = (v) => parseFloat(v) || 0
const str = (v) => (v ?? '').toString().trim()

// ─── LEER XLSX ───────────────────────────────────────────────
console.log('Leyendo archivo...')
const raw = await new Promise((resolve, reject) => {
  const rows = []
  createReadStream(join(__dirname, 'data.csv'))
    .pipe(
      parse({
        columns: true, // primera fila como headers
        skip_empty_lines: true,
        trim: true,
        encoding: 'utf8',
      })
    )
    .on('data', (row) => rows.push(row))
    .on('end', () => resolve(rows))
    .on('error', reject)
})
console.log(`Total de filas: ${raw.length}`)

// ─── LIMPIAR Y TRANSFORMAR ───────────────────────────────────
const avaluos = raw
  .filter((r) => str(r['¿Es una fila duplicada?']).toLowerCase() !== 'duplicado')
  .map((r, i) => ({
    id: str(r['ID AVALUO']) || `row-${i}`,
    cp: str(r['CP']),
    entidad: str(r['ID ENTIDAD']),
    municipio: str(r['ID MUNICIPIO']),
    claveEntMun: str(r['CLAVE_ENTIDAD_MUNICIPIO']),
    colonia: str(r['Colonia']),
    lat: num(r['LATITUD']),
    lng: num(r['LONGITUD']),
    tipo: decode(catalogos.tipoInmueble, r['TIPO']),
    clase: decode(catalogos.clasesConstruccion, r['CLASE']),
    conservacion: decode(catalogos.conservacion, r['CONSERVACION']),
    proximidad: decode(catalogos.proximidad, r['ID PROXIMIDAD URBANA']),
    vigilancia: decode(catalogos.vigilancia, r['ID VIGILANCIA']),
    equipamiento: decode(catalogos.equipamiento, r['ID EQUIPAMIENTO']),
    vialidades: decode(catalogos.vialidades, r['ID VIALIDADES']),
    banquetas: decode(catalogos.banquetas, r['ID BANQUETAS']),
    guarniciones: decode(catalogos.guarniciones, r['ID GUARNICIONES']),
    alumbrado: decode(catalogos.alumbrado, r['ID ALUMBRADO']),
    calidadProyecto: decode(catalogos.calidadProyecto, r['ID CALIDAD PROYECTO']),
    supTerreno: num(r['SUP TERRENO']),
    supConstruida: num(r['SUP CONSTRUIDA']),
    supVendible: num(r['SUP VENDIBLE']),
    recamaras: num(r['RECAMARAS']),
    banos: num(r['BAÑOS']) || num(r["BAÃ'OS"]),
    estacionamiento: num(r['ESTACIONAMIENTO']),
    niveles: num(r['NIVELES']),
    edadMeses: num(r['EDAD MESES']),
    valorConcluido: num(r['VALOR CONCLUIDO']),
    valorTerrenoM2: num(r['VALOR TERRENO M2']),
    valorFisicoTerreno: num(r['VALOR_FISICO_TERRENO']),
    valorFisicoConstruccion: num(r['VALOR_FISICO_CONSTRUCCION']),
    valorM2: num(r['$M2 SV']),
    valorComparativo: num(r['VALOR COMPARATIVO']),
    fechaAvaluo: str(r['FECHA AVALUO']),
    grupo: str(r['GRUPO']),
    banco: str(r['SIGLAS']),
    unidadValuacion: str(r['Unidad de Valuación']) || str(r['Unidad de ValuaciÃ³n']),
    constructor: str(r['CONSTRUCTOR']),
    usoCual: str(r['USO ACTUAL']),
    proposito: num(r['PROPOSITO']),
    año: str(r['AÑO']) || str(r["AÃ'O"]),
    nivelInfraestructura: num(r['NIVEL_INFRAESTRUCTURA']),
    status: str(r['STATUS']),
  }))
  .filter((r) => r.lat !== 0 && r.lng !== 0) // solo registros con coordenadas

console.log(`Registros válidos: ${avaluos.length}`)

// ─── MÉTRICAS GENERALES ──────────────────────────────────────
const valores = avaluos.map((a) => a.valorConcluido).filter((v) => v > 0)
const valoresM2 = avaluos.map((a) => a.valorM2).filter((v) => v > 0)

const metricas = {
  total: avaluos.length,
  valorPromedio: Math.round(valores.reduce((a, b) => a + b, 0) / valores.length),
  valorMediano: valores.sort((a, b) => a - b)[Math.floor(valores.length / 2)],
  valorMin: Math.min(...valores),
  valorMax: Math.max(...valores),
  m2Promedio: Math.round(valoresM2.reduce((a, b) => a + b, 0) / valoresM2.length),
  porTipo: Object.entries(
    avaluos.reduce((acc, a) => {
      acc[a.tipo] = (acc[a.tipo] || 0) + 1
      return acc
    }, {})
  )
    .map(([tipo, count]) => ({ tipo, count }))
    .sort((a, b) => b.count - a.count),
  porClase: Object.entries(
    avaluos.reduce((acc, a) => {
      acc[a.clase] = (acc[a.clase] || 0) + 1
      return acc
    }, {})
  )
    .map(([clase, count]) => ({ clase, count }))
    .sort((a, b) => b.count - a.count),
  porBanco: Object.entries(
    avaluos.reduce((acc, a) => {
      acc[a.banco] = (acc[a.banco] || 0) + 1
      return acc
    }, {})
  )
    .map(([banco, count]) => ({ banco, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10),
}

// ─── AGREGACIONES POR ESTADO ─────────────────────────────────
const porEstadoMap = {}
avaluos.forEach((a) => {
  const key = a.entidad
  if (!porEstadoMap[key]) {
    porEstadoMap[key] = { entidad: key, count: 0, valorTotal: 0, valores: [] }
  }
  porEstadoMap[key].count++
  porEstadoMap[key].valorTotal += a.valorConcluido
  porEstadoMap[key].valores.push(a.valorConcluido)
})

const porEstado = Object.values(porEstadoMap)
  .map((e) => ({
    entidad: e.entidad,
    count: e.count,
    valorPromedio: Math.round(e.valorTotal / e.count),
    valorMediano: e.valores.sort((a, b) => a - b)[Math.floor(e.valores.length / 2)],
  }))
  .sort((a, b) => b.count - a.count)

// ─── DATOS PARA MAPA (versión ligera) ────────────────────────
const dataMapa = avaluos.map((a) => ({
  id: a.id,
  lat: a.lat,
  lng: a.lng,
  tipo: a.tipo,
  clase: a.clase,
  valorConcluido: a.valorConcluido,
  valorM2: a.valorM2,
  colonia: a.colonia,
  municipio: a.municipio,
  entidad: a.entidad,
}))

const dataTabla = avaluos.map((a) => ({
  id: a.id,
  colonia: a.colonia,
  municipio: a.municipio,
  entidad: a.entidad,
  cp: a.cp,
  tipo: a.tipo,
  clase: a.clase,
  conservacion: a.conservacion,
  valorConcluido: a.valorConcluido,
  valorM2: a.valorM2,
  supConstruida: a.supConstruida,
  supTerreno: a.supTerreno,
  recamaras: a.recamaras,
  banco: a.banco,
  fechaAvaluo: a.fechaAvaluo,
}))

// ─── GUARDAR JSONs ───────────────────────────────────────────
const outDir = join(__dirname, '../server/data')
mkdirSync(outDir, { recursive: true })

writeFileSync(join(outDir, 'avaluos.json'), JSON.stringify(avaluos))
writeFileSync(join(outDir, 'metricas.json'), JSON.stringify(metricas))
writeFileSync(join(outDir, 'por_estado.json'), JSON.stringify(porEstado))
writeFileSync(join(outDir, 'mapa.json'), JSON.stringify(dataMapa))
writeFileSync(join(outDir, 'tabla.json'), JSON.stringify(dataTabla))

console.log('✅ JSONs generados en server/data/')
