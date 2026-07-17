<!-- @description a single-select segmented control (reka-ui `RadioGroup`) over an `options` list, including a valid `null` segment. -->
<script setup lang="ts">
import { RadioGroupItem, RadioGroupRoot } from 'reka-ui'

export interface SegmentedOption {
  /** The value this segment selects. `null` is valid (e.g. an "any"/unset segment). */
  value: string | number | null
  /** Display label; falls back to the raw `value` (auto-capitalized) when omitted. */
  label?: string
  /** Extra class(es) for this segment's label, e.g. to render an icon font. */
  class?: string
  disabled?: boolean
}

defineProps<{
  options: SegmentedOption[]
}>()

const model = defineModel<string | number | null>()
</script>

<template>
  <RadioGroupRoot v-model="model" class="text-xs border border-base rounded inline-flex w-max overflow-hidden">
    <RadioGroupItem
      v-for="(opt, idx) in options"
      :key="opt.value ?? `null-${idx}`"
      :value="opt.value"
      :disabled="opt.disabled"
      :title="String(opt.label ?? opt.value)"
      class="px-2 py-1 outline-none border-l border-base op-fade transition data-[state=checked]:color-active first:border-l-0 data-[state=checked]:bg-active hover:bg-hover data-[state=checked]:op100 disabled:op-mute hover:op100 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
      :class="[opt.class, opt.label ? '' : 'capitalize']"
    >
      {{ opt.label ?? opt.value }}
    </RadioGroupItem>
  </RadioGroupRoot>
</template>
