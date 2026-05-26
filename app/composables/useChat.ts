import type { Ref } from 'vue'

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

export function useChat(): UseChatReturn {
  const messages = ref<ChatMessage[]>([])
  const isLoading = ref(false)
  const isOpen = ref(false)

  const BIENVENIDA: ChatMessage = {
    role: 'assistant',
    content:
      'Hola. Soy el asistente inmobiliario de BlackPrint. Puedo responder preguntas sobre el dataset de avalúos hipotecarios de México de septiembre 2024 — valores, distribución por tipo, estados con mayor actividad, y más. ¿En qué puedo ayudarte?',
    timestamp: Date.now(),
  }

  function toggleChat(): void {
    isOpen.value = !isOpen.value
    if (isOpen.value && messages.value.length === 0) {
      messages.value = [BIENVENIDA]
    }
  }

  async function sendMessage(text: string): Promise<void> {
    const trimmed = text.trim()
    if (!trimmed || isLoading.value) return

    messages.value.push({ role: 'user', content: trimmed, timestamp: Date.now() })
    isLoading.value = true

    try {
      const { response } = await $fetch<{ response: string }>('/api/chat', {
        method: 'POST',
        body: { message: trimmed },
      })
      messages.value.push({ role: 'assistant', content: response, timestamp: Date.now() })
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
