<script setup lang="ts">
import { vTooltip } from 'floating-vue'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Render as another element/component (e.g. `RouterLink`). */
    as?: string
    to?: string
    href?: string
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

const tag = computed(() => {
  if (props.as)
    return props.as
  if (props.href != null || props.to != null)
    return 'a'
  return 'button'
})

const isLink = computed(() => tag.value === 'a')
const isButton = computed(() => tag.value === 'button')

const baseClass = computed(() => (props.compact ? 'btn-icon-compact' : 'btn-icon'))
const sizeClass = computed(() => (props.compact ? '' : SIZE[props.size]))
const activeStateClass = computed(() => (props.active ? (props.activeClass || 'color-active bg-active op100') : ''))
</script>

<template>
  <component
    :is="tag"
    v-tooltip="tooltip"
    :type="isButton ? 'button' : undefined"
    :class="[baseClass, sizeClass, activeStateClass, { 'pointer-events-none op-mute': disabled && !isButton }]"
    :href="isLink ? (href ?? to) : undefined"
    :to="as && to != null ? to : undefined"
    :disabled="isButton ? disabled : undefined"
    :aria-disabled="(disabled && !isButton) || undefined"
    :aria-label="label ?? tooltip"
    :aria-pressed="active || undefined"
  >
    <span v-if="icon" :class="icon" aria-hidden="true" />
    <slot />
    <slot name="badge" />
  </component>
</template>
