export interface ItemCatalogo {
  id: number
  nombre: string
}

export type Vigilancia = ItemCatalogo
export type TelefonoSuministro = ItemCatalogo
export type RedDistribucion = ItemCatalogo
export type Suministro = ItemCatalogo
export type RefProximidad = ItemCatalogo
export type NivelEquipamiento = ItemCatalogo
export type Vialidades = ItemCatalogo
export type Guarniciones = ItemCatalogo
export type Banquetas = ItemCatalogo
export type EstadoConservacion = ItemCatalogo
export type ClasesConstruccion = ItemCatalogo
export type AlumbradoPublico = ItemCatalogo
export type CalidadProyecto = ItemCatalogo
export type TipoInmueble = ItemCatalogo

export type Estado = ItemCatalogo

export interface Municipio extends ItemCatalogo {
  idEstado: number
  nombreEstado: string
}
