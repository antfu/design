<script setup lang="ts" generic="T">
import { useVirtualizer } from '@tanstack/vue-virtual'
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    items: T[]
    /** Estimated item extent in px. */
    estimateSize?: number
    overscan?: number
    horizontal?: boolean
  }>(),
  { estimateSize: 36, overscan: 8 },
)

const parentRef = ref<HTMLElement | null>(null)

const virtualizer = useVirtualizer(computed(() => ({
  count: props.items.length,
  getScrollElement: () => parentRef.value,
  estimateSize: () => props.estimateSize,
  overscan: props.overscan,
  horizontal: props.horizontal,
})))

const rows = computed(() => virtualizer.value.getVirtualItems())
const totalSize = computed(() => virtualizer.value.getTotalSize())
</script>

<template>
  <div ref="parentRef" class="overflow-auto">
    <div :style="{ position: 'relative', [horizontal ? 'width' : 'height']: `${totalSize}px` }">
      <div
        v-for="row in rows"
        :key="row.index"
        :style="{
          position: 'absolute',
          top: 0,
          left: 0,
          [horizontal ? 'height' : 'width']: '100%',
          transform: horizontal ? `translateX(${row.start}px)` : `translateY(${row.start}px)`,
        }"
        :data-index="row.index"
      >
        <slot :item="items[row.index]" :index="row.index" />
      </div>
    </div>
  </div>
</template>
