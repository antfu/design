<script setup lang="ts">
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'

export interface ToggleGroupOption {
  value: string
  label?: string
  icon?: string
  disabled?: boolean
}

withDefaults(
  defineProps<{
    options: ToggleGroupOption[]
    /** Single selection (default) or multi-select. */
    multiple?: boolean
    /** Icon-only segments; pass `label` for the a11y name. */
    iconOnly?: boolean
  }>(),
  { multiple: false },
)

const model = defineModel<string | string[]>()
</script>

<template>
  <ToggleGroupRoot
    v-model="model"
    :type="multiple ? 'multiple' : 'single'"
    class="p-1 rounded-lg bg-secondary inline-flex gap-1 w-max"
  >
    <ToggleGroupItem
      v-for="opt in options"
      :key="opt.value"
      :value="opt.value"
      :disabled="opt.disabled"
      :aria-label="opt.label ?? opt.value"
      class="text-sm color-muted outline-none rounded-md flex gap-1.5 transition items-center data-[state=on]:color-base hover:color-base data-[state=on]:bg-base disabled:op50 focus-visible:ring-2 focus-visible:ring-primary-500/40 data-[state=on]:shadow-sm"
      :class="iconOnly ? 'p-1.5' : 'px-3 py-1'"
    >
      <span v-if="opt.icon" :class="opt.icon" aria-hidden="true" />
      <span v-if="!iconOnly">{{ opt.label ?? opt.value }}</span>
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
