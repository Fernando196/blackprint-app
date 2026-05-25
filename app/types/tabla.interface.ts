import type { TipoInmueble } from './catalogos'

export interface TablaResponse {
  id: string
  colonia: string
  municipio: string
  entidad: string
  cp: string
  tipo: TipoInmueble
  clase: ClaseItem
  conservacion: Conservacion
  valorConcluido: number
  valorM2: number
  supConstruida: number
  supTerreno: number
  recamaras: number
  banco: string
  fechaAvaluo: string | Date
}

export enum Clase {
  Económica = 'Económica',
  InterésSocial = 'Interés social',
  Media = 'Media',
  Residencial = 'Residencial',
  ResidencialPlus = 'Residencial Plus',
  Semilujo = 'Semilujo',
}

export enum Conservacion {
  Bueno = 'Bueno',
  MuyBueno = 'Muy bueno',
  Nuevo = 'Nuevo',
  RecientementeRemodelado = 'Recientemente remodelado',
  Regular = 'Regular',
}

export type TablaRecord = {
  tipo: string
  clase: string
  entidad: string
  banco: string
}
