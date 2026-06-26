<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    status?: 'neutral' | 'low' | 'medium' | 'high' | 'critical' | 'success' | 'error' | 'warning' | 'info'
    label?: string
    /** Animate the dot (e.g. live/running). */
    pulse?: boolean
  }>(),
  { status: 'neutral' },
)

const DOT: Record<NonNullable<typeof props.status>, string> = {
  neutral: 'bg-gray-400',
  low: 'bg-lime-500',
  medium: 'bg-amber-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
}

const dotClass = computed(() => DOT[props.status])
</script>

<template>
  <span class="text-sm inline-flex gap-1.5 items-center">
    <span class="flex h-2 w-2 relative">
      <span v-if="pulse" class="rounded-full opacity-75 inline-flex h-full w-full absolute animate-ping" :class="dotClass" />
      <span class="rounded-full inline-flex h-2 w-2 relative" :class="dotClass" />
    </span>
    <slot>{{ label }}</slot>
  </span>
</template>
