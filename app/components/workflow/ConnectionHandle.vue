<script setup lang="ts">
import type { PortDef } from "~/types/workflow";

interface Props {
  port: PortDef;
  nodeId: string;
  canvasScale?: number;
}

const props = withDefaults(defineProps<Props>(), {
  canvasScale: 1,
});

const emit = defineEmits<{
  startConnection: [
    payload: {
      nodeId: string;
      portId: string;
      portDirection: "input" | "output";
      el: HTMLElement;
    },
  ];
  endConnection: [payload: { nodeId: string; portId: string }];
}>();

const handleEl = ref<HTMLElement | null>(null);
const isHovered = ref(false);

function onMouseDown(e: MouseEvent) {
  if (props.port.direction !== "output") return;
  e.stopPropagation();
  emit("startConnection", {
    nodeId: props.nodeId,
    portId: props.port.id,
    portDirection: props.port.direction,
    el: handleEl.value!,
  });
}

function onMouseUp(e: MouseEvent) {
  if (props.port.direction !== "input") return;
  e.stopPropagation();
  emit("endConnection", { nodeId: props.nodeId, portId: props.port.id });
}
</script>

<template>
  <div
    class="relative flex items-center gap-[5px] cursor-crosshair select-none"
    :class="[
      port.direction === 'input'
        ? 'flex-row justify-start'
        : 'flex-row-reverse justify-start',
    ]"
    :data-port-id="port.id"
    :data-direction="port.direction"
    :title="port.label"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
  >
    <div
      ref="handleEl"
      class="w-3 h-3 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform shrink-0"
      :class="{
        'bg-[var(--color-primary-500)] !border-[var(--color-primary-400)] scale-[1.3] shadow-[0_0_0_2px_rgba(var(--color-primary-500-rgb),0.2)]':
          isHovered,
      }"
    />
    <span
      class="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap"
    >
      {{ port.label }}
    </span>
  </div>
</template>

<style scoped></style>
