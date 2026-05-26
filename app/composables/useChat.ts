import type { Ref } from 'vue'
import type { FiltrosAplicados } from '~/types/filters'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface UseChatReturn {
  messages: Ref<ChatMessage[]>
  isLoading: Ref<boolean>
  isOpen: Ref<boolean>
  sendMessage: (text: string) => Promise<void>
  toggleChat: () => void
}

interface ChatResponse {
  response: string
  filtrosAplicados?: FiltrosAplicados
  limpiar?: boolean
}

export function useChat(): UseChatReturn {
  const messages = ref<ChatMessage[]>([])
  const isLoading = ref(false)
  const isOpen = ref(false)
  const filterStore = useFilterStore()
  const dataStore = useDataStore()

  const BIENVENIDA: ChatMessage = {
    role: 'assistant',
    content:
      'Hola. Soy el asistente inmobiliario de BlackPrint. Puedo responder preguntas sobre el dataset de avalúos hipotecarios de México de septiembre 2024 — valores, distribución por tipo, estados con mayor actividad, y más. También puedo aplicar filtros directamente en la app si me lo pides.',
    timestamp: Date.now(),
  }

  function toggleChat(): void {
    isOpen.value = !isOpen.value
    if (isOpen.value && messages.value.length === 0) {
      messages.value = [BIENVENIDA]
    }
  }

  function aplicarFiltrosEnStore(filtros: FiltrosAplicados): void {
    filterStore.onChangeFilters({
      ...filterStore.filters,
      tipo: filtros.tipo != null ? String(filtros.tipo) : '',
      clase: filtros.clase != null ? String(filtros.clase) : '',
      entidad: filtros.entidad != null ? String(filtros.entidad) : null,
      valorMin: filtros.valorMin ?? null,
      valorMax: filtros.valorMax ?? null,
    })
  }

  async function sendMessage(text: string): Promise<void> {
    const trimmed = text.trim()
    if (!trimmed || isLoading.value) return

    messages.value.push({ role: 'user', content: trimmed, timestamp: Date.now() })
    isLoading.value = true

    const { tipo, clase, entidad, valorMin, valorMax, banco } = filterStore.filters
    const filtros = {
      tipo: tipo || null,
      clase: clase || null,
      entidad: entidad || null,
      valorMin: valorMin ?? null,
      valorMax: valorMax ?? null,
      banco: banco || null,
      totalVisible: dataStore.mapaFiltrado.length,
    }

    try {
      const data = await $fetch<ChatResponse>('/api/chat', {
        method: 'POST',
        body: { message: trimmed, filtros },
      })

      if (data.limpiar) {
        filterStore.onCleanFilters()
      } else if (data.filtrosAplicados) {
        aplicarFiltrosEnStore(data.filtrosAplicados)
      }

      messages.value.push({ role: 'assistant', content: data.response, timestamp: Date.now() })
    } catch {
      messages.value.push({
        role: 'assistant',
        content: 'Ocurrió un error al procesar tu consulta. Intenta de nuevo.',
        timestamp: Date.now(),
      })
    } finally {
      isLoading.value = false
    }
  }

  return { messages, isLoading, isOpen, sendMessage, toggleChat }
}
