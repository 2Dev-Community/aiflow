// ─── Node Categories & Types ──────────────────────────────────────────────────

export type NodeCategory = "trigger" | "action" | "logic" | "output";

export type PortDirection = "input" | "output";

export interface PortDef {
  id: string;
  label: string;
  direction: PortDirection;
  /** One port can accept multiple connections when true */
  multiple?: boolean;
}

export type ConfigFieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "toggle"
  | "code"
  | "cron";

export interface ConfigFieldOption {
  label: string;
  value: string;
}

export interface ConfigField {
  key: string;
  label: string;
  type: ConfigFieldType;
  placeholder?: string;
  defaultValue?: unknown;
  options?: ConfigFieldOption[];
  description?: string;
  required?: boolean;
}

// ─── Node Definition (template / blueprint) ───────────────────────────────────

export interface NodeDefinition {
  id: string;
  label: string;
  description: string;
  category: NodeCategory;
  icon: string;
  /** Tailwind/hex color token used to tint the node card header */
  color: string;
  ports: PortDef[];
  configSchema: ConfigField[];
}

// ─── Runtime instances ────────────────────────────────────────────────────────

export interface Position {
  x: number;
  y: number;
}

export interface WorkflowNode {
  id: string;
  definitionId: string;
  label: string;
  position: Position;
  /** key-value map from configSchema.key → user value */
  config: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
}

// ─── Top-level Workflow ───────────────────────────────────────────────────────

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

// ─── Connection being drawn ───────────────────────────────────────────────────

export interface PendingConnection {
  sourceNodeId: string;
  sourcePortId: string;
  /** Current mouse position on canvas */
  mouseX: number;
  mouseY: number;
}
