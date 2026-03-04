<script setup lang="ts">
import type { NodeDefinition, NodeCategory } from "~/types/workflow";
import { useNodeRegistry } from "~/composables/useNodeRegistry";

const emit = defineEmits<{
  addNode: [definitionId: string];
}>();

const { categories, getByCategory, search: searchNodes } = useNodeRegistry();

const searchQuery = ref("");
const expandedCategories = ref<Set<NodeCategory>>(
  new Set(["trigger", "action", "logic", "output"]),
);

const filteredResults = computed<NodeDefinition[]>(() => {
  if (searchQuery.value.trim()) {
    return searchNodes(searchQuery.value);
  }
  return [];
});

const isSearching = computed(() => searchQuery.value.trim().length > 0);

function toggleCategory(id: NodeCategory) {
  if (expandedCategories.value.has(id)) {
    expandedCategories.value.delete(id);
  } else {
    expandedCategories.value.add(id);
  }
}

/** Use text/plain so all browsers allow the drop. Store the definitionId as JSON. */
function onDragStart(e: DragEvent, definition: NodeDefinition) {
  if (!e.dataTransfer) return;
  e.dataTransfer.effectAllowed = "copy";
  e.dataTransfer.setData("text/plain", definition.id);
}

/** Click-to-add: adds the node at the center of the canvas */
function onNodeClick(definition: NodeDefinition) {
  emit("addNode", definition.id);
}

const categoryColorMap: Record<NodeCategory, string> = {
  trigger: "var(--color-primary-500)",
  ai: "#7c3aed",
  action: "#0ea5e9",
  logic: "#ef4444",
  output: "#10b981",
};

function getCategoryColor(category: NodeCategory | string): string {
  return categoryColorMap[category as NodeCategory] ?? "#6b7280";
}
</script>

<template>
  <aside
    class="w-[240px] min-w-[200px] flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-hidden"
  >
    <!-- Header -->
    <div
      class="p-[14px_14px_10px] border-b border-slate-200 dark:border-slate-800"
    >
      <span
        class="text-[12px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-[0.08em] flex items-center"
      >
        <UIcon name="i-lucide-layout-grid" class="mr-1.5 opacity-60" />
        Nodes
      </span>
    </div>

    <!-- Search -->
    <div class="p-[10px_12px] border-b border-slate-200 dark:border-slate-800">
      <UInput
        v-model="searchQuery"
        icon="i-lucide-search"
        size="sm"
        placeholder="Search nodes..."
        :trailing-icon="searchQuery ? 'i-lucide-x' : undefined"
        @click-trailing="searchQuery = ''"
        class="w-full"
      />
    </div>

    <!-- Search results -->
    <div
      v-if="isSearching"
      class="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent"
    >
      <div
        v-if="filteredResults.length === 0"
        class="p-6 text-center text-[12px] text-slate-400 dark:text-slate-500"
      >
        No nodes found
      </div>
      <div
        v-for="def in filteredResults"
        :key="def.id"
        class="group flex items-center gap-2 p-[7px_8px] mx-1.5 rounded-lg cursor-grab transition-all duration-120 hover:bg-primary-500/10 hover:translate-x-[2px] active:cursor-grabbing"
        draggable="true"
        :title="def.description"
        @dragstart="onDragStart($event, def)"
        @click="onNodeClick(def)"
      >
        <div
          class="w-7 h-7 rounded-[7px] border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0"
          :style="{
            background: def.color + '22',
            borderColor: def.color + '44',
          }"
        >
          <UIcon
            :name="def.icon"
            :style="{ color: def.color }"
            class="text-[14px]"
          />
        </div>
        <div class="flex-1 min-w-0 flex flex-col gap-[1px]">
          <span
            class="text-[12px] font-medium text-slate-900 dark:text-slate-100 truncate"
            >{{ def.label }}</span
          >
          <span
            class="text-[10px] text-slate-400 dark:text-slate-500 truncate"
            >{{ def.description }}</span
          >
        </div>
        <UIcon
          name="i-lucide-plus"
          class="text-[12px] text-primary-500 opacity-0 group-hover:opacity-50 shrink-0"
        />
      </div>
    </div>

    <!-- Category list -->
    <div
      v-else
      class="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent"
    >
      <div v-for="cat in categories" :key="cat.id" class="mb-1">
        <button
          class="w-full flex items-center gap-2 p-[6px_12px] bg-transparent border-none cursor-pointer rounded-md transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          @click="toggleCategory(cat.id)"
        >
          <div
            class="w-5 h-5 rounded-[5px] flex items-center justify-center shrink-0"
            :style="{ background: getCategoryColor(cat.id) + '22' }"
          >
            <UIcon
              :name="cat.icon"
              :style="{ color: getCategoryColor(cat.id) }"
              class="text-[12px]"
            />
          </div>
          <span
            class="flex-1 text-left text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-[0.05em]"
          >
            {{ cat.label }}
          </span>
          <span
            class="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-[1px_5px] rounded-full"
          >
            {{ getByCategory(cat.id).length }}
          </span>
          <UIcon
            :name="
              expandedCategories.has(cat.id)
                ? 'i-lucide-chevron-down'
                : 'i-lucide-chevron-right'
            "
            class="text-[12px] opacity-40 ml-auto"
          />
        </button>

        <div v-if="expandedCategories.has(cat.id)" class="p-[2px_6px_4px]">
          <div
            v-for="def in getByCategory(cat.id)"
            :key="def.id"
            class="group flex items-center gap-2 p-[7px_8px] rounded-lg cursor-grab transition-all duration-120 hover:bg-primary-500/10 hover:translate-x-[2px] active:cursor-grabbing"
            draggable="true"
            :title="def.description"
            @dragstart="onDragStart($event, def)"
            @click="onNodeClick(def)"
          >
            <div
              class="w-7 h-7 rounded-[7px] border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0"
              :style="{
                background: def.color + '22',
                borderColor: def.color + '44',
              }"
            >
              <UIcon
                :name="def.icon"
                :style="{ color: def.color }"
                class="text-[14px]"
              />
            </div>
            <div class="flex-1 min-w-0 flex flex-col gap-[1px]">
              <span
                class="text-[12px] font-medium text-slate-900 dark:text-slate-100 truncate"
                >{{ def.label }}</span
              >
              <span
                class="text-[10px] text-slate-400 dark:text-slate-500 truncate"
                >{{ def.description }}</span
              >
            </div>
            <UIcon
              name="i-lucide-grip-vertical"
              class="shrink-0 text-[12px] opacity-20 group-hover:hidden"
            />
            <UIcon
              name="i-lucide-plus"
              class="shrink-0 text-[12px] text-primary-500 opacity-0 group-hover:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped></style>
