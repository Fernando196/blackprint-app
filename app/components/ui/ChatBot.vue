<script setup lang="ts">
import { nextTick } from 'vue'
import { useChat } from '~/composables/useChat'

const { messages, isLoading, isOpen, sendMessage, toggleChat } = useChat()

const inputText = ref('')
const messagesEl = ref<HTMLElement | null>(null)

async function handleSend(): Promise<void> {
  if (!inputText.value.trim()) return
  const text = inputText.value
  inputText.value = ''
  await sendMessage(text)
  await nextTick()
  scrollToBottom()
}

function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function scrollToBottom(): void {
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

watch(messages, async () => {
  await nextTick()
  scrollToBottom()
}, { deep: true })
</script>

<template>
  <!-- Floating button -->
  <button
    class="fixed bottom-6 left-[284px] z-[1000] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--blue-p)] shadow-[var(--shadow-4)] transition-transform hover:scale-105 active:scale-95"
    aria-label="Abrir asistente inmobiliario"
    @click="toggleChat"
  >
    <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>

  <!-- Chat panel -->
  <Transition name="chat-panel">
    <div
      v-if="isOpen"
      class="fixed bottom-24 left-[284px] z-[999] flex w-[380px] flex-col overflow-hidden rounded-[var(--r-xl)] bg-[var(--depth-8)] shadow-[var(--shadow-4)]"
      style="max-height: calc(100vh - 140px); border-left: 1px solid var(--depth-7);"
    >
      <!-- Header -->
      <div class="flex items-center gap-3 border-b border-[var(--depth-7)] px-5 py-4">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--blue-p)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div>
          <p class="font-sans text-sm font-semibold text-[var(--depth-1)]">Asistente Inmobiliario</p>
          <p class="font-sans text-xs text-[var(--depth-4)]">Avalúos hipotecarios · Sep 2024</p>
        </div>
        <button
          class="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-[var(--depth-4)] transition-colors hover:bg-[var(--depth-7)] hover:text-[var(--depth-1)]"
          @click="toggleChat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- Messages -->
      <div ref="messagesEl" class="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4" style="min-height: 320px; max-height: 420px;">
        <div
          v-for="msg in messages"
          :key="msg.timestamp"
          :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'"
        >
          <div
            :class="[
              'max-w-[85%] rounded-2xl px-4 py-2.5 font-sans text-sm leading-relaxed',
              msg.role === 'user'
                ? 'rounded-br-sm bg-[var(--blue-p)] text-white'
                : 'rounded-bl-sm bg-[var(--depth-7)] text-[var(--depth-2)]',
            ]"
          >
            <template v-if="msg.role === 'user'">{{ msg.content }}</template>
            <span v-else v-html="msg.content.replace(/\n/g, '<br>')" />
          </div>
        </div>

        <!-- Skeleton loader -->
        <div v-if="isLoading" class="flex justify-start">
          <div class="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-[var(--depth-7)] px-4 py-3">
            <span class="h-2 w-2 animate-bounce rounded-full bg-[var(--depth-5)]" style="animation-delay: 0ms" />
            <span class="h-2 w-2 animate-bounce rounded-full bg-[var(--depth-5)]" style="animation-delay: 120ms" />
            <span class="h-2 w-2 animate-bounce rounded-full bg-[var(--depth-5)]" style="animation-delay: 240ms" />
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="border-t border-[var(--depth-7)] px-4 py-3">
        <div class="flex items-center gap-2 rounded-full bg-[var(--depth-7)] px-4 py-2">
          <input
            v-model="inputText"
            type="text"
            placeholder="Escribe tu pregunta..."
            class="flex-1 bg-transparent font-sans text-sm text-[var(--depth-1)] placeholder:text-[var(--depth-5)] focus:outline-none"
            :disabled="isLoading"
            @keydown="handleKeydown"
          />
          <button
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--blue-p)] text-white transition-opacity disabled:opacity-40"
            :disabled="isLoading || !inputText.trim()"
            @click="handleSend"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.chat-panel-enter-active,
.chat-panel-leave-active {
  transition: opacity 150ms ease-out, transform 150ms ease-out;
}
.chat-panel-enter-from,
.chat-panel-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
