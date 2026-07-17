<!-- @description an inline callout — info/success/warning/error. -->
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'info' | 'success' | 'warning' | 'error'
    icon?: string
  }>(),
  { type: 'info' },
)

const COLORS = {
  info: 'bg-blue-400/10 border-blue-500/20 text-blue-700 dark:text-blue-300',
  success: 'bg-green-400/10 border-green-500/20 text-green-700 dark:text-green-300',
  warning: 'bg-amber-400/10 border-amber-500/20 text-amber-700 dark:text-amber-300',
  error: 'bg-red-400/10 border-red-500/20 text-red-700 dark:text-red-300',
} as const

const cls = computed(() => COLORS[props.type])
</script>

<template>
  <div class="text-sm p-3 border rounded-lg flex gap-2" :class="cls" role="note">
    <span v-if="icon" :class="icon" class="mt-0.5 shrink-0" aria-hidden="true" />
    <div class="min-w-0">
      <slot />
    </div>
  </div>
</template>
