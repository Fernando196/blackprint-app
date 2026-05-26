import type { ComputedRef, Ref } from 'vue'
import type { TablaRow, TablaFiltros } from '~/types/tabla'

type TablaApiResponse = {
  total: number
  pagina: number
  limite: number
  datos: TablaRow[]
}

export function useTabla(): {
  rows: ComputedRef<TablaRow[]>
  total: ComputedRef<number>
  isLoading: Ref<boolean>
  hasError: ComputedRef<boolean>
  pagina: Ref<number>
  limite: Ref<number>
  aplicarFiltros: (f: TablaFiltros) => void
  cambiarPagina: (n: number) => void
  limpiarFiltros: () => void
} {
  const filtros = ref<TablaFiltros>({
    tipo: '',
    clase: '',
    entidad: '',
    valorMin: null,
    valorMax: null,
    banco: '',
    grupo: '',
  })

  const pagina = ref(1)
  const limite = ref(50)

  watch(limite, () => {
    pagina.value = 1
  })

  const query = computed(() => ({
    ...(filtros.value.tipo && { tipo: filtros.value.tipo }),
    ...(filtros.value.clase && { clase: filtros.value.clase }),
    ...(filtros.value.entidad && { entidad: filtros.value.entidad }),
    ...(filtros.value.valorMin !== null && { valorMin: filtros.value.valorMin }),
    ...(filtros.value.valorMax !== null && { valorMax: filtros.value.valorMax }),
    ...(filtros.value.banco !== null && { banco: filtros.value.banco }),
    ...(filtros.value.grupo !== null && { grupo: filtros.value.grupo }),
    pagina: pagina.value,
    limite: limite.value,
  }))

  const { data, pending, error } = useFetch<TablaApiResponse>('/api/tabla', {
    query,
    lazy: true,
  })

  const rows = computed<TablaRow[]>(() => data.value?.datos ?? [])
  const total = computed<number>(() => data.value?.total ?? 0)
  const hasError = computed<boolean>(() => !!error.value)

  function aplicarFiltros(f: TablaFiltros): void {
    filtros.value = { ...f }
    pagina.value = 1
  }

  function cambiarPagina(n: number): void {
    pagina.value = n
  }

  function limpiarFiltros(): void {
    filtros.value = {
      tipo: '',
      clase: '',
      entidad: '',
      valorMin: null,
      valorMax: null,
      banco: '',
      grupo: '',
    }
    pagina.value = 1
  }

  return {
    rows,
    total,
    isLoading: pending,
    hasError,
    pagina,
    limite,
    aplicarFiltros,
    cambiarPagina,
    limpiarFiltros,
  }
}
