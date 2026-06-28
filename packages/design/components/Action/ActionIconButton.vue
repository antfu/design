<script setup lang="ts">
import { vTooltip } from 'floating-vue'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    icon?: string
    /** Tooltip text (floating-vue). Requires `@antfu/design/styles/floating-vue.css`. */
    tooltip?: string
    active?: boolean
    disabled?: boolean
    /** Accessible label when the button has no visible text. */
    label?: string
    size?: 'sm' | 'md' | 'lg'
    /** Compact, square (non-circular) icon button for dense toolbars. */
    compact?: boolean
    /** Class(es) applied when `active` — overrides the default `color-active bg-active` tint. */
    activeClass?: string
  }>(),
  { size: 'md' },
)

const SIZE: Record<NonNullable<typeof props.size>, string> = {
  sm: 'w-7! h-7! text-sm',
  md: '',
  lg: 'w-11! h-11! text-lg',
}

const baseClass = computed(() => (props.compact ? 'btn-icon-compact' : 'btn-icon'))
const sizeClass = computed(() => (props.compact ? '' : SIZE[props.size]))
const activeStateClass = computed(() => (props.active ? (props.activeClass || 'color-active bg-active op100') : ''))
</script>

<template>
  <button
    v-tooltip="tooltip"
    type="button"
    :class="[baseClass, sizeClass, activeStateClass]"
    :disabled="disabled"
    :aria-label="label ?? tooltip"
    :aria-pressed="active || undefined"
  >
    <span v-if="icon" :class="icon" aria-hidden="true" />
    <slot />
    <slot name="badge" />
  </button>
</template>
