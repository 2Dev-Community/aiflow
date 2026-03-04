<script setup lang="ts">
interface Props {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  edgeId: string;
  selected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
});

const emit = defineEmits<{
  remove: [edgeId: string];
}>();

// Cubic bezier: always curves horizontally between ports
const path = computed(() => {
  const dx = Math.abs(props.targetX - props.sourceX);
  const cp = Math.max(60, dx * 0.5);
  return `M ${props.sourceX} ${props.sourceY} C ${props.sourceX + cp} ${props.sourceY}, ${props.targetX - cp} ${props.targetY}, ${props.targetX} ${props.targetY}`;
});

const midX = computed(() => (props.sourceX + props.targetX) / 2);
const midY = computed(() => (props.sourceY + props.targetY) / 2);

const isHovered = ref(false);

const colorMode = useColorMode();
const isDark = computed(() => (colorMode as any).value === "dark");

// Edge color — uses standard theme colors
const strokeColor = computed(() => {
  if (props.selected) return "var(--color-primary-500)";
  return isDark.value ? "#334155" : "#cbd5e1"; // slate-700 : slate-300
});

const selectedStrokeColor = "var(--color-primary-500)";
</script>

<template>
  <g @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <!-- Wide invisible hit-area for easier hovering -->
    <path
      :d="path"
      fill="none"
      stroke="transparent"
      stroke-width="14"
      style="cursor: pointer"
    />

    <!-- Main visible edge line -->
    <path
      :d="path"
      fill="none"
      :stroke="strokeColor"
      :stroke-width="selected || isHovered ? 2.5 : 2"
      stroke-linecap="round"
      class="pointer-events-none transition-opacity duration-200"
      :opacity="isHovered ? 1 : 0.8"
    />

    <!-- Animated flow dot travelling along the path -->
    <circle r="3.5" :fill="selectedStrokeColor" opacity="0.9">
      <animateMotion
        :path="path"
        dur="1.8s"
        repeatCount="indefinite"
        rotate="auto"
      />
    </circle>

    <!-- Delete button shown on hover at path midpoint -->
    <g
      v-if="isHovered"
      :transform="`translate(${midX}, ${midY})`"
      style="cursor: pointer"
      @mousedown.stop="emit('remove', edgeId)"
    >
      <circle r="9" fill="#ef4444" stroke="#1e293b" stroke-width="1.5" />
      <text
        text-anchor="middle"
        dominant-baseline="central"
        font-size="13"
        fill="white"
        font-weight="700"
        style="user-select: none"
        >×</text
      >
    </g>
  </g>
</template>
