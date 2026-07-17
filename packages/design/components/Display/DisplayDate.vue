<!-- @description relative time + exact-date tooltip, `colorize` by age, `live`. -->
<script setup lang="ts">
import type { SeverityScale } from '../../utils/format'
import { useNow } from '@vueuse/core'
import { vTooltip } from 'floating-vue'
import { computed } from 'vue'
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
  }>(),
  {},
)

const now = useNow({ interval: 30_000 })
const time = computed(() => new Date(props.date).getTime())
const relative = computed(() => formatTimeAgo(time.value, props.live ? now.value.getTime() : Date.now()))
const exact = computed(() => formatDateTime(time.value))
const colorClass = computed(() => (props.colorize ? getAgeColor(Math.abs(now.value.getTime() - time.value), props.scale) : ''))
</script>

<template>
  <time v-tooltip="exact" :datetime="new Date(time).toISOString()" :class="colorClass">
    <slot :relative="relative" :exact="exact">{{ relative }}</slot>
  </time>
</template>
