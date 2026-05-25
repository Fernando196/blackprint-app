export const CAT_VIGILANCIA = [
  { id: 0, nombre: 'NO APLICA' },
  { id: 1, nombre: 'MUNICIPAL' },
  { id: 2, nombre: 'AUTÓNOMA PRIVADA' },
  { id: 3, nombre: 'NO EXISTE' },
]

export const CAT_TELEFONO_SUMINISTRO = [
  { id: 0, nombre: 'NO APLICA' },
  { id: 1, nombre: 'RED ÁEREA' },
  { id: 2, nombre: 'RED SUBTERRANEA' },
]

export const CAT_RED_DISTRIBUCION = [
  { id: 0, nombre: 'NO APLICA' },
  { id: 1, nombre: 'CON SUMINISTRO AL INMUEBLE' },
  { id: 2, nombre: 'SIN SUMINISTRO AL INMUEBLE' },
]

export const CAT_SUMINISTRO = [
  { id: 0, nombre: 'NO APLICA' },
  { id: 1, nombre: 'EXISTE' },
  { id: 2, nombre: 'NO EXISTE' },
]

export const CAT_REF_PROXIMIDAD = [
  { id: 1, nombre: 'CENTRICA' },
  { id: 2, nombre: 'INTERMEDIA' },
  { id: 3, nombre: 'PERIFERICA' },
  { id: 4, nombre: 'DE EXPANSIÓN' },
  { id: 5, nombre: 'RURAL' },
]

export const CAT_NIVEL_EQUIPAMIENTO = [
  { id: 1, nombre: 'CUANDO EN LA ZONA EXISTAN DOS ELEMENTOS O MENOS DEL NIVEL 2.' },
  {
    id: 2,
    nombre:
      'CUANDO LA ZONA CUENTE CON IGLESIA, MERCADO O COMERCIOS, ESCUELAS Y PARQUES Y JARDINES.',
  },
  {
    id: 3,
    nombre:
      'CUANDO LA ZONA TENGA LOS ELEMENTOS DEL NIVEL 2 MÁS ACCESO O ESTACIÓN DE TRANSPORTE PÚBLICO',
  },
  {
    id: 4,
    nombre:
      'CUANDO EN LA ZONA SE ENCUENTREN LOS ELEMENTOS DEL NIVEL 3 MÁS HOSPITALES Y BANCOS, MÁS OTROS EQUIPAMIENTOS',
  },
]

export const CAT_VIALIDADES = [
  { id: 0, nombre: 'NO APLICA' },
  { id: 1, nombre: 'TERRACERIA' },
  { id: 2, nombre: 'ASFALTO' },
  { id: 3, nombre: 'CONCRETO' },
  { id: 4, nombre: 'EMPEDRADO' },
  { id: 5, nombre: 'ADOQUIN' },
  { id: 6, nombre: 'OTRO' },
  { id: 7, nombre: 'NO EXISTE' },
  { id: 8, nombre: 'PAVIMENTACIÓN PERMEABLE' },
]

export const CAT_GUARNICIONES = [
  { id: 0, nombre: 'NO APLICA' },
  { id: 1, nombre: 'CONCRETO' },
  { id: 2, nombre: 'OTRO' },
  { id: 3, nombre: 'NO EXISTE' },
]

export const CAT_BANQUETAS = [
  { id: 0, nombre: 'NO APLICA' },
  { id: 1, nombre: 'CONCRETO' },
  { id: 2, nombre: 'EMPEDRADO' },
  { id: 3, nombre: 'ADOQUIN' },
  { id: 4, nombre: 'OTRO' },
  { id: 5, nombre: 'NO EXISTE' },
]

export const CAT_ESTADO_CONSERVACION = [
  { id: 0, nombre: 'NO APLICA' },
  { id: 1, nombre: 'RUINOSO' },
  { id: 2, nombre: 'MALO' },
  { id: 3, nombre: 'REGULAR' },
  { id: 4, nombre: 'BUENO' },
  { id: 5, nombre: 'MUY BUENO' },
  { id: 6, nombre: 'NUEVO' },
  { id: 7, nombre: 'RECIENTEMENTE REMODELADO' },
]

export const CAT_CLASES_CONSTRUCCION = [
  { id: 0, nombre: 'NO APLICA' },
  { id: 1, nombre: 'Mínima' },
  { id: 2, nombre: 'Económica' },
  { id: 3, nombre: 'Interés Social' },
  { id: 4, nombre: 'Media' },
  { id: 5, nombre: 'Semilujo' },
  { id: 6, nombre: 'Residencial' },
  { id: 7, nombre: 'Residencial Plus' },
  { id: 7.1, nombre: 'Residencial Plus +' }, // Nota: Se ajustó el ID para evitar duplicado con el 7 anterior
  { id: 8, nombre: 'Única' },
]

export const CAT_ALUMBRADO_PUBLICO = [
  { id: 0, nombre: 'NO APLICA' },
  { id: 1, nombre: 'SIN ALUMBRADO' },
  { id: 2, nombre: 'ÁEREO' },
  { id: 3, nombre: 'SUBTERRANEO' },
]

export const CAT_CALIDAD_PROYECTO = [
  { id: 0, nombre: 'NO APLICA' },
  { id: 1, nombre: 'FUNCIONAL' },
  { id: 2, nombre: 'NO FUNCIONAL' },
  { id: 3, nombre: 'ADECUADO A SU EPOCA' },
]

export const CAT_TIPO_INMUEBLE = [
  { id: 1, nombre: 'TERRENO' },
  { id: 2, nombre: 'CASA HABITACIÓN' },
  { id: 3, nombre: 'CASA EN CONDOMINIO' },
  { id: 4, nombre: 'DEPARTAMENTO EN CONDOMINIO' },
  { id: 5, nombre: 'OTRO' },
  { id: 6, nombre: 'VIVIENDA MULTIPLE' },
]
