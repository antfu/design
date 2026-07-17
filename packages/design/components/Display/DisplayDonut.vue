<!-- @description a progress ring. -->
<script setup lang="ts">
import { clamp } from '@antfu/utils'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Progress 0..1. */
    value: number
    size?: number
    thickness?: number
    /** Override the foreground color (defaults to the active token). */
    color?: string
  }>(),
  { size: 36, thickness: 4 },
)

const radius = computed(() => (props.size - props.thickness) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => circumference.value * (1 - clamp(props.value, 0, 1)))
</script>

<template>
  <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="-rotate-90">
    <circle
      :cx="size / 2"
      :cy="size / 2"
      :r="radius"
      fill="none"
      :stroke-width="thickness"
      class="op-mute stroke-current"
    />
    <circle
      :cx="size / 2"
      :cy="size / 2"
      :r="radius"
      fill="none"
      :stroke-width="thickness"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="offset"
      stroke-linecap="round"
      class="transition-all stroke-current"
      :class="{ 'color-active': !color }"
      :style="color ? { color } : undefined"
    />
  </svg>
</template>
