<!-- @description actions. `variant` action/primary/text, polymorphic `href`/`as`, `icon`, `loading`. -->
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
const isButton = computed(() => tag.value === 'button')
const sm = computed(() => props.size === 'sm')

// One recipe per variant, all three sharing the same box (see `btn-*` in
// `unocss/shortcuts.ts`) so a mixed row of variants aligns. `size` only ever
// changes the type scale — never the padding, which is what used to make
// `primary` a different height from its neighbours.
const variantClass = computed(() => {
  if (props.variant === 'primary')
    return sm.value ? 'btn-primary text-sm' : 'btn-primary'
  if (props.variant === 'text')
    return sm.value ? 'btn-text text-sm' : 'btn-text'
  return sm.value ? 'btn-action-sm' : 'btn-action'
})

// Every recipe carries its own `disabled:` utilities, so the class binding in
// the template only has to cover the non-`<button>` tags (`<a>`, `RouterLink`)
// that the `:disabled` attribute can't reach.
const disabledState = computed(() => props.disabled || props.loading)
</script>

<template>
  <component
    :is="tag"
    :class="[variantClass, { 'pointer-events-none op-mute': disabledState && !isButton }]"
    :href="isLink ? (href ?? to) : undefined"
    :to="as && to != null ? to : undefined"
    :disabled="isButton ? disabledState : undefined"
    :aria-disabled="disabledState || undefined"
    :aria-busy="loading || undefined"
  >
    <FeedbackSpinner v-if="loading" size="1em" />
    <span v-else-if="icon" :class="icon" aria-hidden="true" />
    <slot />
  </component>
</template>
