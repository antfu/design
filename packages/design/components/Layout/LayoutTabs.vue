<!-- @description underline/segment tabs, `count` chips. -->
<script setup lang="ts">
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'

export interface TabItem {
  value: string
  label?: string
  icon?: string
  /** Optional count chip. */
  count?: number
  /** Render this trigger as a link (nav-style tabs). */
  href?: string
  disabled?: boolean
}

withDefaults(
  defineProps<{
    tabs: TabItem[]
    /** `underline` (default) or `segment` (pill switcher). */
    variant?: 'underline' | 'segment'
    /**
     * For per-tab content panels (named slots keyed by `tab.value`):
     * `true` (default) only mounts the active panel (lazy); `false` keeps every
     * panel in the DOM (`forceMount`).
     */
    lazy?: boolean
  }>(),
  { variant: 'underline', lazy: true },
)

const model = defineModel<string>()
</script>

<template>
  <TabsRoot v-model="model" :class="variant === 'segment' ? '' : 'border-b border-base'">
    <TabsList
      class="flex items-center relative"
      :class="variant === 'segment' ? 'gap-1 p-1 rounded-lg bg-secondary w-max' : 'gap-1'"
    >
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :as="tab.href ? 'a' : 'button'"
        :href="tab.href"
        :disabled="tab.disabled"
        class="text-sm color-muted outline-none flex gap-1.5 transition items-center relative disabled:op50 focus-visible:ring-2 focus-visible:ring-primary-500/40"
        :class="variant === 'segment'
          ? 'px-3 py-1 rounded-md data-[state=active]:bg-base data-[state=active]:color-base data-[state=active]:shadow-sm'
          : 'px-3 py-2 -mb-px border-b-2 border-transparent hover:color-base data-[state=active]:color-active data-[state=active]:border-primary-500 dark:data-[state=active]:border-primary-400'"
      >
        <span v-if="tab.icon" :class="tab.icon" aria-hidden="true" />
        {{ tab.label ?? tab.value }}
        <span
          v-if="tab.count != null"
          class="text-micro font-mono px-1.5 rounded-full bg-active inline-flex h-5 min-w-5 items-center justify-center tabular-nums"
        >{{ tab.count }}</span>
      </TabsTrigger>
      <TabsIndicator v-if="variant === 'underline'" class="rounded-full bg-primary-500 h-0.5 w-[--reka-tabs-indicator-size] translate-x-[--reka-tabs-indicator-position] transition-all duration-200 bottom-0 left-0 absolute" />
    </TabsList>
    <!-- Inline content (render your own) … -->
    <slot />
    <!-- … or per-tab lazy panels via named slots keyed by `tab.value`. -->
    <template v-for="tab in tabs" :key="`panel-${tab.value}`">
      <TabsContent
        v-if="$slots[tab.value]"
        :value="tab.value"
        :force-mount="lazy ? undefined : true"
        class="py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
      >
        <slot :name="tab.value" />
      </TabsContent>
    </template>
  </TabsRoot>
</template>
