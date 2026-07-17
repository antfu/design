<!-- @description collapsible sections from `items`; one entry = a single section, `multiple` for several open at once. -->
<script setup lang="ts">
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'reka-ui'

export interface AccordionEntry {
  value: string
  title?: string
  icon?: string
  /** Plain-text body; use the `#<value>` slot for rich content. */
  text?: string
  disabled?: boolean
}

withDefaults(
  defineProps<{
    items: AccordionEntry[]
    /** Allow several sections open at once. */
    multiple?: boolean
  }>(),
  { multiple: false },
)

const model = defineModel<string | string[]>()
</script>

<template>
  <AccordionRoot
    v-model="model"
    :type="multiple ? 'multiple' : 'single'"
    :collapsible="true"
    class="border border-base rounded-lg overflow-hidden divide-#8882 divide-y"
  >
    <AccordionItem v-for="item in items" :key="item.value" :value="item.value" :disabled="item.disabled">
      <AccordionHeader>
        <AccordionTrigger
          class="group text-sm font-medium px-3 py-2 outline-none bg-base flex gap-2 w-full transition items-center hover:bg-active disabled:op50 focus-visible:ring-2 focus-visible:ring-primary-500/40"
        >
          <span
            class="i-ph:caret-right op-fade transition-transform group-data-[state=open]:rotate-90"
            aria-hidden="true"
          />
          <span v-if="item.icon" :class="item.icon" aria-hidden="true" />
          <span class="text-left flex-1">{{ item.title ?? item.value }}</span>
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent class="text-sm overflow-hidden">
        <div class="px-3 py-2">
          <slot :name="item.value" :item="item">
            {{ item.text }}
          </slot>
        </div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
