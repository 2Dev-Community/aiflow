<script setup lang="ts">
import type {
  Workflow,
  WorkflowNode,
  PendingConnection,
  NodeDefinition,
} from "~/types/workflow";
import WorkflowNodeComp from "~/components/workflow/WorkflowNode.vue";
import WorkflowEdgeComp from "~/components/workflow/WorkflowEdge.vue";
import { useCanvas } from "~/composables/useCanvas";
import { useNodeRegistry } from "~/composables/useNodeRegistry";

const colorMode = useColorMode();
const isDark = computed(() => (colorMode as any).value === "dark");

// ─── Props & Emits ────────────────────────────────────────────────────────────

interface Props {
  workflow: Workflow;
  selectedNodeId: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  selectNode: [id: string | null];
  moveNode: [payload: { nodeId: string; position: { x: number; y: number } }];
  addNode: [
    payload: { definitionId: string; position: { x: number; y: number } },
  ];
  addEdge: [
    payload: {
      sourceNodeId: string;
      sourcePortId: string;
      targetNodeId: string;
      targetPortId: string;
    },
  ];
  removeEdge: [edgeId: string];
  removeNode: [nodeId: string];
}>();

// ─── Canvas ───────────────────────────────────────────────────────────────────

const { findDefinition } = useNodeRegistry();

const canvasRef = ref<HTMLElement | null>(null);
const {
  transform,
  cssTransform,
  zoomPercent,
  screenToCanvas,
  onWheel,
  startPan,
  doPan,
  endPan,
  zoomIn,
  zoomOut,
  resetView,
} = useCanvas();

// ─── Node Dragging ────────────────────────────────────────────────────────────

const draggingNodeId = ref<string | null>(null);
const dragOffset = ref({ x: 0, y: 0 });

// Local drag position — updated every mousemove so edges are never behind.
// Read by edgesWithPositions to avoid waiting for the parent props round-trip.
const localDragPos = ref<{ x: number; y: number } | null>(null);

function onNodeDragStart(payload: {
  nodeId: string;
  offsetX: number;
  offsetY: number;
}) {
  draggingNodeId.value = payload.nodeId;
  dragOffset.value = { x: payload.offsetX, y: payload.offsetY };
  localDragPos.value = null;
}

// ─── Connection drawing ───────────────────────────────────────────────────────

const pendingConnection = ref<PendingConnection | null>(null);

function onStartConnection(payload: {
  nodeId: string;
  portId: string;
  portDirection: "input" | "output";
  el: HTMLElement;
}) {
  if (payload.portDirection !== "output") return;
  pendingConnection.value = {
    sourceNodeId: payload.nodeId,
    sourcePortId: payload.portId,
    mouseX: 0,
    mouseY: 0,
  };
}

function onEndConnection(payload: { nodeId: string; portId: string }) {
  if (!pendingConnection.value) return;
  emit("addEdge", {
    sourceNodeId: pendingConnection.value.sourceNodeId,
    sourcePortId: pendingConnection.value.sourcePortId,
    targetNodeId: payload.nodeId,
    targetPortId: payload.portId,
  });
  pendingConnection.value = null;
}

// ─── Unified mouse events ─────────────────────────────────────────────────────

const isPanningBackground = ref(false);

function isCanvasBackground(e: MouseEvent): boolean {
  const t = e.target as HTMLElement;
  return (
    t === canvasRef.value ||
    t.classList.contains("canvas-bg-rect") ||
    t.classList.contains("canvas-inner")
  );
}

function onCanvasMouseDown(e: MouseEvent) {
  if (isCanvasBackground(e)) {
    isPanningBackground.value = true;
    startPan(e);
    emit("selectNode", null);
  }
}

function onCanvasMouseMove(e: MouseEvent) {
  if (isPanningBackground.value) doPan(e);

  if (pendingConnection.value && canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect();
    const pos = screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
    pendingConnection.value.mouseX = pos.x;
    pendingConnection.value.mouseY = pos.y;
  }

  if (draggingNodeId.value && canvasRef.value) {
    const rect = canvasRef.value.getBoundingClientRect();
    const pos = screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
    const newPos = {
      x: pos.x - dragOffset.value.x,
      y: pos.y - dragOffset.value.y,
    };
    // Update locally first — edges read this immediately (no parent round-trip)
    localDragPos.value = newPos;
    // Persist to parent for state management
    emit("moveNode", { nodeId: draggingNodeId.value, position: newPos });
  }
}

