<script setup lang="ts">
import { computed } from 'vue'
import { labelStyle } from '../../utils/color'

const props = withDefaults(
  defineProps<{
    /** Display text. */
    text?: string
    /** Base hex color; a contrast-aware tinted chip is derived from it. */
    color?: string
    /** The app's current color scheme. */
    colorScheme?: 'light' | 'dark'
  }>(),
  { colorScheme: 'light' },
)

const style = computed(() => {
  if (!props.color)
    return undefined
  const s = labelStyle(props.color, props.colorScheme === 'dark')
  return { color: s.color, background: s.background, borderColor: s.borderColor }
})
</script>

<template>
  <span
    class="text-xs leading-none font-medium px-1.5 py-0.5 border rounded-full inline-flex gap-1 items-center"
    :class="{ 'badge-muted border-transparent': !color }"
    :style="style"
  >
    <slot>{{ text }}</slot>
  </span>
</template>
