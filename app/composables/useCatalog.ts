import type { ComputedRef } from 'vue'
import { useCatalogStore } from '~/stores/catalogs.store'
import type { Estado, Municipio } from '~/types/catalogos'
import type { DropdownOption } from '~/types/filters'

export function useCatalog(): {
  getEstado: (id: number) => Estado | undefined
  getMunicipio: (idEstado: number, codMunicipio: number) => Municipio | undefined
  getTipoInmueble: (id: string | number) => string
  getClaseConstruccion: (id: string | number) => string
  getConservacion: (id: string | number) => string
  getProximidad: (id: string | number) => string
  getVigilancia: (id: string | number) => string
  getVialidades: (id: string | number) => string
  getAlumbrado: (id: string | number) => string
  getEquipamiento: (id: string | number) => string
  tiposOptions: ComputedRef<DropdownOption[]>
  clasesOptions: ComputedRef<DropdownOption[]>
  estadosOptions: ComputedRef<DropdownOption[]>
  conservacionOptions: ComputedRef<DropdownOption[]>
} {
  const store = useCatalogStore()

  function getEstado(id: number): Estado | undefined {
    return store.estados.find((e) => e.id === id)
  }

  function getMunicipio(idEstado: number, codMunicipio: number): Municipio | undefined {
    return store.municipios.find((m) => m.idEstado === idEstado && m.id === codMunicipio)
  }

  function getTipoInmueble(id: string | number): string {
    const idStr = id.toString()
    return store.tiposInmueble.find((i) => i.id.toString() === idStr)?.nombre ?? ''
  }

  function getClaseConstruccion(id: string | number): string {
    const idStr = id.toString()
    return store.clasesConstruccion.find((i) => i.id.toString() === idStr)?.nombre ?? ''
  }

  function getConservacion(id: string | number): string {
    const idStr = id.toString()
    return store.estadosConservacion.find((i) => i.id.toString() === idStr)?.nombre ?? ''
  }

  function getProximidad(id: string | number): string {
    const idStr = id.toString()
    return store.referenciasProximidad.find((i) => i.id.toString() === idStr)?.nombre ?? ''
  }

  function getVigilancia(id: string | number): string {
    const idStr = id.toString()
    return store.vigilancias.find((i) => i.id.toString() === idStr)?.nombre ?? ''
  }

  function getVialidades(id: string | number): string {
    const idStr = id.toString()
    return store.vialidades.find((i) => i.id.toString() === idStr)?.nombre ?? ''
  }

  function getAlumbrado(id: string | number): string {
    const idStr = id.toString()
    return store.alumbradosPublicos.find((i) => i.id.toString() === idStr)?.nombre ?? ''
  }

  function getEquipamiento(id: string | number): string {
    const idStr = id.toString()
    return store.nivelesEquipamiento.find((i) => i.id.toString() === idStr)?.nombre ?? ''
  }

  const tiposOptions = computed<DropdownOption[]>(() =>
    store.tiposInmueble.map((i) => ({ label: i.nombre, value: i.id }))
  )

  const clasesOptions = computed<DropdownOption[]>(() =>
    store.clasesConstruccion.map((i) => ({ label: i.nombre, value: i.id }))
  )

  const estadosOptions = computed<DropdownOption[]>(() =>
    store.estados.map((i) => ({ label: i.nombre, value: i.id }))
  )

  const conservacionOptions = computed<DropdownOption[]>(() =>
    store.estadosConservacion.map((i) => ({ label: i.nombre, value: i.id }))
  )

  return {
    getEstado,
    getMunicipio,
    getTipoInmueble,
    getClaseConstruccion,
    getConservacion,
    getProximidad,
    getVigilancia,
    getVialidades,
    getAlumbrado,
    getEquipamiento,
    tiposOptions,
    clasesOptions,
    estadosOptions,
    conservacionOptions,
  }
}
