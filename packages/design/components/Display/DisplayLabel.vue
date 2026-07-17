<script setup lang="ts">
// A pill-shaped `DisplayBadge`: same color logic, fully rounded, tighter
// padding for a more label-like (GitHub-style) chip.
import DisplayBadge from './DisplayBadge.vue'

defineProps<{
  /** Display text. */
  text?: string
  /** Base hex/CSS color (wins over the default muted look). */
  color?: string
  /** The app's current color scheme. Falls back to context, then `'light'`. */
  colorScheme?: 'light' | 'dark'
}>()
</script>

<template>
  <DisplayBadge
    :text="text"
    :color="color || false"
    :color-scheme="colorScheme"
    class="text-xs rounded-full!"
    style="padding: 0.15em 0.65em"
  >
    <slot>{{ text }}</slot>
  </DisplayBadge>
</template>
