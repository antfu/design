<script setup lang="ts">
import { vTooltip } from 'floating-vue'

defineProps<{
  icon?: string
  /** Tooltip text (floating-vue). Requires `@antfu/design/styles/floating-vue.css`. */
  tooltip?: string
  active?: boolean
  disabled?: boolean
  /** Accessible label when the button has no visible text. */
  label?: string
}>()
</script>

<template>
  <button
    v-tooltip="tooltip"
    type="button"
    class="btn-icon"
    :class="{ 'color-active bg-active op100': active }"
    :disabled="disabled"
    :aria-label="label ?? tooltip"
    :aria-pressed="active || undefined"
  >
    <span v-if="icon" :class="icon" aria-hidden="true" />
    <slot />
    <slot name="badge" />
  </button>
</template>
