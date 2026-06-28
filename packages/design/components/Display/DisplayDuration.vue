<script setup lang="ts">
import type { DurationUnit } from '../../utils/format'
import { computed } from 'vue'
import { formatDuration, getDurationColor } from '../../utils/format'

const props = withDefaults(
  defineProps<{
    /** Duration value, interpreted in `unit`. */
    ms: number
    /** Input unit: `'ns'`, `'us'`, `'ms'` (default) or `'s'`. */
    unit?: DurationUnit
    /** Tint by severity threshold. */
    colorize?: boolean
    mono?: boolean
  }>(),
  { mono: true, unit: 'ms' },
)

const FACTOR_MS: Record<DurationUnit, number> = { ns: 1e-6, us: 1e-3, ms: 1, s: 1000 }
const parts = computed(() => formatDuration(props.ms, { unit: props.unit }))
const colorClass = computed(() => (props.colorize ? getDurationColor(props.ms * FACTOR_MS[props.unit]) : ''))
</script>

<template>
  <span :class="[colorClass, { 'font-mono tabular-nums': mono }]">
    {{ parts[0] }}<span class="text-xs ml-0.5 op-fade">{{ parts[1] }}</span>
  </span>
</template>
