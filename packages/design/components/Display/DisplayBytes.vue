<script setup lang="ts">
import { computed } from 'vue'
import { formatBytes, getBytesColor } from '../../utils/format'

const props = withDefaults(
  defineProps<{
    bytes: number
    base?: 1024 | 1000
    colorize?: boolean
    /** When given, also show `bytes / total` as a percent. */
    total?: number
    mono?: boolean
  }>(),
  { mono: true, base: 1024 },
)

const parts = computed(() => formatBytes(props.bytes, { base: props.base }))
const colorClass = computed(() => (props.colorize ? getBytesColor(props.bytes) : ''))
const percent = computed(() =>
  props.total && props.total > 0 ? (props.bytes / props.total) * 100 : undefined,
)
</script>

<template>
  <span :class="[colorClass, { 'font-mono tabular-nums': mono }]">
    {{ parts[0] }}<span class="text-xs ml-0.5 op-fade">{{ parts[1] }}</span><span v-if="percent != null" class="text-xs ml-1 op-mute">{{ percent.toFixed(0) }}%</span>
  </span>
</template>
