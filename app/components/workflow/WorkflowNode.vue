<script setup lang="ts">
import type { WorkflowNode, NodeDefinition } from "~/types/workflow";
import ConnectionHandle from "~/components/workflow/ConnectionHandle.vue";

interface Props {
  node: WorkflowNode;
  definition: NodeDefinition;
  selected: boolean;
  dragging?: boolean;
  localPos?: { x: number; y: number } | null;
  canvasScale?: number;
}

const props = withDefaults(defineProps<Props>(), {
  canvasScale: 1,
  dragging: false,
  localPos: null,
});

const emit = defineEmits<{
  select: [nodeId: string];
  delete: [nodeId: string];
  dragStart: [payload: { nodeId: string; offsetX: number; offsetY: number }];
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

const inputPorts = computed(() =>
  props.definition.ports.filter((p) => p.direction === "input"),
);
const outputPorts = computed(() =>
  props.definition.ports.filter((p) => p.direction === "output"),
);

// Category -> gradient stops
const categoryGradients: Record<string, [string, string]> = {
  trigger: ["var(--color-primary-600)", "var(--color-primary-500)"],
  action: ["#0284c7", "#0ea5e9"],
  logic: ["#dc2626", "#ef4444"],
  output: ["#059669", "#10b981"],
};

const headerStyle = computed(() => {
  const [from, to] = categoryGradients[props.definition.category] ?? [
    "#475569",
    "#64748b",
  ];
  return {
    background: `linear-gradient(135deg, ${from}, ${to})`,
  };
});

function onMouseDown(e: MouseEvent) {
  if ((e.target as HTMLElement).closest(".connection-handle")) return;
  e.stopPropagation();
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  emit("dragStart", {
    nodeId: props.node.id,
    offsetX: (e.clientX - rect.left) / props.canvasScale,
    offsetY: (e.clientY - rect.top) / props.canvasScale,
  });
  emit("select", props.node.id);
}
// Use localPos (lag-free) when dragging, otherwise fall back to node.position
const displayPos = computed(() => props.localPos ?? props.node.position);

// Computed style for the node container — use inline style for guaranteed z-index.
const nodeStyle = computed(() => ({
  transform: `translate3d(${displayPos.value.x}px, ${displayPos.value.y}px, 0)${
    props.dragging ? " scale(1.025)" : ""
  }`,
  zIndex: props.dragging ? 999 : props.selected ? 50 : 10,
  boxShadow: props.dragging
    ? "0 20px 60px rgba(0,0,0,0.2)"
    : props.selected
      ? "0 0 0 2px var(--color-primary-500)"
      : undefined,
}));
</script>

<template>
  <div
    class="absolute min-w-[190px] rounded-lg overflow-hidden bg-white dark:bg-slate-800 border-[1.5px] cursor-grab select-none"
    :class="[
      props.dragging
        ? 'transition-none border-primary-400'
        : 'transition-[border-color,box-shadow] duration-200 border-slate-200 dark:border-slate-700',
      props.selected && !props.dragging ? 'border-primary-500' : '',
    ]"
    :style="nodeStyle"
    @mousedown="onMouseDown"
    @click.stop="emit('select', node.id)"
  >
    <!-- Node Header -->
    <div class="flex items-center gap-5 p-2" :style="headerStyle">
      <UIcon
        :name="definition.icon"
        class="text-white text-[14px] shrink-0 opacity-95"
      />
      <span
        class="flex-1 text-[12px] font-semibold text-white truncate tracking-[0.01em]"
      >
        {{ node.label }}
      </span>
      <button
        class="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-white/15 border-none cursor-pointer transition-colors duration-150 shrink-0 hover:bg-white/35"
        title="Delete node"
        @click.stop="emit('delete', node.id)"
      >
        <UIcon name="i-lucide-x" class="text-white text-[10px] opacity-80" />
      </button>
    </div>

    <!-- Ports row -->
    <div
      class="flex justify-between items-center p-[10px_6px] gap-2 min-h-[38px] border-t border-slate-200 dark:border-slate-700 rounded-b-lg"
    >
      <div class="flex flex-col gap-2 items-start">
        <ConnectionHandle
          v-for="port in inputPorts"
          :key="port.id"
          :port="port"
          :node-id="node.id"
          :canvas-scale="canvasScale"
          @start-connection="emit('startConnection', $event)"
          @end-connection="emit('endConnection', $event)"
        />
      </div>
      <div class="flex flex-col gap-2 items-end">
        <ConnectionHandle
          v-for="port in outputPorts"
          :key="port.id"
          :port="port"
          :node-id="node.id"
          :canvas-scale="canvasScale"
          @start-connection="emit('startConnection', $event)"
          @end-connection="emit('endConnection', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
