<script setup lang="ts">
import { computed } from 'vue'
import FeedbackSpinner from '../Feedback/FeedbackSpinner.vue'

const props = withDefaults(
  defineProps<{
    /** Render as another element/component (e.g. `RouterLink`). */
    as?: string
    to?: string
    href?: string
    icon?: string
    variant?: 'action' | 'primary' | 'text'
    size?: 'sm' | 'md'
    loading?: boolean
    disabled?: boolean
  }>(),
  { variant: 'action', size: 'md' },
)

const tag = computed(() => {
  if (props.as)
    return props.as
  if (props.href != null || props.to != null)
    return 'a'
  return 'button'
})

const isLink = computed(() => tag.value === 'a')

const variantClass = computed(() => {
  if (props.variant === 'primary')
    return 'btn-primary'
  if (props.variant === 'text')
    return 'inline-flex items-center gap-1.5 op75 hover:op100 transition'
  return props.size === 'sm' ? 'btn-action-sm' : 'btn-action'
})

const disabledState = computed(() => props.disabled || props.loading)
</script>

<template>
  <component
    :is="tag"
    :class="[variantClass, { 'pointer-events-none op-mute': disabledState && isLink }]"
    :href="isLink ? (href ?? to) : undefined"
    :disabled="!isLink ? disabledState : undefined"
    :aria-disabled="disabledState || undefined"
    :aria-busy="loading || undefined"
  >
    <FeedbackSpinner v-if="loading" size="1em" />
    <span v-else-if="icon" :class="icon" aria-hidden="true" />
    <slot />
  </component>
</template>
