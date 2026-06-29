<script setup lang="ts">
import { Toggle } from 'reka-ui'

defineProps<{
  /** Leading icon class, e.g. `i-ph:text-bolder`. */
  icon?: string
  disabled?: boolean
  label?: string
}>()

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <Toggle
    v-model:pressed="model"
    :disabled="disabled"
    :aria-label="label"
    class="btn-action-sm data-[state=on]:btn-action-active"
  >
    <span v-if="icon" :class="icon" aria-hidden="true" />
    <span v-if="label || $slots.default"><slot>{{ label }}</slot></span>
  </Toggle>
</template>
