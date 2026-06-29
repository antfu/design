<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

defineOptions({ inheritAttrs: false })

defineProps<{
  label?: string
  disabled?: boolean
}>()

const model = defineModel<boolean>({ default: false })
const root = 'outline-none border border-base rounded bg-base flex h-4 w-4 transition items-center justify-center data-[state=checked]:border-primary-500 data-[state=checked]:bg-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/40'
</script>

<template>
  <!-- Labeled: own the <label> for the common case. -->
  <label
    v-if="label || $slots.default"
    v-bind="$attrs"
    class="text-sm inline-flex gap-2 cursor-pointer select-none items-center"
    :class="{ 'op50 pointer-events-none': disabled }"
  >
    <CheckboxRoot v-model="model" :disabled="disabled" :class="root">
      <CheckboxIndicator class="text-white">
        <svg width="0.8em" height="0.8em" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5" />
        </svg>
      </CheckboxIndicator>
    </CheckboxRoot>
    <span><slot>{{ label }}</slot></span>
  </label>
  <!-- Bare: caller supplies the label/layout. $attrs (id, aria-labelledby, class) land on the control. -->
  <CheckboxRoot v-else v-bind="$attrs" v-model="model" :disabled="disabled" :class="root">
    <CheckboxIndicator class="text-white">
      <svg width="0.8em" height="0.8em" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5" />
      </svg>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
