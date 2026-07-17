<!-- @description a shimmer placeholder block for loading content. -->
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'text' | 'rect' | 'circle'
    width?: string | number
    height?: string | number
    /** Text variant only: number of lines (last is shortened). */
    lines?: number
  }>(),
  { variant: 'text', lines: 1 },
)

function dim(v?: string | number) {
  return typeof v === 'number' ? `${v}px` : v
}

const style = computed(() => ({ width: dim(props.width), height: dim(props.height) }))
const shape = computed(() => (props.variant === 'circle' ? 'rounded-full' : 'rounded'))
</script>

<template>
  <div
    v-if="variant === 'text'"
    class="flex flex-col gap-1.5"
    role="status"
    aria-label="Loading"
    :style="{ width: dim(width) }"
  >
    <span
      v-for="i in lines"
      :key="i"
      class="bg-ambient rounded h-3.5 block animate-pulse"
      :class="{ 'w-3/5': i === lines && lines > 1 }"
    />
  </div>
  <span
    v-else
    class="bg-ambient block animate-pulse"
    :class="shape"
    :style="style"
    role="status"
    aria-label="Loading"
  />
</template>
