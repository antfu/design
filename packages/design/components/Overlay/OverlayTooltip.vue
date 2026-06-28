<script setup lang="ts">
import { Tooltip as VTooltip } from 'floating-vue'

withDefaults(
  defineProps<{
    /** Tooltip text (use the `content` slot for rich content). */
    content?: string
    placement?: string
    distance?: number
    /** Show/hide delay in ms, or `{ show, hide }`. */
    delay?: number | { show?: number, hide?: number }
    /** What triggers the tooltip, e.g. `['hover', 'focus']` or `['click']`. */
    triggers?: string[]
    /** Programmatic open state (bypasses triggers when set). */
    shown?: boolean
    disabled?: boolean
  }>(),
  { placement: 'top', distance: 6 },
)
</script>

<template>
  <VTooltip
    :placement="placement as any"
    :distance="distance"
    :delay="delay as any"
    :triggers="triggers as any"
    :shown="shown"
    :disabled="disabled"
  >
    <slot />
    <template #popper>
      <slot name="content">
        {{ content }}
      </slot>
    </template>
  </VTooltip>
</template>
