<script setup lang="ts">
import DisplayBadge from './DisplayBadge.vue'
import DisplayNumber from './DisplayNumber.vue'

withDefaults(
  defineProps<{
    value: number
    prefix?: string
    suffix?: string
    options?: Intl.NumberFormatOptions
    /** DisplayBadge color (palette name, hue, css color); defaults to muted. */
    color?: boolean | number | string
  }>(),
  { color: false },
)
</script>

<template>
  <DisplayBadge :color="color" class="text-micro">
    <!-- Escape hatch: replace the formatted number with custom content. -->
    <slot><DisplayNumber :value="value" :prefix="prefix" :suffix="suffix" :options="options" /></slot>
  </DisplayBadge>
</template>
