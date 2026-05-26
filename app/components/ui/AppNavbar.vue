<template>
  <header
    class="border-border bg-bg fixed inset-x-0 top-0 z-[900] flex h-[72px] items-center border-b"
  >
    <div class="flex w-full items-center gap-(--s-4) px-(--s-7)">
      <img src="/images/logo-light.png" alt="BlackPrint" class="h-7 w-auto shrink-0" />
      <span class="text-fg-muted font-sans text-sm font-medium tracking-[-0.01em]">
        Avalúos Hipotecarios
      </span>

      <nav class="ml-auto flex items-center gap-1">
        <NuxtLink
          to="/"
          class="text-fg-muted hover:text-fg rounded-full px-(--s-4) py-[6px] font-sans text-sm font-medium transition-colors"
          exact-active-class="bg-surface-raised text-fg"
        >
          Dashboard
        </NuxtLink>
        <NuxtLink
          to="/tabla"
          class="text-fg-muted hover:text-fg rounded-full px-(--s-4) py-[6px] font-sans text-sm font-medium transition-colors"
          active-class="bg-surface-raised text-fg"
        >
          Tabla
        </NuxtLink>
        <NuxtLink
          to="/rankings"
          class="text-fg-muted hover:text-fg rounded-full px-(--s-4) py-[6px] font-sans text-sm font-medium transition-colors"
          active-class="bg-surface-raised text-fg"
        >
          Rankings
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
