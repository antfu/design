<script setup lang="ts">
import { Tooltip as VTooltip } from 'floating-vue'
import { computed } from 'vue'

const props = withDefaults(
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
    /**
     * Anchor the popover to an arbitrary viewport coordinate instead of a
     * trigger element — for floating popovers over a canvas/graph. Pair with
     * `shown` to control visibility programmatically (triggers default to none).
     */
    anchor?: { x: number, y: number }
    disabled?: boolean
  }>(),
  { placement: 'top', distance: 6 },
)

const anchorStyle = computed(() =>
  props.anchor
    ? { position: 'fixed' as const, left: `${props.anchor.x}px`, top: `${props.anchor.y}px`, width: '0', height: '0' }
    : undefined,
)
// When anchored to a coordinate there is no hoverable element, so default to
// manual control unless the caller overrides `triggers`.
const effectiveTriggers = computed(() => props.triggers ?? (props.anchor ? [] : undefined))
</script>

<template>
  <VTooltip
    :placement="placement as any"
    :distance="distance"
    :delay="delay as any"
    :triggers="effectiveTriggers as any"
    :shown="shown"
    :disabled="disabled"
  >
    <span v-if="anchor" :style="anchorStyle" aria-hidden="true" />
    <slot v-else />
    <template #popper>
      <slot name="content">
        {{ content }}
      </slot>
    </template>
  </VTooltip>
</template>
