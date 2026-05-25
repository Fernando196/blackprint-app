import type { ComputedRef } from 'vue'
import { useCatalogStore } from '~/stores/catalogs.store'
import type { Estado, Municipio } from '~/types/catalogos'
import type { DropdownOption } from '~/types/filters'

export function useCatalog(): {
  getEstado: (id: number) => Estado | undefined
  getMunicipio: (idEstado: number, codMunicipio: number) => Municipio | undefined
  getTipoInmueble: (id: number) => string
  getClaseConstruccion: (id: number) => string
  getConservacion: (id: number) => string
  getProximidad: (id: number) => string
  getVigilancia: (id: number) => string
  getVialidades: (id: number) => string
  getAlumbrado: (id: number) => string
  getEquipamiento: (id: number) => string
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

  function getTipoInmueble(id: number): string {
    return store.tiposInmueble.find((i) => i.id === id)?.nombre ?? ''
  }

  function getClaseConstruccion(id: number): string {
    return store.clasesConstruccion.find((i) => i.id === id)?.nombre ?? ''
  }

  function getConservacion(id: number): string {
    return store.estadosConservacion.find((i) => i.id === id)?.nombre ?? ''
  }

  function getProximidad(id: number): string {
    return store.referenciasProximidad.find((i) => i.id === id)?.nombre ?? ''
  }

  function getVigilancia(id: number): string {
    return store.vigilancias.find((i) => i.id === id)?.nombre ?? ''
  }

  function getVialidades(id: number): string {
    return store.vialidades.find((i) => i.id === id)?.nombre ?? ''
  }

  function getAlumbrado(id: number): string {
    return store.alumbradosPublicos.find((i) => i.id === id)?.nombre ?? ''
  }

  function getEquipamiento(id: number): string {
    return store.nivelesEquipamiento.find((i) => i.id === id)?.nombre ?? ''
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
