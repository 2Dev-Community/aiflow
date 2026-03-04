<script setup lang="ts">
interface Props {
  workflowName: string;
  isSaving?: boolean;
  isRunning?: boolean;
  zoomPercent?: number;
}

const props = withDefaults(defineProps<Props>(), {
  isSaving: false,
  isRunning: false,
  zoomPercent: 100,
});

const emit = defineEmits<{
  save: [];
  run: [];
  zoomIn: [];
  zoomOut: [];
  resetView: [];
  updateName: [name: string];
  back: [];
}>();

const isEditingName = ref(false);
const localName = ref(props.workflowName);

watch(
  () => props.workflowName,
  (v) => {
    localName.value = v;
  },
);

function commitName() {
  isEditingName.value = false;
  emit("updateName", localName.value || "Untitled Workflow");
}
</script>

<template>
  <header
    class="flex items-center justify-between px-3 h-[52px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 gap-3 shrink-0 z-10"
  >
    <!-- Left: brand + back + name -->
    <div class="flex items-center gap-1.5 flex-1">
      <NuxtLink
        to="/"
        class="no-underline flex items-center transition-opacity duration-150 px-1 hover:opacity-80"
        title="Go to home"
      >
        <span
          class="text-[14px] font-[800] tracking-[-0.02em] whitespace-nowrap text-primary-500 dark:text-primary-400"
        >
          Chansy AI
        </span>
      </NuxtLink>

      <div class="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 shrink-0" />

      <UButton
        icon="i-lucide-arrow-left"
        variant="ghost"
        size="sm"
        color="neutral"
        title="Back to workflows"
        @click="emit('back')"
      />

      <div class="w-[1px] h-5 bg-slate-200 dark:bg-slate-800 shrink-0" />

      <div class="flex items-center">
        <UInput
          v-if="isEditingName"
          v-model="localName"
          size="sm"
          autofocus
          placeholder="Workflow name…"
          class="min-w-[160px]"
          :ui="{ base: 'font-semibold' }"
          @blur="commitName"
          @keydown.enter="commitName"
          @keydown.escape="isEditingName = false"
        />
        <UButton
          v-else
          variant="ghost"
          color="neutral"
          size="sm"
          leading-icon="i-lucide-workflow"
          trailing-icon="i-lucide-pencil"
          class="group"
          :ui="{
            trailingIcon:
              'opacity-0 group-hover:opacity-40 text-xs transition-opacity',
            leadingIcon: 'text-primary-500',
            label: 'font-semibold max-w-[180px] truncate',
          }"
          title="Click to rename"
          @click="isEditingName = true"
        >
          {{ workflowName }}
        </UButton>
      </div>
    </div>

    <!-- Center: zoom controls -->
    <div class="flex items-center gap-1.5 shrink-0">
      <div
        class="flex items-center bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"
      >
        <UButton
          icon="i-lucide-minus"
          variant="ghost"
          color="neutral"
          size="xs"
          title="Zoom out"
          :ui="{ base: 'rounded-none' }"
          @click="emit('zoomOut')"
        />
        <button
          class="min-w-[46px] text-center text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-none border-none border-l border-r border-slate-200 dark:border-slate-800 cursor-pointer px-1.5 leading-[30px] transition-colors duration-150 hover:text-slate-900 dark:hover:text-slate-100"
          title="Reset zoom"
          @click="emit('resetView')"
        >
          {{ zoomPercent }}%
        </button>
        <UButton
          icon="i-lucide-plus"
          variant="ghost"
          color="neutral"
          size="xs"
          title="Zoom in"
          :ui="{ base: 'rounded-none' }"
          @click="emit('zoomIn')"
        />
      </div>
    </div>

    <!-- Right: actions -->
    <div class="flex items-center justify-end gap-1.5 flex-1">
      <AppThemeToggle />

      <UButton
        :icon="isSaving ? 'i-lucide-loader-2' : 'i-lucide-save'"
        variant="outline"
        color="neutral"
        size="sm"
        title="Save workflow"
        @click="emit('save')"
      >
        Save
      </UButton>

      <UButton
        :icon="isRunning ? 'i-lucide-loader-2' : 'i-lucide-play'"
        :loading="isRunning"
        color="primary"
        variant="solid"
        size="sm"
        title="Run workflow"
        @click="emit('run')"
      >
        {{ isRunning ? "Running..." : "Run" }}
      </UButton>
    </div>
  </header>
</template>

<style scoped></style>
