import { ref, computed } from "vue";
import type {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  Position,
} from "~/types/workflow";
import { useNodeRegistry } from "~/composables/useNodeRegistry";

const STORAGE_KEY = "chansy_workflows";

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function now(): string {
  return new Date().toISOString();
}

/** Create a brand-new empty workflow */
function createDefault(): Workflow {
  return {
    id: generateId(),
    name: "Untitled Workflow",
    nodes: [],
    edges: [],
    createdAt: now(),
    updatedAt: now(),
  };
}

/** Persist all workflows to localStorage */
function persistAll(workflows: Workflow[]) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
  }
}

/** Load all workflows from localStorage */
function loadAll(): Workflow[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Workflow[]) : [];
  } catch {
    return [];
  }
}

// ─── List composable (workflow list page) ─────────────────────────────────────

export function useWorkflowList() {
  const workflows = ref<Workflow[]>(loadAll());

  function refresh() {
    workflows.value = loadAll();
  }

  function createWorkflow(): Workflow {
    const wf = createDefault();
    const all = loadAll();
    all.push(wf);
    persistAll(all);
    workflows.value = all;
    return wf;
  }

  function deleteWorkflow(id: string) {
    const updated = loadAll().filter((w) => w.id !== id);
    persistAll(updated);
    workflows.value = updated;
  }

  return { workflows, refresh, createWorkflow, deleteWorkflow };
}

// ─── Editor composable (single workflow editor) ───────────────────────────────

export function useWorkflow(id: string) {
  const { findDefinition } = useNodeRegistry();

  const initialWorkflow = loadAll().find((w) => w.id === id) ?? createDefault();
  const workflow = ref<Workflow>(JSON.parse(JSON.stringify(initialWorkflow)));

  /** Selected node id */
  const selectedNodeId = ref<string | null>(null);

  const selectedNode = computed(
    () =>
      workflow.value.nodes.find((n) => n.id === selectedNodeId.value) ?? null,
  );

  // ── Node operations ──────────────────────────────────────────────────────

  function addNode(definitionId: string, position: Position): WorkflowNode {
    const def = findDefinition(definitionId);
    const node: WorkflowNode = {
      id: generateId(),
      definitionId,
      label: def?.label ?? definitionId,
      position,
      config: Object.fromEntries(
        (def?.configSchema ?? []).map((f) => [f.key, f.defaultValue ?? ""]),
      ),
    };
    workflow.value.nodes.push(node);
    return node;
  }

  function removeNode(nodeId: string) {
    workflow.value.nodes = workflow.value.nodes.filter((n) => n.id !== nodeId);
    // also remove connected edges
    workflow.value.edges = workflow.value.edges.filter(
      (e) => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId,
    );
    if (selectedNodeId.value === nodeId) selectedNodeId.value = null;
  }

  function updateNode(
    nodeId: string,
    patch: Partial<Pick<WorkflowNode, "label" | "config" | "position">>,
  ) {
    const node = workflow.value.nodes.find((n) => n.id === nodeId);
    if (!node) return;
    if (patch.label !== undefined) node.label = patch.label;
    if (patch.position !== undefined) node.position = { ...patch.position };
    if (patch.config !== undefined)
      node.config = { ...node.config, ...patch.config };
  }

  function moveNode(nodeId: string, position: Position) {
    updateNode(nodeId, { position });
  }

  // ── Edge operations ──────────────────────────────────────────────────────

  function addEdge(
    sourceNodeId: string,
    sourcePortId: string,
    targetNodeId: string,
    targetPortId: string,
  ): WorkflowEdge | null {
    // prevent duplicate edges
    const exists = workflow.value.edges.some(
      (e) =>
        e.sourceNodeId === sourceNodeId &&
        e.sourcePortId === sourcePortId &&
        e.targetNodeId === targetNodeId &&
        e.targetPortId === targetPortId,
    );
    if (exists || sourceNodeId === targetNodeId) return null;

    const edge: WorkflowEdge = {
      id: generateId(),
      sourceNodeId,
      sourcePortId,
      targetNodeId,
      targetPortId,
    };
    workflow.value.edges.push(edge);
    return edge;
  }

  function removeEdge(edgeId: string) {
    workflow.value.edges = workflow.value.edges.filter((e) => e.id !== edgeId);
  }

  // ── Persistence ──────────────────────────────────────────────────────────

  function save() {
    workflow.value.updatedAt = now();
    const all = loadAll().filter((w) => w.id !== workflow.value.id);
    all.push(JSON.parse(JSON.stringify(workflow.value)));
    persistAll(all);
  }

  function selectNode(nodeId: string | null) {
    selectedNodeId.value = nodeId;
  }

  return {
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
  };
}
