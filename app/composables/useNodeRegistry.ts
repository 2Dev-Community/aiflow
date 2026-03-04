import type { NodeDefinition, NodeCategory } from "~/types/workflow";
import { triggerNodes } from "~/data/nodes/triggers";
import { actionNodes } from "~/data/nodes/actions";
import { aiNodes } from "~/data/nodes/ai";

const allNodes: NodeDefinition[] = [
  ...triggerNodes,
  ...actionNodes,
  ...aiNodes,
];

export function useNodeRegistry() {
  function getAll(): NodeDefinition[] {
    return allNodes;
  }

  function findDefinition(id: string): NodeDefinition | undefined {
    return allNodes.find((n) => n.id === id);
  }

  function getByCategory(category: NodeCategory): NodeDefinition[] {
    return allNodes.filter((n) => n.category === category);
  }

  function search(query: string): NodeDefinition[] {
    const q = query.toLowerCase();
    return allNodes.filter(
      (n) =>
        n.label.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q),
    );
  }

  const categories: { id: NodeCategory; label: string; icon: string }[] = [
    { id: "trigger", label: "Triggers", icon: "i-lucide-zap" },
    { id: "ai", label: "AI Models", icon: "i-lucide-sparkles" },
    { id: "action", label: "Actions", icon: "i-lucide-bolt" },
    { id: "logic", label: "Logic", icon: "i-lucide-git-branch" },
    { id: "output", label: "Output", icon: "i-lucide-log-out" },
  ];

  return { getAll, findDefinition, getByCategory, search, categories };
}