function onCanvasMouseUp() {
  isPanningBackground.value = false;
  endPan();
  draggingNodeId.value = null;
  localDragPos.value = null;
  pendingConnection.value = null;
}

// ─── Drop from palette (HTML5 drag API) ──────────────────────────────────────

function onDragOver(e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  const definitionId = e.dataTransfer?.getData("text/plain");
  if (!definitionId || !canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  const pos = screenToCanvas(e.clientX - rect.left, e.clientY - rect.top);
  emit("addNode", { definitionId, position: pos });
}

// ─── Port position calculation (pure math, fully reactive) ───────────────────
//
// Instead of querying the DOM (which is NOT reactive to node moves), we
// calculate port centers directly from node.position + fixed layout constants
// that match the CSS geometry in WorkflowNode.vue.
//
//  Node layout (all values in px):
//    Header: padding 9+9 + icon/text ≈ 37px tall
//    Body:   padding-top 10px, handle-dot 12px (center at +6), gap 8px
//    Width:  min-width 190px (constant)
//
//  Input port  (left side):  x = node.x + 6 + 6  = node.x + 12
//  Output port (right side): x = node.x + 190 - 12 = node.x + 178
//  Port index i: y = node.y + 37 + 10 + 6 + i * 20

const NODE_W = 190;
const PORT_X_IN = 12; // from node left edge to input dot center
const PORT_X_OUT = 178; // from node left edge to output dot center
const PORT_Y0 = 53; // from node top to first port dot center (37+10+6)
const PORT_DY = 20; // vertical step between ports (8 gap + 12 dot)

interface Vec2 {
  x: number;
  y: number;
}

function calcPortPos(
  node: WorkflowNode,
  portId: string,
  dir: "input" | "output",
): Vec2 | null {
  const def = findDefinition(node.definitionId);
  if (!def) return null;
  const ports = def.ports.filter((p) => p.direction === dir);
  const idx = ports.findIndex((p) => p.id === portId);
  if (idx < 0) return null;
  return {
    x: node.position.x + (dir === "input" ? PORT_X_IN : PORT_X_OUT),
    y: node.position.y + PORT_Y0 + idx * PORT_DY,
  };
}

// edgesWithPositions — reads localDragPos for the active drag node so edges
// update on the same tick as the node card (no parent round-trip lag).
const edgesWithPositions = computed(() => {
  const nodeMap = new Map(props.workflow.nodes.map((n) => [n.id, n]));
  return props.workflow.edges.flatMap((edge) => {
    const src = nodeMap.get(edge.sourceNodeId);
    const tgt = nodeMap.get(edge.targetNodeId);
    if (!src || !tgt) return [];

    // If this node is being dragged, use local pos (lag-free)
    const srcPos =
      draggingNodeId.value === edge.sourceNodeId && localDragPos.value
        ? localDragPos.value
        : src.position;
    const tgtPos =
      draggingNodeId.value === edge.targetNodeId && localDragPos.value
        ? localDragPos.value
        : tgt.position;

    const srcNode = { ...src, position: srcPos };
    const tgtNode = { ...tgt, position: tgtPos };

    const sp = calcPortPos(srcNode, edge.sourcePortId, "output");
    const tp = calcPortPos(tgtNode, edge.targetPortId, "input");
    if (!sp || !tp) return [];
    return [{ edge, src: sp, tgt: tp }];
  });
});

// Source port position for the in-progress connection ghost line
const pendingSourcePos = computed<Vec2 | null>(() => {
  const pc = pendingConnection.value;
  if (!pc) return null;
  const srcNode = props.workflow.nodes.find((n) => n.id === pc.sourceNodeId);
  if (!srcNode) return null;
  // If the source node is being dragged, use the local position
  const pos =
    draggingNodeId.value === srcNode.id && localDragPos.value
      ? localDragPos.value
      : srcNode.position;
  return calcPortPos({ ...srcNode, position: pos }, pc.sourcePortId, "output");
});

function getNodeDef(node: WorkflowNode): NodeDefinition | undefined {
  return findDefinition(node.definitionId);
}

// Expose for parent
defineExpose({ zoomIn, zoomOut, resetView, zoomPercent, transform });
</script>

<template>
  <div
    ref="canvasRef"
    class="absolute inset-0 overflow-hidden bg-slate-50 dark:bg-slate-950"
    :class="[isPanningBackground ? 'cursor-grabbing' : 'cursor-default']"
    @mousedown="onCanvasMouseDown"
    @mousemove="onCanvasMouseMove"
    @mouseup="onCanvasMouseUp"
    @mouseleave="onCanvasMouseUp"
    @wheel.prevent="onWheel"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <!-- Grid overlay (GPU accelerated, rendered BELOW nodes) -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute -inset-[24px] pointer-events-none will-change-transform"
        :style="{
          transform: `translate3d(${transform.x % 24}px, ${transform.y % 24}px, 0)`,
          backgroundImage: `radial-gradient(circle, ${isDark ? '#475569' : '#e2e8f0'} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }"
      />
    </div>

    <!-- Transformed world (edges + nodes, always above grid) -->
    <div
      class="absolute top-0 left-0 w-full h-full origin-[0_0] canvas-inner will-change-transform"
      :style="{ transform: cssTransform }"
    >
      <!-- Edges SVG layer (below nodes) -->
      <svg
        class="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none edges-svg"
      >
        <g class="pointer-events-auto">
          <WorkflowEdgeComp
            v-for="{ edge, src, tgt } in edgesWithPositions"
            :key="edge.id"
            :edge-id="edge.id"
            :source-x="src!.x"
            :source-y="src!.y"
            :target-x="tgt!.x"
            :target-y="tgt!.y"
            :selected="false"
            @remove="emit('removeEdge', $event)"
          />

          <!-- Pending edge ghost -->
          <g v-if="pendingConnection && pendingSourcePos">
            <path
              :d="`M ${pendingSourcePos!.x} ${pendingSourcePos!.y}
                   C ${pendingSourcePos!.x + 80} ${pendingSourcePos!.y},
                     ${pendingConnection!.mouseX - 80} ${pendingConnection!.mouseY},
                     ${pendingConnection!.mouseX} ${pendingConnection!.mouseY}`"
              fill="none"
              stroke="var(--color-primary-500)"
              stroke-width="2.5"
              stroke-dasharray="8 4"
              class="animate-[dash_20s_linear_infinite]"
              opacity="0.8"
            />
            <circle
              :cx="pendingConnection!.mouseX"
              :cy="pendingConnection!.mouseY"
              r="4"
              fill="var(--color-primary-500)"
              opacity="0.7"
            />
          </g>
        </g>
      </svg>

      <!-- Node cards -->
      <template v-for="node in workflow.nodes" :key="node.id">
        <WorkflowNodeComp
          v-if="getNodeDef(node)"
          :data-node-id="node.id"
          :node="node"
          :definition="getNodeDef(node)!"
          :selected="selectedNodeId === node.id"
          :dragging="draggingNodeId === node.id"
          :local-pos="draggingNodeId === node.id ? localDragPos : null"
          :canvas-scale="transform.scale"
          @select="emit('selectNode', $event)"
          @delete="emit('removeNode', $event)"
          @drag-start="onNodeDragStart"
          @start-connection="onStartConnection"
          @end-connection="onEndConnection"
        />
      </template>
    </div>

    <!-- Empty state hint -->
    <Transition name="fade">
      <div
        v-if="workflow.nodes.length === 0"
        class="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none"
      >
        <div
          class="w-[72px] h-[72px] rounded-full bg-primary-500/10 flex items-center justify-center mb-2"
        >
          <UIcon
            name="i-lucide-workflow"
            class="text-[40px] text-primary-500/40"
          />
        </div>
        <p class="text-[16px] font-semibold text-slate-600 dark:text-slate-400">
          Start building your workflow
        </p>
        <p class="text-[13px] text-slate-400 dark:text-slate-500">
          Click or drag a node from the left panel
        </p>
      </div>
    </Transition>

    <!-- Zoom badge -->
    <div
      class="absolute bottom-4 right-4 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[11px] font-medium px-[10px] py-[3px] rounded-[7px] border border-slate-200 dark:border-slate-800 pointer-events-none z-10"
    >
      {{ zoomPercent }}%
    </div>
  </div>
</template>

<style scoped>
/* ── Transitions ─────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes dash {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: 1000;
  }
}
</style>
