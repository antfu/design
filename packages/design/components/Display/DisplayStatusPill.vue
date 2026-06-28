<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    status?: 'neutral' | 'low' | 'medium' | 'high' | 'critical' | 'success' | 'error' | 'warning' | 'info'
    label?: string
    /** Override the dot color with any CSS color (wins over `status`). */
    color?: string
    /** Animate the dot (e.g. live/running). */
    pulse?: boolean
  }>(),
  { status: 'neutral' },
)

// Severity statuses follow the themeable `color-scale-*` tokens (dark-aware) via
// `bg-current`; semantic statuses use fixed palette colors.
const DOT: Record<NonNullable<typeof props.status>, string> = {
  neutral: 'color-scale-neutral bg-current',
  low: 'color-scale-low bg-current',
  medium: 'color-scale-medium bg-current',
  high: 'color-scale-high bg-current',
  critical: 'color-scale-critical bg-current',
  success: 'text-green-500 bg-current',
  error: 'text-red-500 bg-current',
  warning: 'text-amber-500 bg-current',
  info: 'text-blue-500 bg-current',
}

const dotClass = computed(() => (props.color ? '' : DOT[props.status]))
const dotStyle = computed(() => (props.color ? { background: props.color } : undefined))
</script>

<template>
  <span class="text-sm inline-flex gap-1.5 items-center">
    <span class="flex h-2 w-2 relative">
      <span v-if="pulse" class="rounded-full opacity-75 inline-flex h-full w-full absolute animate-ping" :class="dotClass" :style="dotStyle" />
      <span class="rounded-full inline-flex h-2 w-2 relative" :class="dotClass" :style="dotStyle" />
    </span>
    <slot>{{ label }}</slot>
  </span>
</template>
