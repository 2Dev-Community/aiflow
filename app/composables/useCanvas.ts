import { ref, computed } from "vue";

interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}

export function useCanvas() {
  const transform = ref<CanvasTransform>({ x: 0, y: 0, scale: 1 });
  const isPanning = ref(false);
  const panStart = ref({ mx: 0, my: 0, tx: 0, ty: 0 });

  const MIN_SCALE = 0.2;
  const MAX_SCALE = 2.5;
  const ZOOM_STEP = 0.1;

  /** Convert screen-space coordinates to canvas-space */
  function screenToCanvas(sx: number, sy: number): { x: number; y: number } {
    return {
      x: (sx - transform.value.x) / transform.value.scale,
      y: (sy - transform.value.y) / transform.value.scale,
    };
  }

  /** Convert canvas-space coordinates to screen-space */
  function canvasToScreen(cx: number, cy: number): { x: number; y: number } {
    return {
      x: cx * transform.value.scale + transform.value.x,
      y: cy * transform.value.scale + transform.value.y,
    };
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault();
    const delta = -Math.sign(e.deltaY) * ZOOM_STEP;
    const newScale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, transform.value.scale + delta),
    );

    // Zoom toward the cursor position
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const scaleDiff = newScale - transform.value.scale;
    transform.value = {
      x: transform.value.x - mouseX * scaleDiff,
      y: transform.value.y - mouseY * scaleDiff,
      scale: newScale,
    };
  }

  function startPan(e: MouseEvent) {
    if (e.button !== 1 && e.button !== 0) return; // middle or left (on canvas bg)
    isPanning.value = true;
    panStart.value = {
      mx: e.clientX,
      my: e.clientY,
      tx: transform.value.x,
      ty: transform.value.y,
    };
  }

  function doPan(e: MouseEvent) {
    if (!isPanning.value) return;
    transform.value = {
      ...transform.value,
      x: panStart.value.tx + (e.clientX - panStart.value.mx),
      y: panStart.value.ty + (e.clientY - panStart.value.my),
    };
  }

  function endPan() {
    isPanning.value = false;
  }

  function zoomIn() {
    transform.value = {
      ...transform.value,
      scale: Math.min(MAX_SCALE, transform.value.scale + ZOOM_STEP),
    };
  }

  function zoomOut() {
    transform.value = {
      ...transform.value,
      scale: Math.max(MIN_SCALE, transform.value.scale - ZOOM_STEP),
    };
  }

  function resetView() {
    transform.value = { x: 0, y: 0, scale: 1 };
  }

  const zoomPercent = computed(() => Math.round(transform.value.scale * 100));

  const cssTransform = computed(
    () =>
      `translate3d(${transform.value.x}px, ${transform.value.y}px, 0) scale(${transform.value.scale})`,
  );

  return {
    transform,
    isPanning,
    cssTransform,
    zoomPercent,
    screenToCanvas,
    canvasToScreen,
    onWheel,
    startPan,
    doPan,
    endPan,
    zoomIn,
    zoomOut,
    resetView,
  };
}
