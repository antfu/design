<!-- @description a virtualized list (`@tanstack/vue-virtual`) for large collections. -->
<script setup lang="ts" generic="T">
import { useVirtualizer, useWindowVirtualizer } from '@tanstack/vue-virtual'
import { computed, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    items: T[]
    /** Estimated item extent in px (the fixed size unless `dynamic`). */
    estimateSize?: number
    overscan?: number
    horizontal?: boolean
    /** Measure each rendered row for variable heights (vs a fixed estimate). */
    dynamic?: boolean
    /** Virtualize against window scroll instead of an inner scroll box (set once). */
    windowScroll?: boolean
  }>(),
  { estimateSize: 36, overscan: 8 },
)

const parentRef = ref<HTMLElement | null>(null)
const scrollMargin = ref(0)
onMounted(() => {
  if (props.windowScroll && parentRef.value)
    scrollMargin.value = parentRef.value.offsetTop
})

const common = computed(() => ({
  count: props.items.length,
  estimateSize: () => props.estimateSize,
  overscan: props.overscan,
  horizontal: props.horizontal,
}))

const virtualizer = props.windowScroll
  ? useWindowVirtualizer(computed(() => ({ ...common.value, scrollMargin: scrollMargin.value })))
  : useVirtualizer(computed(() => ({ ...common.value, getScrollElement: () => parentRef.value })))

const rows = computed(() => virtualizer.value.getVirtualItems())
const totalSize = computed(() => virtualizer.value.getTotalSize())

function offsetOf(start: number): number {
  return start - (props.windowScroll ? scrollMargin.value : 0)
}

function measure(el: Element | null): void {
  if (props.dynamic && el instanceof Element)
    virtualizer.value.measureElement(el)
}

defineExpose({
  /** Scroll a row into view by index. */
  scrollToIndex: (index: number, options?: { align?: 'start' | 'center' | 'end' | 'auto' }) =>
    virtualizer.value.scrollToIndex(index, options),
  /** Scroll to a pixel offset. */
  scrollToOffset: (offset: number, options?: { align?: 'start' | 'center' | 'end' | 'auto' }) =>
    virtualizer.value.scrollToOffset(offset, options),
  /** The underlying TanStack virtualizer. */
  virtualizer,
})
</script>

<template>
  <div ref="parentRef" :class="windowScroll ? '' : 'overflow-auto'">
    <div :style="{ position: 'relative', [horizontal ? 'width' : 'height']: `${totalSize}px` }">
      <div
        v-for="row in rows"
        :key="row.index"
        :ref="dynamic ? (el) => measure(el as Element | null) : undefined"
        :style="{
          position: 'absolute',
          top: 0,
          left: 0,
          [horizontal ? 'height' : 'width']: '100%',
          transform: horizontal ? `translateX(${offsetOf(row.start)}px)` : `translateY(${offsetOf(row.start)}px)`,
        }"
        :data-index="row.index"
      >
        <slot :item="items[row.index]" :index="row.index" />
      </div>
    </div>
  </div>
</template>
