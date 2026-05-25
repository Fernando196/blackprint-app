import { CAT_ESTADOS } from '~/data/catalogs.estados'
import { CAT_MUNICIPIOS } from '~/data/catalogs.municipios'
import {
  CAT_VIGILANCIA,
  CAT_TELEFONO_SUMINISTRO,
  CAT_RED_DISTRIBUCION,
  CAT_SUMINISTRO,
  CAT_REF_PROXIMIDAD,
  CAT_NIVEL_EQUIPAMIENTO,
  CAT_VIALIDADES,
  CAT_GUARNICIONES,
  CAT_BANQUETAS,
  CAT_ESTADO_CONSERVACION,
  CAT_CLASES_CONSTRUCCION,
  CAT_ALUMBRADO_PUBLICO,
  CAT_CALIDAD_PROYECTO,
  CAT_TIPO_INMUEBLE,
} from '../data/catalogs.blackprint'
import type {
  Vigilancia,
  TelefonoSuministro,
  RedDistribucion,
  Suministro,
  RefProximidad,
  NivelEquipamiento,
  Vialidades,
  Guarniciones,
  Banquetas,
  EstadoConservacion,
  ClasesConstruccion,
  AlumbradoPublico,
  CalidadProyecto,
  TipoInmueble,
  Estado,
  Municipio,
} from '../types/catalogos'

export const useCatalogStore = defineStore('catalog', () => {
  const estados = ref<Estado[]>(CAT_ESTADOS)
  const municipios = ref<Municipio[]>(CAT_MUNICIPIOS)
  const vigilancias = ref<Vigilancia[]>(CAT_VIGILANCIA)
  const telefonosSuministro = ref<TelefonoSuministro[]>(CAT_TELEFONO_SUMINISTRO)
  const redesDistribucion = ref<RedDistribucion[]>(CAT_RED_DISTRIBUCION)
  const suministros = ref<Suministro[]>(CAT_SUMINISTRO)
  const referenciasProximidad = ref<RefProximidad[]>(CAT_REF_PROXIMIDAD)
  const nivelesEquipamiento = ref<NivelEquipamiento[]>(CAT_NIVEL_EQUIPAMIENTO)
  const vialidades = ref<Vialidades[]>(CAT_VIALIDADES)
  const guarniciones = ref<Guarniciones[]>(CAT_GUARNICIONES)
  const banquetas = ref<Banquetas[]>(CAT_BANQUETAS)
  const estadosConservacion = ref<EstadoConservacion[]>(CAT_ESTADO_CONSERVACION)
  const clasesConstruccion = ref<ClasesConstruccion[]>(CAT_CLASES_CONSTRUCCION)
  const alumbradosPublicos = ref<AlumbradoPublico[]>(CAT_ALUMBRADO_PUBLICO)
  const calidadesProyecto = ref<CalidadProyecto[]>(CAT_CALIDAD_PROYECTO)
  const tiposInmueble = ref<TipoInmueble[]>(CAT_TIPO_INMUEBLE)

  return {
    estados,
    municipios,
    vigilancias,
    telefonosSuministro,
    redesDistribucion,
    suministros,
    referenciasProximidad,
    nivelesEquipamiento,
    vialidades,
    guarniciones,
    banquetas,
    estadosConservacion,
    clasesConstruccion,
    alumbradosPublicos,
    calidadesProyecto,
    tiposInmueble,
  }
})
