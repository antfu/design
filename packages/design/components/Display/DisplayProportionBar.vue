<script setup lang="ts">
import { computed } from 'vue'
import { getHashColorFromString } from '../../utils/color'

export interface ProportionSegment {
  value: number
  color?: string
  label?: string
}

const props = withDefaults(
  defineProps<{
    segments: ProportionSegment[]
    height?: number
    /** The app's current color scheme. */
    colorScheme?: 'light' | 'dark'
  }>(),
  { height: 8, colorScheme: 'light' },
)

const total = computed(() => props.segments.reduce((sum, s) => sum + s.value, 0) || 1)

function segColor(seg: ProportionSegment, i: number): string {
  return seg.color ?? getHashColorFromString(seg.label ?? String(i), 1, props.colorScheme === 'dark')
}
</script>

<template>
  <div
    class="rounded-full bg-active flex w-full overflow-hidden"
    :style="{ height: `${height}px` }"
  >
    <div
      v-for="(seg, i) in segments"
      :key="i"
      class="h-full"
      :style="{ width: `${(seg.value / total) * 100}%`, background: segColor(seg, i) }"
      :title="seg.label"
    />
  </div>
</template>
