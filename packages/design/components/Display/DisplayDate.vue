<!-- @description relative time + exact-date tooltip, `colorize` by age, `live`. -->
<script setup lang="ts">
import type { SeverityScale } from '../../utils/format'
import { useIntervalFn } from '@vueuse/core'
import { vTooltip } from 'floating-vue'
import { computed, ref, toRef, watch } from 'vue'
import { formatDateTime, formatTimeAgo, getAgeColor } from '../../utils/format'

const props = withDefaults(
  defineProps<{
    date: number | string | Date
    /** Tint by age (freshness scale). */
    colorize?: boolean
    /** Custom severity thresholds (in ms of age) forwarded to `getAgeColor` (defaults to `AGE_SCALE`). */
    scale?: SeverityScale
    /** Update the relative label over time. */
    live?: boolean
    /**
     * Update interval for the relative label (in ms).
     * @default 30_000
    */
    interval?: number
  }>(),
  { interval: 30_000 },
)

const now = ref(Date.now())

useIntervalFn(
  () => {
    if (props.live)
      now.value = Date.now()
  },
  toRef(props, 'interval'),
)
watch(() => props.date, () => {
  if (props.live)
    now.value = Date.now()
})

const time = computed(() => new Date(props.date).getTime())
const relative = computed(() => formatTimeAgo(time.value, props.live ? now.value : Date.now()))
const exact = computed(() => formatDateTime(time.value))
const colorClass = computed(() => (props.colorize ? getAgeColor(Math.abs(now.value - time.value), props.scale) : ''))
</script>

<template>
  <time v-tooltip="exact" :datetime="new Date(time).toISOString()" :class="colorClass">
    <slot :relative="relative" :exact="exact">{{ relative }}</slot>
  </time>
</template>
