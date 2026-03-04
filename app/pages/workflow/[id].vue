<script setup lang="ts">
import NodePalette from "~/components/workflow/NodePalette.vue";
import WorkflowCanvas from "~/components/workflow/WorkflowCanvas.vue";
import NodeInspector from "~/components/workflow/NodeInspector.vue";
import WorkflowToolbar from "~/components/workflow/WorkflowToolbar.vue";
import MiniMap from "~/components/workflow/MiniMap.vue";
import { useWorkflow } from "~/composables/useWorkflow";
import { useNodeRegistry } from "~/composables/useNodeRegistry";

definePageMeta({ layout: "workflow" });

const route = useRoute();
const router = useRouter();
const { findDefinition } = useNodeRegistry();

const workflowId = route.params.id as string;

const {
  workflow,
  selectedNodeId,
  selectedNode,
  addNode,
  removeNode,
  updateNode,
  moveNode,
  addEdge,
  removeEdge,
  save,
  selectNode,
} = useWorkflow(workflowId);

useHead({ title: computed(() => `${workflow.value.name} | AIFlow`) });

// ─── Canvas ref ──────────────────────────────────────────────────────────────

const canvasRef = ref<InstanceType<typeof WorkflowCanvas> | null>(null);
const canvasEl = ref<HTMLElement | null>(null);

// canvasTransform stays in sync with the WorkflowCanvas internal transform
const canvasTransform = ref<{ x: number; y: number; scale: number }>({
  x: 0,
  y: 0,
  scale: 1,
});
watchEffect(() => {
  const exposed = canvasRef.value?.transform as
    | { value?: { x: number; y: number; scale: number } }
    | undefined;
  if (exposed?.value) {
    canvasTransform.value = { ...exposed.value };
  }
});

// ─── Node actions ────────────────────────────────────────────────────────────

function handleAddNode(payload: {
  definitionId: string;
  position: { x: number; y: number };
}) {
  const node = addNode(payload.definitionId, payload.position);
  selectNode(node.id);
}

function handlePaletteAddNode(definitionId: string) {
  const el = canvasEl.value;
  const vw = el ? el.clientWidth : 800;
  const vh = el ? el.clientHeight : 600;
  const t = canvasTransform.value;
  const scale = t.scale || 1;
  const tx = t.x || 0;
  const ty = t.y || 0;
  // Convert canvas-viewport center to canvas-space coordinates
  const cx = (vw / 2 - tx) / scale;
  const cy = (vh / 2 - ty) / scale;
  // Stagger so multiple clicks don't stack exactly
  const offset = workflow.value.nodes.length * 32;
  const node = addNode(definitionId, {
    x: cx - 95 + offset,
    y: cy - 36 + offset,
  });
  selectNode(node.id);
}

function handleMoveNode(payload: {
  nodeId: string;
  position: { x: number; y: number };
}) {
  moveNode(payload.nodeId, payload.position);
}

function handleAddEdge(payload: {
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
}) {
  addEdge(
    payload.sourceNodeId,
    payload.sourcePortId,
    payload.targetNodeId,
    payload.targetPortId,
  );
}

function handleUpdateNode(payload: {
  nodeId: string;
  label?: string;
  config?: Record<string, unknown>;
}) {
  updateNode(payload.nodeId, { label: payload.label, config: payload.config });
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

const toast = useToast();
const isSaving = ref(false);
const isRunning = ref(false);

function handleSave() {
  isSaving.value = true;
  save();
  setTimeout(() => {
    isSaving.value = false;
    toast.add({
      title: "Workflow saved",
      color: "success",
      icon: "i-lucide-check-circle",
    });
  }, 600);
}

function handleRun() {
  isRunning.value = true;
  setTimeout(() => {
    isRunning.value = false;
  }, 2200);
}

function handleUpdateName(name: string) {
  workflow.value.name = name;
}

// ─── Selected node's definition ───────────────────────────────────────────────

const selectedDef = computed(() =>
  selectedNode.value
    ? (findDefinition(selectedNode.value.definitionId) ?? null)
    : null,
);

// ─── Canvas size ─────────────────────────────────────────────────────────────

const viewportSize = ref({ w: 800, h: 600 });
onMounted(() => {
  if (canvasEl.value) {
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      viewportSize.value = {
        w: entry.contentRect.width,
        h: entry.contentRect.height,
      };
    });
    ro.observe(canvasEl.value);
    onUnmounted(() => ro.disconnect());
  }
});

// ─── Zoom ─────────────────────────────────────────────────────────────────────

const zoomPercent = ref(100);

function syncZoom() {
  const zp = canvasRef.value?.zoomPercent;
  zoomPercent.value =
    typeof zp === "number"
      ? zp
      : typeof zp === "object" && zp !== null && "value" in zp
        ? (zp as { value: number }).value
        : 100;
}

function handleZoomIn() {
  canvasRef.value?.zoomIn();
  nextTick(syncZoom);
}
function handleZoomOut() {
  canvasRef.value?.zoomOut();
  nextTick(syncZoom);
}
function handleResetView() {
  canvasRef.value?.resetView();
  nextTick(syncZoom);
}
</script>

<template>
  <div
    class="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950"
  >
    <!-- Toolbar -->
    <WorkflowToolbar
      :workflow-name="workflow.name"
      :is-saving="isSaving"
      :is-running="isRunning"
      :zoom-percent="zoomPercent"
      @save="handleSave"
      @run="handleRun"
      @zoom-in="handleZoomIn"
      @zoom-out="handleZoomOut"
      @reset-view="handleResetView"
      @update-name="handleUpdateName"
      @back="router.push('/workflow')"
    />

    <!-- Main 3-column layout -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left: palette -->
      <NodePalette @add-node="handlePaletteAddNode" />

      <!-- Center: canvas with mini-map overlay -->
      <div ref="canvasEl" class="relative flex-1">
        <WorkflowCanvas
          ref="canvasRef"
          :workflow="workflow"
          :selected-node-id="selectedNodeId"
          @select-node="selectNode"
          @add-node="handleAddNode"
          @move-node="handleMoveNode"
          @add-edge="handleAddEdge"
          @remove-edge="removeEdge"
          @remove-node="removeNode"
        />

        <MiniMap
          :workflow="workflow"
          :canvas-transform="canvasTransform"
          :viewport-width="viewportSize.w"
          :viewport-height="viewportSize.h"
        />
      </div>

      <!-- Right: inspector -->
      <NodeInspector
        :node="selectedNode"
        :definition="selectedDef"
        @update-node="handleUpdateNode"
        @close="selectNode(null)"
      />
    </div>

    <!-- Run flash overlay -->
    <UModal v-model:open="isRunning" :dismissible="false" class="z-50">
      <template #content>
        <div class="p-10 flex flex-col items-center gap-4 text-center">
          <UIcon
            name="i-lucide-loader-2"
            class="animate-spin text-primary-500 text-4xl"
          />
          <p class="text-[15px] font-medium text-gray-700 dark:text-gray-200">
            Executing workflow...
          </p>
          <p class="text-[13px] text-gray-500 dark:text-gray-400">
            Please wait while we process your automation.
          </p>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped></style>
