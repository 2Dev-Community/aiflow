<script setup lang="ts">
useHead({ title: "Workflows | AIFlow" });
definePageMeta({ layout: "workflow" });

const { workflows, createWorkflow, deleteWorkflow, refresh } =
  useWorkflowList();
const router = useRouter();

onMounted(() => refresh());

function openNew() {
  const wf = createWorkflow();
  router.push(`/workflow/${wf.id}`);
}

function openEditor(id: string) {
  router.push(`/workflow/${id}`);
}

const toast = useToast();

const isDeleteModalOpen = ref(false);
const workflowToDelete = ref<string | null>(null);

function handleDelete(id: string) {
  workflowToDelete.value = id;
  isDeleteModalOpen.value = true;
}

function confirmDelete() {
  if (workflowToDelete.value) {
    deleteWorkflow(workflowToDelete.value);
    isDeleteModalOpen.value = false;
    workflowToDelete.value = null;
    toast.add({
      title: "Workflow deleted",
      color: "error",
      icon: "i-lucide-trash-2",
    });
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Page header -->
    <div class="mb-8 border-b border-gray-200 dark:border-gray-700 w-full">
      <div
        class="max-w-[1100px] mx-auto px-6 py-3 flex items-center justify-between gap-4"
      >
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/"
            class="no-underline flex items-center transition-opacity duration-150 hover:opacity-80"
            title="Go to home"
          >
            <span
              class="text-[15px] font-[800] tracking-[-0.02em] whitespace-nowrap text-primary-500 dark:text-primary-400"
            >
              AIFlow
            </span>
          </NuxtLink>
          <div class="w-px h-5 bg-gray-200 dark:bg-gray-800" />

          <div class="flex items-center gap-2">
            <NuxtLink
              to="/workflow"
              class="flex items-center text-sm font-semibold text-gray-900 dark:text-gray-100 no-underline transition-colors duration-150 hover:text-primary-500 dark:hover:text-primary-400"
            >
              <UIcon name="i-lucide-workflow" class="text-sm mr-1.5" />
              Workflows
            </NuxtLink>
          </div>
        </div>

        <div class="flex items-center">
          <UButton
            @click="openNew"
            label="New Workflow"
            icon="i-lucide-plus"
            size="lg"
            color="primary"
            variant="solid"
          />
        </div>
      </div>
    </div>

    <div class="max-w-[1100px] mx-auto px-6 pb-10 w-full">
      <!-- Empty state -->
      <div
        v-if="workflows.length === 0"
        class="flex flex-col items-center p-[80px_24px] border-2 border-dashed border-primary-500/20 rounded-[16px] bg-primary-500/5"
      >
        <div
          class="w-[72px] h-[72px] rounded-full bg-primary-500/10 flex items-center justify-center mb-4"
        >
          <UIcon
            name="i-lucide-workflow"
            class="text-[48px] text-primary-500/40"
          />
        </div>
        <h2
          class="text-[18px] font-semibold text-slate-900 dark:text-slate-100 mb-1.5"
        >
          No workflows yet
        </h2>
        <p class="text-[14px] text-slate-600 dark:text-slate-400">
          Create your first automation workflow to get started.
        </p>
        <button
          class="flex items-center gap-1.5 px-[18px] py-2.25 mt-4 bg-gradient-to-br from-primary-500 to-primary-600 text-white border-none rounded-[9px] text-[13px] font-[600] cursor-pointer shrink-0 transition-all duration-150 shadow-primary-500/35 hover:opacity-90 hover:-translate-y-[1px] hover:shadow-primary-500/45"
          @click="openNew"
        >
          <UIcon name="i-lucide-plus" class="text-sm" />
          Create Workflow
        </button>
      </div>

      <!-- Workflow grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="wf in workflows"
          :key="wf.id"
          class="group rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer transition-all duration-200 bg-white dark:bg-gray-800 flex flex-col hover:-translate-y-[3px] hover:shadow-lg hover:border-primary-500/35"
          @click="openEditor(wf.id)"
        >
          <div class="flex items-start gap-3.5 p-[18px_18px_12px] flex-1">
            <div
              class="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0"
            >
              <UIcon
                name="i-lucide-workflow"
                class="text-primary-500 text-[20px]"
              />
            </div>
            <div class="flex-1 min-w-0 flex flex-col gap-1.5">
              <h3
                class="text-[15px] font-semibold text-slate-900 dark:text-slate-100 truncate"
              >
                {{ wf.name }}
              </h3>
              <div class="flex items-center gap-1.5 flex-wrap">
                <span
                  class="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-full px-2 py-0.5"
                >
                  <UIcon name="i-lucide-box" class="text-[12px]" />
                  {{ wf.nodes.length }} node{{
                    wf.nodes.length !== 1 ? "s" : ""
                  }}
                </span>
                <span
                  class="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-full px-2 py-0.5"
                >
                  <UIcon name="i-lucide-git-branch" class="text-[12px]" />
                  {{ wf.edges.length }} connection{{
                    wf.edges.length !== 1 ? "s" : ""
                  }}
                </span>
              </div>
              <span class="text-[11px] text-slate-400 dark:text-slate-500"
                >Updated {{ formatDate(wf.updatedAt) }}</span
              >
            </div>
          </div>

          <div class="flex gap-2 p-2 justify-end">
            <UPopover>
              <UButton
                icon="i-lucide-more-horizontal"
                color="neutral"
                variant="outline"
                size="sm"
              />
              <template #content>
                <UButton
                  label="Edit"
                  icon="i-lucide-pencil"
                  color="primary"
                  variant="outline"
                  size="sm"
                  @click.stop="openEditor(wf.id)"
                />
                <UButton
                  label="Delete"
                  icon="i-lucide-trash-2"
                  color="neutral"
                  variant="outline"
                  size="sm"
                  @click.stop="handleDelete(wf.id)"
                />
              </template>
            </UPopover>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm deletion modal -->
    <UModal
      v-model:open="isDeleteModalOpen"
      title="Delete Workflow"
      description="Are you sure you want to delete this workflow? This action cannot be undone."
      icon="i-lucide-trash-2"
    >
      <template #body>
        <!-- Modal body can be empty if description is enough, but title and description are built-in -->
      </template>
      <template #footer>
        <UButton
          color="neutral"
          variant="ghost"
          label="Cancel"
          @click="isDeleteModalOpen = false"
        />
        <UButton color="error" label="Delete" @click="confirmDelete" />
      </template>
    </UModal>
  </div>
</template>

<style scoped></style>
