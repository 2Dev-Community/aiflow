<template>
  <div>
    <UPageHero
      title="Visual Automation for AIFlow"
      description="Build powerful, automated workflows with our intuitive visual builder. Connect your apps, transform data, and streamline your processes without writing a single line of code."
      :links="[
        {
          label: 'Go to Workflows',
          to: '/workflow',
          trailingIcon: 'i-lucide-arrow-right',
          size: 'xl',
        },
        {
          label: 'View on GitHub',
          to: 'https://github.com/next-ui-templates/starter',
          target: '_blank',
          icon: 'i-simple-icons-github',
          size: 'xl',
          color: 'neutral',
          variant: 'subtle',
        },
      ]"
    />

    <UPageSection
      id="features"
      title="A Professional-Grade Workflow Builder"
      description="Everything you need to create, manage, and monitor complex automations."
      :features="[
        {
          icon: 'i-lucide-workflow',
          title: 'Visual Node-Based Editor',
          description:
            'Drag and drop nodes to create complex logic. Our editor is fast, reactive, and supports undo/redo and zoom.',
        },
        {
          icon: 'i-lucide-palette',
          title: 'Fully Themeable UI',
          description:
            'Beautiful by default with full light and dark mode support. Every component is designed to feel premium and professional.',
        },
        {
          icon: 'i-lucide-zap',
          title: 'Instant Preview & Testing',
          description:
            'Test your workflows in real-time. Our reactive edges and inspector provide immediate feedback as you build.',
        },
        {
          icon: 'i-lucide-blocks',
          title: 'Extensible Node Library',
          description:
            'Choose from a growing library of triggers, actions, and logic nodes. Easily extend with your own custom blocks.',
        },
        {
          icon: 'i-lucide-mouse-pointer-2',
          title: 'Intuitive Interactions',
          description:
            'Smooth panning, zooming, and connection drawing. We\'ve polished every interaction for the best developer experience.',
        },
        {
          icon: 'i-lucide-layout',
          title: 'Built-in MiniMap',
          description:
            'Never get lost in complex workflows. Our mini-map provides a high-level overview of even the largest automations.',
        },
      ]"
    />

    <UPageSection
      id="ai-intel"
      title="The Intelligence of AIFlow"
      description="More than just a canvas. Our proprietary AI engine works in the background to ensure your automations are resilient, efficient, and error-free."
      align="right"
      :features="[
        {
          icon: 'i-lucide-brain-circuit',
          title: 'Predictive Node Placement',
          description:
            'AIFlow suggests the most likely next node based on your current workflow context, saving you time.',
        },
        {
          icon: 'i-lucide-shield-alert',
          title: 'Autonomous Error Recovery',
          description:
            'Our AI detects potential failure points and suggests alternate paths or retry logic before you even ship.',
        },
        {
          icon: 'i-lucide-sparkles',
          title: 'Workflow Optimization',
          description:
            'Identify bottlenecks automatically. The AI analyzes your execution paths and suggests more efficient logic.',
        },
      ]"
    >
      <template #default>
        <div class="relative group">
          <div
            class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
          ></div>
          <div
            class="relative bg-white dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800 p-8 rounded-2xl"
          >
            <div class="flex items-center gap-4 mb-6">
              <div class="p-3 bg-primary-500/10 rounded-xl">
                <UIcon
                  name="i-lucide-brain"
                  class="text-3xl text-primary-500"
                />
              </div>
              <div>
                <h4 class="font-bold">Neural Engine v2.4</h4>
                <p class="text-xs text-neutral-500">
                  Processing real-time telemetry
                </p>
              </div>
            </div>
            <div class="space-y-4">
              <div
                class="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden"
              >
                <div class="h-full bg-primary-500 w-[78%] animate-pulse"></div>
              </div>
              <div class="flex justify-between text-xs font-mono">
                <span>ANALYZING BRANCHES...</span>
                <span class="text-primary-500">OPTIMAL</span>
              </div>
              <div
                class="p-4 bg-primary-500/5 rounded-lg border border-primary-500/10"
              >
                <p class="text-[10px] font-mono text-primary-400">
                  > Recommendation: Replace [Action.HTTP] with [Action.Batch] to
                  reduce latency by 140ms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UPageSection>

    <UPageSection
      id="templates"
      title="Featured Automation Templates"
      description="Start fast with pre-built workflows designed for real-world business challenges."
    >
      <UPageGrid>
        <UPageCard
          title="Lead Management"
          description="Sync CRM leads, qualify with AI, and alert sales via Slack instantly."
          icon="i-lucide-user-plus"
        >
          <template #footer>
            <div class="flex items-center gap-2">
              <div class="flex -space-x-2">
                <div
                  class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white dark:border-neutral-900"
                ></div>
                <div
                  class="w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-neutral-900"
                ></div>
                <div
                  class="w-6 h-6 rounded-full bg-orange-500 border-2 border-white dark:border-neutral-900"
                ></div>
              </div>
              <span class="text-xs text-neutral-500 italic"
                >Integrates Salesforce, Slack, Gmail</span
              >
            </div>
          </template>
        </UPageCard>

        <UPageCard
          title="Incident Response"
          description="Monitor logs, detect anomalies with AI, and trigger custom remediation paths."
          icon="i-lucide-shield-check"
        >
          <template #footer>
            <div class="flex items-center gap-2">
              <div class="flex -space-x-2">
                <div
                  class="w-6 h-6 rounded-full bg-red-500 border-2 border-white dark:border-neutral-900"
                ></div>
                <div
                  class="w-6 h-6 rounded-full bg-neutral-500 border-2 border-white dark:border-neutral-900"
                ></div>
              </div>
              <span class="text-xs text-neutral-500 italic"
                >Integrates Datadog, Opsgenie</span
              >
            </div>
          </template>
        </UPageCard>

        <UPageCard
          title="Content Generation"
          description="Automate your marketing pipeline. Generate drafts, images, and schedule posts."
          icon="i-lucide-pen-tool"
        >
          <template #footer>
            <div class="flex items-center gap-2">
              <div class="flex -space-x-2">
                <div
                  class="w-6 h-6 rounded-full bg-primary-500 border-2 border-white dark:border-neutral-900"
                ></div>
                <div
                  class="w-6 h-6 rounded-full bg-sky-500 border-2 border-white dark:border-neutral-900"
                ></div>
              </div>
              <span class="text-xs text-neutral-500 italic"
                >Integrates OpenAI, Midjourney, Twitter</span
              >
            </div>
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <UPageSection>
      <UPageCTA
        title="Ready to automate with AIFlow?"
        description="Join thousands of teams building high-performance automations on a platform that grows with you."
        variant="subtle"
        :links="[
          {
            label: 'Get started for free',
            to: '/workflow',
            trailingIcon: 'i-lucide-arrow-right',
            color: 'primary',
          },
        ]"
      />
    </UPageSection>
  </div>
</template>
