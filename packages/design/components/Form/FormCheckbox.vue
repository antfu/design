<!-- @description a checkbox control bound with `v-model`. -->
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
    v-bind="$attrs"
    class="text-sm inline-flex gap-1.5 cursor-pointer select-none items-center"
    :class="{ 'op-fade saturate-0 pointer-events-none': disabled }"
  >
    <CheckboxRoot v-model="model" :disabled="disabled" :class="root">
      <CheckboxIndicator class="text-white">
        <div class="i-ph:check-bold text-micro text-white mt--1px" aria-hidden="true" />
      </CheckboxIndicator>
    </CheckboxRoot>
    <span><slot>{{ label }}</slot></span>
  </label>
</template>
