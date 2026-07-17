<!-- @description a radio-button group bound with `v-model`. -->
<script setup lang="ts">
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'

export interface RadioOption {
  value: string
  label?: string
  disabled?: boolean
}

withDefaults(
  defineProps<{
    options: RadioOption[]
    orientation?: 'horizontal' | 'vertical'
  }>(),
  { orientation: 'vertical' },
)

const model = defineModel<string>()
</script>

<template>
  <RadioGroupRoot
    v-model="model"
    class="flex gap-3"
    :class="orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'"
  >
    <label
      v-for="opt in options"
      :key="opt.value"
      class="text-sm inline-flex gap-2 cursor-pointer select-none items-center"
      :class="{ 'op50 pointer-events-none': opt.disabled }"
    >
      <RadioGroupItem
        :value="opt.value"
        :disabled="opt.disabled"
        class="outline-none border border-base rounded-full bg-base flex h-4 w-4 transition items-center justify-center data-[state=checked]:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/40"
      >
        <RadioGroupIndicator class="rounded-full bg-primary-500 h-2 w-2 block" />
      </RadioGroupItem>
      {{ opt.label ?? opt.value }}
    </label>
  </RadioGroupRoot>
</template>
