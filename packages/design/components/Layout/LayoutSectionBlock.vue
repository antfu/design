<script setup lang="ts">
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'

defineProps<{
  title?: string
  icon?: string
}>()

const open = defineModel<boolean>('open', { default: true })
</script>

<template>
  <CollapsibleRoot v-model:open="open" class="border border-base rounded-lg overflow-hidden">
    <CollapsibleTrigger
      class="group text-sm font-medium px-3 py-2 outline-none bg-secondary flex gap-2 w-full transition items-center hover:bg-active focus-visible:ring-2 focus-visible:ring-primary-500/40"
    >
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        class="op-fade transition-transform group-data-[state=open]:rotate-90"
        aria-hidden="true"
      >
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m9 6l6 6l-6 6" />
      </svg>
      <span v-if="icon" :class="icon" aria-hidden="true" />
      <slot name="title">
        {{ title }}
      </slot>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div class="p-3">
        <slot />
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
