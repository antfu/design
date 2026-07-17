<script setup lang="ts">
// A pill-shaped `DisplayBadge`: same color logic, fully rounded, tighter
// padding for a more label-like (GitHub-style) chip.
import DisplayBadge from './DisplayBadge.vue'

defineProps<{
  /** Display text. */
  text?: string
  /** Base hex/CSS color (wins over the default muted look). */
  color?: string | number | boolean
  /** The app's current color scheme. Falls back to context, then `'light'`. */
  colorScheme?: 'light' | 'dark'
}>()
</script>

<template>
  <DisplayBadge
    :text="text"
    :color="color"
    :color-scheme="colorScheme"
    rounded="full"
    variant="subtle"
    :padding-x="0.65"
    :padding-y="0.15"
    class="text-xs"
  />
</template>
