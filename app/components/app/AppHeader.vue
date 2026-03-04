<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return (colorMode as any).value === "dark";
  },
  set() {
    (colorMode as any).preference =
      (colorMode as any).value === "dark" ? "light" : "dark";
  },
});
</script>

<template>
  <header
    class="sticky top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-black/[0.08] dark:border-white/[0.08] z-50 flex items-center"
  >
    <div
      class="w-full max-w-[1400px] mx-auto px-6 flex items-center justify-between"
    >
      <!-- Left side: Logo & Nav -->
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="no-underline flex items-center">
          <span
            class="text-[20px] font-[800] tracking-[-0.02em] text-slate-900 dark:text-slate-100"
          >
            Chansy AI
          </span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-2">
          <NuxtLink
            to="/#features"
            class="px-3 py-2 text-[14px] font-medium text-slate-500 dark:text-slate-400 no-underline rounded-lg transition-all duration-200 hover:bg-primary-500/10 hover:text-primary-500"
          >
            Features
          </NuxtLink>
          <NuxtLink
            to="/#ai-intel"
            class="px-3 py-2 text-[14px] font-medium text-slate-500 dark:text-slate-400 no-underline rounded-lg transition-all duration-200 hover:bg-primary-500/10 hover:text-primary-500"
          >
            AI Intelligence
          </NuxtLink>
          <NuxtLink
            to="/#templates"
            class="px-3 py-2 text-[14px] font-medium text-slate-500 dark:text-slate-400 no-underline rounded-lg transition-all duration-200 hover:bg-primary-500/10 hover:text-primary-500"
          >
            Templates
          </NuxtLink>
        </nav>
      </div>

      <!-- Right side: Actions -->
      <div class="flex items-center gap-6">
        <NuxtLink
          to="/workflow"
          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-[14px] font-[600] no-underline rounded-[9px] transition-all duration-200 shadow-primary-600/25 hover:bg-primary-700 hover:-translate-y-[1px] hover:shadow-primary-600/35"
        >
          <UIcon name="i-lucide-workflow" class="w-4 h-4 mr-2" />
          <span>Workflows</span>
        </NuxtLink>

        <AppThemeToggle />
      </div>
    </div>
  </header>
</template>

<style scoped></style>
