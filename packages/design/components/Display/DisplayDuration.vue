<script setup lang="ts">
import { computed } from 'vue'
import { formatDuration, getDurationColor } from '../../utils/format'

const props = withDefaults(
  defineProps<{
    /** Duration in milliseconds. */
    ms: number
    /** Tint by severity threshold. */
    colorize?: boolean
    mono?: boolean
  }>(),
  { mono: true },
)

const parts = computed(() => formatDuration(props.ms))
const colorClass = computed(() => (props.colorize ? getDurationColor(props.ms) : ''))
</script>

<template>
  <span :class="[colorClass, { 'font-mono tabular-nums': mono }]">
    {{ parts[0] }}<span class="text-xs ml-0.5 op-fade">{{ parts[1] }}</span>
  </span>
</template>
