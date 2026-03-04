import type { NodeDefinition } from "~/types/workflow";

// A vibrant purple-violet gradient color for AI nodes
const AI_COLOR = "#7c3aed";

export const aiNodes: NodeDefinition[] = [
  // ── Chat / LLM ──────────────────────────────────────────────────────────────
  {
    id: "ai.chat",
    label: "AI Chat",
    description: "Send a prompt to a language model and get a response.",
    category: "ai",
    icon: "i-lucide-bot",
    color: AI_COLOR,
    ports: [
      { id: "in", label: "Input", direction: "input" },
      { id: "out", label: "Response", direction: "output" },
      { id: "err", label: "Error", direction: "output" },
    ],
    configSchema: [
      {
        key: "model",
        label: "Model",
        type: "select",
        defaultValue: "gpt-4o",
        options: [
          { label: "GPT-4o (OpenAI)", value: "gpt-4o" },
          { label: "GPT-4o Mini (OpenAI)", value: "gpt-4o-mini" },
          {
            label: "Claude 3.5 Sonnet (Anthropic)",
            value: "claude-3-5-sonnet",
          },
          { label: "Claude 3 Haiku (Anthropic)", value: "claude-3-haiku" },
          { label: "Gemini 2.0 Flash (Google)", value: "gemini-2.0-flash" },
          { label: "Gemini 1.5 Pro (Google)", value: "gemini-1.5-pro" },
          { label: "Llama 3.3 70B (Meta)", value: "llama-3.3-70b" },
        ],
      },
      {
        key: "systemPrompt",
        label: "System Prompt",
        type: "textarea",
        placeholder: "You are a helpful assistant...",
        description: "Sets the behavior and persona of the model.",
      },
      {
        key: "userMessage",
        label: "User Message",
        type: "textarea",
        placeholder: "{{data.input}}",
        required: true,
        description: "The message to send. Use {{field}} to reference input.",
      },
      {
        key: "temperature",
        label: "Temperature",
        type: "number",
        defaultValue: 0.7,
        description: "Creativity level (0 = deterministic, 2 = very creative).",
      },
      {
        key: "maxTokens",
        label: "Max Tokens",
        type: "number",
        defaultValue: 1024,
        description: "Maximum number of tokens in the response.",
      },
      {
        key: "stream",
        label: "Stream Response",
        type: "toggle",
        defaultValue: false,
        description: "Stream tokens as they are generated.",
      },
    ],
  },

  // ── Image Generation ─────────────────────────────────────────────────────────
  {
    id: "ai.image",
    label: "AI Image",
    description: "Generate an image from a text prompt.",
    category: "ai",
    icon: "i-lucide-image",
    color: "#db2777",
    ports: [
      { id: "in", label: "Input", direction: "input" },
      { id: "out", label: "Image URL", direction: "output" },
    ],
    configSchema: [
      {
        key: "model",
        label: "Model",
        type: "select",
        defaultValue: "dall-e-3",
        options: [
          { label: "DALL-E 3 (OpenAI)", value: "dall-e-3" },
          { label: "DALL-E 2 (OpenAI)", value: "dall-e-2" },
          { label: "Stable Diffusion XL", value: "sdxl" },
          { label: "Imagen 3 (Google)", value: "imagen-3" },
          { label: "Flux 1.1 Pro", value: "flux-1.1-pro" },
        ],
      },
      {
        key: "prompt",
        label: "Prompt",
        type: "textarea",
        placeholder: "A futuristic city skyline at dusk...",
        required: true,
        description: "Describe the image you want to generate.",
      },
      {
        key: "size",
        label: "Size",
        type: "select",
        defaultValue: "1024x1024",
        options: [
          { label: "Square (1024×1024)", value: "1024x1024" },
          { label: "Landscape (1792×1024)", value: "1792x1024" },
          { label: "Portrait (1024×1792)", value: "1024x1792" },
        ],
      },
      {
        key: "quality",
        label: "Quality",
        type: "select",
        defaultValue: "standard",
        options: [
          { label: "Standard", value: "standard" },
          { label: "HD", value: "hd" },
        ],
      },
    ],
  },

  // ── Embeddings ───────────────────────────────────────────────────────────────
  {
    id: "ai.embeddings",
    label: "Embeddings",
    description: "Convert text to a vector embedding for semantic search.",
    category: "ai",
    icon: "i-lucide-binary",
    color: "#0891b2",
    ports: [
      { id: "in", label: "Input", direction: "input" },
      { id: "out", label: "Vector", direction: "output" },
    ],
    configSchema: [
      {
        key: "model",
        label: "Model",
        type: "select",
        defaultValue: "text-embedding-3-small",
        options: [
          {
            label: "text-embedding-3-small (OpenAI)",
            value: "text-embedding-3-small",
          },
          {
            label: "text-embedding-3-large (OpenAI)",
            value: "text-embedding-3-large",
          },
          { label: "embed-english-v3 (Cohere)", value: "embed-english-v3" },
          { label: "embedding-001 (Google)", value: "embedding-001" },
        ],
      },
      {
        key: "text",
        label: "Text",
        type: "textarea",
        placeholder: "{{data.content}}",
        required: true,
        description: "The text to embed. Use {{field}} to reference input.",
      },
    ],
  },

  // ── Text Classifier ──────────────────────────────────────────────────────────
  {
    id: "ai.classify",
    label: "Text Classifier",
    description: "Classify text into one of a set of categories using AI.",
    category: "ai",
    icon: "i-lucide-tags",
    color: "#d97706",
    ports: [
      { id: "in", label: "Input", direction: "input" },
      { id: "out", label: "Result", direction: "output" },
    ],
    configSchema: [
      {
        key: "model",
        label: "Model",
        type: "select",
        defaultValue: "gpt-4o-mini",
        options: [
          { label: "GPT-4o Mini (OpenAI)", value: "gpt-4o-mini" },
          { label: "Claude 3 Haiku (Anthropic)", value: "claude-3-haiku" },
          { label: "Gemini 2.0 Flash (Google)", value: "gemini-2.0-flash" },
        ],
      },
      {
        key: "text",
        label: "Text to Classify",
        type: "textarea",
        placeholder: "{{data.message}}",
        required: true,
      },
      {
        key: "categories",
        label: "Categories (comma-separated)",
        type: "text",
        placeholder: "positive, neutral, negative",
        required: true,
        description: "The model will return one of these labels.",
      },
    ],
  },

  // ── AI Summarize ─────────────────────────────────────────────────────────────
  {
    id: "ai.summarize",
    label: "Summarize",
    description: "Summarize a long piece of text with AI.",
    category: "ai",
    icon: "i-lucide-file-text",
    color: "#059669",
    ports: [
      { id: "in", label: "Input", direction: "input" },
      { id: "out", label: "Summary", direction: "output" },
    ],
    configSchema: [
      {
        key: "model",
        label: "Model",
        type: "select",
        defaultValue: "gpt-4o-mini",
        options: [
          { label: "GPT-4o Mini (OpenAI)", value: "gpt-4o-mini" },
          { label: "GPT-4o (OpenAI)", value: "gpt-4o" },
          { label: "Claude 3 Haiku (Anthropic)", value: "claude-3-haiku" },
          { label: "Gemini 2.0 Flash (Google)", value: "gemini-2.0-flash" },
        ],
      },
      {
        key: "text",
        label: "Text",
        type: "textarea",
        placeholder: "{{data.article}}",
        required: true,
        description: "Long text to summarize.",
      },
      {
        key: "format",
        label: "Summary Format",
        type: "select",
        defaultValue: "paragraph",
        options: [
          { label: "Paragraph", value: "paragraph" },
          { label: "Bullet Points", value: "bullets" },
          { label: "TL;DR (one sentence)", value: "tldr" },
        ],
      },
      {
        key: "maxLength",
        label: "Max Length (words)",
        type: "number",
        defaultValue: 150,
      },
    ],
  },

  // ── AI Agent ─────────────────────────────────────────────────────────────────
  {
    id: "ai.agent",
    label: "AI Agent",
    description:
      "Autonomous agent that uses tools and reasoning to complete a task.",
    category: "ai",
    icon: "i-lucide-cpu",
    color: AI_COLOR,
    ports: [
      { id: "in", label: "Task", direction: "input" },
      { id: "out", label: "Result", direction: "output" },
      { id: "err", label: "Failed", direction: "output" },
    ],
    configSchema: [
      {
        key: "model",
        label: "Model",
        type: "select",
        defaultValue: "gpt-4o",
        options: [
          { label: "GPT-4o (OpenAI)", value: "gpt-4o" },
          {
            label: "Claude 3.5 Sonnet (Anthropic)",
            value: "claude-3-5-sonnet",
          },
          { label: "Gemini 1.5 Pro (Google)", value: "gemini-1.5-pro" },
        ],
      },
      {
        key: "goal",
        label: "Goal",
        type: "textarea",
        placeholder: "Research the company {{data.name}} and return a summary.",
        required: true,
        description: "What the agent should accomplish.",
      },
      {
        key: "maxSteps",
        label: "Max Steps",
        type: "number",
        defaultValue: 10,
        description: "Maximum reasoning steps before stopping.",
      },
    ],
  },
];
