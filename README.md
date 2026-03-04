# AIFlow

A modern, high-performance node-based visual programming environment built with **Nuxt 4**, **Vue 3**, **Tailwind CSS**, and **Nuxt UI**. This platform allows users to design, configure, and execute automated AI and logic workflows through an intuitive drag-and-drop interface.

![AIFlow Canvas Preview](docs/node_smoothness.png) <!-- Update with actual preview image if needed -->

## ✨ Features

- **Infinite GPU-Accelerated Canvas**: Butter-smooth panning and zooming (0.2x to 2.5x) powered by hardware-accelerated CSS `translate3d`.
- **Zero-Latency Node Dragging**: Nodes and bezier connection edges follow your cursor instantly with perfectly synced reactive updates.
- **Rich Node Ecosystem**: Includes categories for Triggers, Actions, Logic, Output, and a dedicated **AI Models** category (GPT-4, Claude, Gemini, SDXL).
- **Nuxt UI Integration**: Fully utilizes Nuxt UI for premium components, modals, toggles, forms, and consistent theming.
- **Dynamic Theming**: Flawless Light and Dark mode transitions, beautifully stylized gradients, and custom sleek scrollbars.
- **Configurable Inspector**: A dynamic side panel that auto-generates forms (text, dropdowns, code editors, toggles) based on strict JSON schemas defined by the node models.
- **Local Storage Persistence**: Workflows are automatically serialized and saved locally so you don't lose your progress.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- `pnpm` (recommended), `npm`, or `yarn`

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/aiflow.git
   cd aiflow
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## 🛠️ Architecture

AIFlow is designed with a clean separation of concerns:

- `~/components/workflow/WorkflowCanvas.vue`: The core rendering engine for the infinite grid, nodes, and SVG edges.
- `~/components/workflow/WorkflowNode.vue`: The visual card component representing an executable block.
- `~/composables/useCanvas.ts`: Mathematics and state for panning, zooming, and screen-to-canvas coordinate transformations.
- `~/composables/useNodeRegistry.ts`: A centralized repository of all available node definitions (found in `~/data/nodes/*.ts`).
- `~/types/workflow.ts`: Strict TypeScript definitions for Nodes, Edges, Schemas, and the overall Workflow object.

---

## 🤝 Contribution Guidelines

We welcome contributions from the community! Whether it's adding a new AI model node, fixing a visual bug, or optimizing the canvas engine, your help is appreciated.

### 1. Adding a New Node

The node registry is entirely data-driven. To add a new node:

1. Open the relevant file in `app/data/nodes/` (e.g., `ai.ts`, `actions.ts`, or `logic.ts`).
2. Add a new `NodeDefinition` object to the exported array.
3. Define its `id`, `category`, `label`, `icon` (using a Nuxt UI icon like `i-lucide-box`), and `color`.
4. Define its `ports` (inputs and outputs).
5. Define its `configSchema` — this array automatically generates the form fields in the Node Inspector panel.

```typescript
{
  id: "ai.custom_model",
  label: "Custom AI",
  description: "Runs a local AI model.",
  category: "ai",
  icon: "i-lucide-brain",
  color: "#7c3aed",
  ports: [
    { id: "in", label: "Input", direction: "input" },
    { id: "out", label: "Result", direction: "output" }
  ],
  configSchema: [
    { key: "prompt", label: "Prompt", type: "textarea", required: true }
  ]
}
```

_Note: You do not need to touch any Vue components to add a basic node. The palette and inspector will render it automatically!_

### 2. Code Style & Standards

- **TypeScript**: We use strict TypeScript. Ensure all new functions and props are properly typed. Avoid using `any` unless absolutely necessary.
- **Styling**: Use exclusively **Tailwind CSS** utility classes. Do not use `<style scoped>` or custom CSS variables for coloring or layout unless creating complex animations or global overrides (like the scrollbar in `main.css`).
- **Components**: Rely on **Nuxt UI** components (`UButton`, `UInput`, etc.) over raw HTML inputs to maintain aesthetic consistency.

### 3. Submitting a Pull Request

1. Fork the repository.
2. Create a new feature branch based on the type of work:
   - Features: `git checkout -b feat/my-amazing-feature`
   - Bug Fixes: `git checkout -b fix/issue-name`
   - Documentation: `git checkout -b docs/update-readme`
   - Refactoring/Debug: `git checkout -b refactor/improve-logic`
   - Chores/Maintenance: `git checkout -b chore/update-deps`
3. Commit your changes with descriptive messages (`git commit -m "feat: add new AI model node"`).
4. Push to the branch (`git push origin <branch-name>`).
5. Open a Pull Request against the `main` branch.

### 4. Reporting Bugs

If you find a bug (like an edge not aligning properly, or a z-index issue), please open an Issue with:

- A clear description of the problem.
- Steps to reproduce.
- Your browser and OS version.
- (Optional but helpful) A screenshot or short video recording.

---

_Built with ❤️ using Nuxt 4, Vue 3, Tailwind CSS, and Nuxt UI._
