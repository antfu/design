<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Progress from 0 to 1. Omit for an indeterminate (animated) bar. */
    value?: number
    /** Track height in pixels. */
    height?: number
    /**
     * Bar color. A CSS color (`#…`, `rgb(…)`, `hsl(…)`, `var(…)`) is applied as
     * a background; any other string is treated as a utility/token class.
     * Defaults to `bg-primary-500`.
     */
    color?: string
    /** Round the track and bar ends. */
    rounded?: boolean
    /** Accessible label, exposed as `aria-label`. */
    label?: string
  }>(),
  { height: 6, rounded: true },
)

function isCssColor(value: string): boolean {
  return /^#|^hsl|^rgb|^var\(/.test(value)
}

const indeterminate = computed(() => props.value == null)

const clamped = computed(() => Math.min(Math.max(props.value ?? 0, 0), 1))

const valueNow = computed(() => (indeterminate.value ? undefined : Math.round(clamped.value * 100)))

const colorClass = computed(() =>
  props.color == null
    ? 'bg-primary-500'
    : isCssColor(props.color)
      ? ''
      : props.color,
)

const colorStyle = computed(() =>
  props.color != null && isCssColor(props.color) ? { background: props.color } : undefined,
)

const barStyle = computed(() => ({
  ...colorStyle.value,
  ...(indeterminate.value ? {} : { width: `${clamped.value * 100}%` }),
}))
</script>

<template>
  <div
    class="bg-active w-full overflow-hidden"
    :class="{ 'rounded-full': rounded }"
    :style="{ height: `${height}px` }"
    role="progressbar"
    :aria-valuenow="valueNow"
    :aria-valuemin="indeterminate ? undefined : 0"
    :aria-valuemax="indeterminate ? undefined : 100"
    :aria-label="label"
  >
    <div
      class="h-full transition-all"
      :class="[colorClass, { 'rounded-full': rounded, 'af-progress-indeterminate w-2/5': indeterminate }]"
      :style="barStyle"
    />
  </div>
</template>

<style scoped>
@keyframes af-progress-slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(350%);
  }
}

.af-progress-indeterminate {
  animation: af-progress-slide 1.2s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .af-progress-indeterminate {
    animation: none;
  }
}
</style>
