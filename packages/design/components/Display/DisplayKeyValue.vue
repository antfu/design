<script setup lang="ts">
withDefaults(
  defineProps<{
    /** The label text (falls back slot: `#label`). */
    label?: string
    /** The value (falls back slot: `#default`). */
    value?: string | number
    /** Inline row or stacked stat. */
    orientation?: 'inline' | 'stacked'
    /** Render the value with `font-mono tabular-nums`. */
    mono?: boolean
  }>(),
  { orientation: 'inline', mono: true },
)

defineSlots<{
  /** The value content; falls back to the `value` prop. */
  default?: () => any
  /** The label content; falls back to the `label` prop. */
  label?: () => any
  /** Trailing badge / adornment. */
  badge?: () => any
}>()
</script>

<template>
  <div
    v-if="orientation === 'stacked'"
    class="flex flex-col gap-0.5"
  >
    <span class="text-micro color-faint tracking-wide uppercase">
      <slot name="label">{{ label }}</slot>
    </span>
    <span class="text-lg color-base flex gap-2 items-center" :class="{ 'font-mono tabular-nums': mono }">
      <slot>{{ value }}</slot>
      <slot name="badge" />
    </span>
  </div>
  <div
    v-else
    class="flex gap-2 items-center justify-between"
  >
    <span class="text-sm color-muted">
      <slot name="label">{{ label }}</slot>
    </span>
    <span class="text-sm color-base flex gap-2 items-center" :class="{ 'font-mono tabular-nums': mono }">
      <slot>{{ value }}</slot>
      <slot name="badge" />
    </span>
  </div>
</template>
