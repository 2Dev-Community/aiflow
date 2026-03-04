<script setup lang="ts">
import type {
  WorkflowNode,
  NodeDefinition,
  ConfigField,
} from "~/types/workflow";

interface Props {
  node: WorkflowNode | null;
  definition: NodeDefinition | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  updateNode: [
    payload: {
      nodeId: string;
      label?: string;
      config?: Record<string, unknown>;
    },
  ];
  close: [];
}>();

const localLabel = ref("");
const localConfig = ref<Record<string, unknown>>({});

watch(
  () => props.node,
  (n) => {
    if (!n) return;
    localLabel.value = n.label;
    localConfig.value = { ...n.config };
  },
  { immediate: true },
);

function save() {
  if (!props.node) return;
  emit("updateNode", {
    nodeId: props.node.id,
    label: localLabel.value,
    config: { ...localConfig.value },
  });
}

const categoryColors: Record<string, string> = {
  trigger: "var(--color-primary-500)",
  action: "#0ea5e9",
  logic: "#ef4444",
  output: "#10b981",
};

// Build USelect-compatible items from field.options
function getSelectItems(field: ConfigField) {
  return (field.options ?? []).map((opt) => ({
    label: opt.label,
    value: opt.value,
  }));
}
</script>

<template>
  <!-- Inspector panel when a node is selected -->
  <aside
    v-if="node && definition"
    class="w-[260px] min-w-[220px] flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-hidden"
  >
    <!-- Header -->
    <div
      class="flex items-center gap-[10px] p-3 border-b border-slate-200 dark:border-slate-800"
    >
      <div
        class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        :style="{
          background:
            (categoryColors[definition.category] ??
              'var(--color-primary-500)') + '22',
        }"
      >
        <UIcon
          :name="definition.icon"
          class="text-base"
          :style="{
            color:
              categoryColors[definition.category] ?? 'var(--color-primary-500)',
          }"
        />
      </div>
      <div class="flex-1 min-w-0 flex flex-col gap-[1px]">
        <span
          class="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500"
        >
          {{ definition.category }}
        </span>
        <span
          class="text-[13px] font-semibold text-slate-900 dark:text-slate-100 truncate"
        >
          {{ definition.label }}
        </span>
      </div>
      <UButton
        icon="i-lucide-panel-right-close"
        variant="ghost"
        color="neutral"
        size="xs"
        class="opacity-50 hover:opacity-100"
        @click="emit('close')"
      />
    </div>

    <div
      class="flex-1 overflow-y-auto p-[14px_12px] flex flex-col gap-[14px] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent"
    >
      <!-- Node Label -->
      <div class="flex flex-col gap-[5px]">
        <label
          class="text-[11px] font-semibold text-[var(--wf-text-muted)] uppercase tracking-[0.05em]"
        >
          Node Label
        </label>
        <UInput
          v-model="localLabel"
          size="sm"
          placeholder="Node label…"
          @update:model-value="save"
        />
      </div>

      <div
        v-if="definition.configSchema.length > 0"
        class="border-none border-t border-slate-200 dark:border-slate-800"
      />

      <!-- Dynamic config fields -->
      <div
        v-for="field in definition.configSchema"
        :key="field.key"
        class="flex flex-col gap-[5px]"
      >
        <label
          class="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-[0.05em]"
        >
          {{ field.label }}
          <span v-if="field.required" class="text-[#f87171] ml-0.5">*</span>
        </label>

        <!-- Toggle -->
        <div
          v-if="field.type === 'toggle'"
          class="flex items-center gap-[10px]"
        >
          <USwitch
            v-model="localConfig[field.key] as boolean"
            color="primary"
            size="sm"
            @update:model-value="save"
          />
          <span class="text-[12px] text-slate-600 dark:text-slate-400">
            {{ localConfig[field.key] ? "Enabled" : "Disabled" }}
          </span>
        </div>

        <!-- Select -->
        <USelect
          v-else-if="field.type === 'select'"
          v-model="localConfig[field.key] as string"
          :items="getSelectItems(field)"
          size="sm"
          @update:model-value="save"
        />

        <!-- Textarea / Code / Cron -->
        <UTextarea
          v-else-if="['textarea', 'code', 'cron'].includes(field.type)"
          v-model="localConfig[field.key] as string"
          size="sm"
          :textarea-class="field.type === 'code' ? 'font-mono text-[11px]' : ''"
          :placeholder="field.placeholder ?? ''"
          :rows="4"
          @update:model-value="save"
        />

        <!-- Number -->
        <UInput
          v-else-if="field.type === 'number'"
          v-model.number="localConfig[field.key] as any"
          type="number"
          size="sm"
          @update:model-value="save"
        />

        <!-- Text (default) -->
        <UInput
          v-else
          v-model="localConfig[field.key] as string"
          type="text"
          size="sm"
          :placeholder="field.placeholder ?? ''"
          @update:model-value="save"
        />

        <!-- Description -->
        <p
          v-if="field.description"
          class="text-[10px] text-slate-400 dark:text-slate-500 leading-[1.4] mt-0.5"
        >
          {{ field.description }}
        </p>
      </div>

      <!-- No config message -->
      <div
        v-if="definition.configSchema.length === 0"
        class="flex flex-col items-center p-[24px_0] text-[12px] text-slate-400 dark:text-slate-500"
      >
        <UIcon name="i-lucide-settings-2" class="text-2xl opacity-20 mb-2" />
        <p>This node has no configuration.</p>
      </div>
    </div>
  </aside>

  <!-- Empty state when no node selected -->
  <aside
    v-else
    class="w-[260px] min-w-[220px] flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-hidden items-center justify-center"
  >
    <div class="flex flex-col items-center p-6">
      <UIcon name="i-lucide-mouse-pointer-2" class="text-3xl opacity-20 mb-3" />
      <p class="text-[13px] text-slate-400 dark:text-slate-500 text-center">
        Click a node to configure it
      </p>
    </div>
  </aside>
</template>

<style scoped></style>
