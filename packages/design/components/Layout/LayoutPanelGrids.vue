<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Background pattern style. */
    variant?: 'dots' | 'grid'
    /** Pattern cell size in px. */
    size?: number
  }>(),
  { variant: 'dots', size: 16 },
)

// Use the static `bg-dots` / `bg-grid` classes (statically extractable by
// UnoCSS) for the pattern, and override the cell size via inline
// `background-size` — a runtime-built `bg-grid-${size}` class would not be
// generated, so the pattern wouldn't render.
const patternClass = computed(() => (props.variant === 'grid' ? 'bg-grid' : 'bg-dots'))
const sizeStyle = computed(() => ({ backgroundSize: `${props.size}px ${props.size}px` }))
</script>

<template>
  <div class="flex min-h-40 items-center justify-center relative" :class="patternClass" :style="sizeStyle">
    <slot />
  </div>
</template>
