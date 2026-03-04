<template>
  <!-- <button
    class="flex items-center justify-center w-[34px] h-[34px] rounded-[10px] border border-black/[0.08] dark:border-white/[0.08] text-slate-500 dark:text-slate-400 bg-transparent cursor-pointer transition-all duration-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-slate-50"
    aria-label="Toggle Theme"
    @click="isDark = !isDark"
  >
    <UIcon :name="isDark ? 'i-lucide-moon' : 'i-lucide-sun'" class="w-5 h-5" />
  </button> -->
  <!-- <UButton
    :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
    aria-label="Toggle Theme"
    @click="isDark = !isDark"
  /> -->
</template>

<script setup>
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
</script>

<style scoped></style>
