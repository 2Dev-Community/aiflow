<template>
  <footer
    class="bg-slate-50 dark:bg-slate-900 border-t border-black/[0.05] dark:border-white/[0.05] py-16 pb-8"
  >
    <div class="max-w-[1400px] mx-auto px-6">
      <!-- Top Section -->
      <div class="flex flex-col md:flex-row md:justify-between gap-12 mb-16">
        <div class="max-w-[300px]">
          <div
            class="text-[18px] font-[800] tracking-[-0.02em] text-slate-900 dark:text-slate-100 mb-4"
          >
            <span>AIFlow</span>
          </div>
          <p
            class="text-[14px] leading-[1.6] text-slate-500 dark:text-slate-400"
          >
            The next generation of visual automation powered by AIFlow.
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-16">
          <div class="flex flex-col">
            <h4
              class="text-[14px] font-[700] text-slate-800 dark:text-slate-100 mb-5 uppercase tracking-[0.05em]"
            >
              Product
            </h4>
            <ul class="list-none p-0 m-0 flex flex-col gap-3">
              <li>
                <NuxtLink
                  to="/#features"
                  class="text-[14px] text-slate-500 dark:text-slate-400 no-underline transition-colors duration-150 hover:text-primary-500"
                  >Features</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/#templates"
                  class="text-[14px] text-slate-500 dark:text-slate-400 no-underline transition-colors duration-150 hover:text-primary-500"
                  >Templates</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/workflow"
                  class="text-[14px] text-slate-500 dark:text-slate-400 no-underline transition-colors duration-150 hover:text-primary-500"
                  >Workflow Builder</NuxtLink
                >
              </li>
            </ul>
          </div>

          <div class="flex flex-col">
            <h4
              class="text-[14px] font-[700] text-slate-800 dark:text-slate-100 mb-5 uppercase tracking-[0.05em]"
            >
              Resources
            </h4>
            <ul class="list-none p-0 m-0 flex flex-col gap-3">
              <li>
                <NuxtLink
                  to="#"
                  class="text-[14px] text-slate-500 dark:text-slate-400 no-underline transition-colors duration-150 hover:text-primary-500"
                  >Documentation</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="#"
                  class="text-[14px] text-slate-500 dark:text-slate-400 no-underline transition-colors duration-150 hover:text-primary-500"
                  >API Reference</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="#"
                  class="text-[14px] text-slate-500 dark:text-slate-400 no-underline transition-colors duration-150 hover:text-primary-500"
                  >Community</NuxtLink
                >
              </li>
            </ul>
          </div>

          <div class="flex flex-col">
            <h4
              class="text-[14px] font-[700] text-slate-800 dark:text-slate-100 mb-5 uppercase tracking-[0.05em]"
            >
              Support
            </h4>
            <ul class="list-none p-0 m-0 flex flex-col gap-3">
              <li>
                <NuxtLink
                  to="#"
                  class="text-[14px] text-slate-500 dark:text-slate-400 no-underline transition-colors duration-150 hover:text-primary-500"
                  >Help Center</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="#"
                  class="text-[14px] text-slate-500 dark:text-slate-400 no-underline transition-colors duration-150 hover:text-primary-500"
                  >Contact Us</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="#"
                  class="text-[14px] text-slate-500 dark:text-slate-400 no-underline transition-colors duration-150 hover:text-primary-500"
                  >Status</NuxtLink
                >
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div
        class="pt-8 border-t border-black/[0.05] dark:border-white/[0.05] flex items-center justify-between"
      >
        <div class="flex items-center">
          <p class="text-[13px] text-slate-500 dark:text-slate-400">
            Built with AIFlow • © {{ new Date().getFullYear() }}
          </p>
        </div>

        <div class="flex items-center">
          <a
            href="https://github.com/nuxt-ui-templates/starter"
            target="_blank"
            class="text-slate-500 dark:text-slate-400 transition-colors duration-150 hover:text-slate-800 dark:hover:text-slate-100"
            aria-label="GitHub"
          >
            <UIcon name="i-simple-icons-github" class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
