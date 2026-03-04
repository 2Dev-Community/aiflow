<script setup lang="ts">
import type { Workflow } from "~/types/workflow";

interface Props {
  workflow: Workflow;
  canvasTransform: { x: number; y: number; scale: number };
  viewportWidth: number;
  viewportHeight: number;
}

const props = defineProps<Props>();

const colorMode = useColorMode();
const isDark = computed(() => (colorMode as any).value === "dark");

const MINI_WIDTH = 160;
const MINI_HEIGHT = 110;
const PADDING = 15;

// Compute the bounding box of all nodes
const bounds = computed(() => {
  if (props.workflow.nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  props.workflow.nodes.forEach((node) => {
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + 190); // Approximate node width
    maxY = Math.max(maxY, node.position.y + 80); // Approximate node height
  });

  return { minX, minY, maxX, maxY };
});

// Combine node bounds and viewport bounds to get total viewable area
const totalBounds = computed(() => {
  const vX = -props.canvasTransform.x / props.canvasTransform.scale;
  const vY = -props.canvasTransform.y / props.canvasTransform.scale;
  const vW = props.viewportWidth / props.canvasTransform.scale;
  const vH = props.viewportHeight / props.canvasTransform.scale;

  // If no nodes, just show the viewport area
  if (props.workflow.nodes.length === 0) {
    return { minX: vX, minY: vY, maxX: vX + vW, maxY: vY + vH };
  }

  return {
    minX: Math.min(bounds.value.minX, vX),
    minY: Math.min(bounds.value.minY, vY),
    maxX: Math.max(bounds.value.maxX, vX + vW),
    maxY: Math.max(bounds.value.maxY, vY + vH),
  };
});

// Calculate the scale to fit totalBounds into the minimap, with a cap
const miniScale = computed(() => {
  const w = totalBounds.value.maxX - totalBounds.value.minX;
  const h = totalBounds.value.maxY - totalBounds.value.minY;
  const sX = (MINI_WIDTH - PADDING * 2) / Math.max(w, 1);
  const sY = (MINI_HEIGHT - PADDING * 2) / Math.max(h, 1);
  return Math.min(sX, sY, 0.12); // Maximum 12% scale
});

// Calculate offset to center the content in the minimap SVG
const offset = computed(() => {
  const w = (totalBounds.value.maxX - totalBounds.value.minX) * miniScale.value;
  const h = (totalBounds.value.maxY - totalBounds.value.minY) * miniScale.value;
  return {
    x: (MINI_WIDTH - w) / 2 - totalBounds.value.minX * miniScale.value,
    y: (MINI_HEIGHT - h) / 2 - totalBounds.value.minY * miniScale.value,
  };
});

// Compute node rects in mini-map space
const miniNodes = computed(() => {
  return props.workflow.nodes.map((node) => ({
    id: node.id,
    x: node.position.x * miniScale.value + offset.value.x,
    y: node.position.y * miniScale.value + offset.value.y,
    w: 190 * miniScale.value,
    h: 80 * miniScale.value,
  }));
});

// Viewport rect in mini-map space
const viewportRect = computed(() => {
  const vw =
    (props.viewportWidth / props.canvasTransform.scale) * miniScale.value;
  const vh =
    (props.viewportHeight / props.canvasTransform.scale) * miniScale.value;
  const vx =
    (-props.canvasTransform.x / props.canvasTransform.scale) * miniScale.value +
    offset.value.x;
  const vy =
    (-props.canvasTransform.y / props.canvasTransform.scale) * miniScale.value +
    offset.value.y;
  return { x: vx, y: vy, w: vw, h: vh };
});
</script>

<template>
  <div
    class="absolute bottom-[48px] right-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm pointer-events-none bg-white dark:bg-slate-900 z-[5]"
  >
    <svg :width="MINI_WIDTH" :height="MINI_HEIGHT">
      <!-- Background -->
      <rect
        width="100%"
        height="100%"
        :fill="isDark ? '#0f172a' : '#ffffff'"
        rx="8"
        fill-opacity="0.9"
      />
      <!-- Nodes -->
      <rect
        v-for="n in miniNodes"
        :key="n.id"
        :x="n.x"
        :y="n.y"
        :width="n.w"
        :height="n.h"
        rx="2"
        fill="var(--color-primary-500)"
        fill-opacity="0.6"
      />

      <!-- Viewport indicator -->
      <rect
        :x="viewportRect.x"
        :y="viewportRect.y"
        :width="viewportRect.w"
        :height="viewportRect.h"
        fill="var(--color-primary-500)"
        fill-opacity="0.08"
        stroke="var(--color-primary-500)"
        stroke-width="1.2"
        rx="2"
      />
    </svg>
  </div>
</template>

<style scoped></style>
