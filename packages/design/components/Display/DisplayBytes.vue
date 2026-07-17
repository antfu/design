<!-- @description humanized size, `colorize`, percent of `total`. -->
<script setup lang="ts">
import type { SeverityScale } from '../../utils/format'
import { computed } from 'vue'
import { formatBytes, getBytesColor } from '../../utils/format'

const props = withDefaults(
  defineProps<{
    bytes: number
    base?: 1024 | 1000
    /** Maximum decimal places before trailing-zero trimming. */
    digits?: number
    colorize?: boolean
    /** Custom severity thresholds forwarded to `getBytesColor` (defaults to `BYTES_SCALE`). */
    scale?: SeverityScale
    /** When given, also show `bytes / total` as a percent. */
    total?: number
    mono?: boolean
  }>(),
  { mono: true, base: 1024 },
)

const parts = computed(() => formatBytes(props.bytes, { base: props.base, digits: props.digits }))
const colorClass = computed(() => (props.colorize ? getBytesColor(props.bytes, props.scale) : ''))
const percent = computed(() =>
  props.total && props.total > 0 ? (props.bytes / props.total) * 100 : undefined,
)
</script>

<template>
  <span :class="[colorClass, { 'font-mono tabular-nums': mono }]" class="inline-flex gap-1 items-center">
    <!-- Leading icon, e.g. a `DisplayFileIcon` or a unit glyph. -->
    <slot v-if="$slots.icon" name="icon" />
    <!-- Escape hatch: override the structure entirely with `[value, unit, percent]`. -->
    <slot :value="parts[0]" :unit="parts[1]" :percent="percent"><span>{{ parts[0] }}<span class="text-xs ml-0.5 op-fade">{{ parts[1] }}</span><span v-if="percent != null" class="text-xs ml-1 op-mute">{{ percent.toFixed(0) }}%</span></span></slot>
  </span>
</template>
