<template>
  <div class="min-h-screen bg-bg text-fg">
    <header class="fixed inset-x-0 top-0 z-[900] flex h-[72px] items-center border-b border-border bg-bg">
      <div class="flex w-full items-center gap-(--s-4) px-(--s-7)">
        <img src="/images/logo-light.png" alt="BlackPrint" class="h-7 w-auto shrink-0" />
        <span class="font-sans text-sm font-medium tracking-[-0.01em] text-fg-muted">
          Avalúos Hipotecarios
        </span>

        <nav class="ml-auto flex items-center gap-1">
          <NuxtLink
            to="/"
            class="rounded-full px-(--s-4) py-[6px] font-sans text-sm font-medium text-fg-muted transition-colors hover:text-fg"
            exact-active-class="bg-surface-raised text-fg"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/mapa"
            class="rounded-full px-(--s-4) py-[6px] font-sans text-sm font-medium text-fg-muted transition-colors hover:text-fg"
            active-class="bg-surface-raised text-fg"
          >
            Mapa
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="pt-[72px]">
      <slot />
    </main>
  </div>
</template>
