<script setup lang="ts">
import { Tooltip as VTooltip } from 'floating-vue'

withDefaults(
  defineProps<{
    /** Tooltip text (use the `content` slot for rich content). */
    content?: string
    placement?: string
    distance?: number
  }>(),
  { placement: 'top', distance: 6 },
)
</script>

<template>
  <VTooltip :placement="placement as any" :distance="distance">
    <slot />
    <template #popper>
      <slot name="content">
        {{ content }}
      </slot>
    </template>
  </VTooltip>
</template>
