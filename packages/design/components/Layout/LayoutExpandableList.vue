<script setup lang="ts" generic="T">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    items: T[]
    /** How many to show before collapsing. */
    max?: number
    /** Reveal this many more per "Show more" click; omit to reveal all at once. */
    step?: number
    /** Show a control to reverse the list order. */
    reversible?: boolean
  }>(),
  { max: 5 },
)

const slots = defineSlots<{
  default?: (props: { item: T, index: number }) => any
  title?: () => any
}>()

const shown = ref(props.max)
const reversed = ref(false)

const ordered = computed(() => (reversed.value ? [...props.items].reverse() : props.items))
const visible = computed(() => ordered.value.slice(0, shown.value))
const hidden = computed(() => Math.max(0, props.items.length - shown.value))
const expanded = computed(() => shown.value >= props.items.length)
const hasHeader = computed(() => props.reversible || !!slots.title)

function more(): void {
  shown.value = props.step ? Math.min(props.items.length, shown.value + props.step) : props.items.length
}
function showAll(): void {
  shown.value = props.items.length
}
function collapse(): void {
  shown.value = props.max
}
</script>

<template>
  <div>
    <div v-if="hasHeader" class="text-sm mb-1 flex items-center justify-between">
      <slot name="title" />
      <button
        v-if="reversible"
        type="button"
        class="btn-action-sm"
        :aria-pressed="reversed"
        @click="reversed = !reversed"
      >
        <span aria-hidden="true">⇅</span>
        Reverse
      </button>
    </div>
    <div class="relative">
      <template v-for="(item, i) in visible" :key="i">
        <slot :item="item" :index="i" />
      </template>
      <div
        v-if="!expanded"
        class="h-8 pointer-events-none inset-x-0 bottom-0 absolute bg-gradient-more"
      />
    </div>
    <div v-if="hidden > 0 || expanded" class="text-sm mt-1 flex gap-3 items-center">
      <button
        v-if="hidden > 0"
        type="button"
        class="color-active outline-none rounded inline-flex gap-1 items-center hover:underline focus-visible:ring-2 focus-visible:ring-primary-500/40"
        @click="more()"
      >
        Show more
        <span class="text-micro px-1.5 rounded-full bg-active inline-flex h-4 items-center tabular-nums">+{{ hidden }}</span>
      </button>
      <button
        v-if="step && hidden > step"
        type="button"
        class="outline-none rounded op-fade hover:op100 hover:underline focus-visible:ring-2 focus-visible:ring-primary-500/40"
        @click="showAll()"
      >
        Show all
      </button>
      <button
        v-if="expanded && items.length > max"
        type="button"
        class="outline-none rounded op-fade hover:op100 hover:underline focus-visible:ring-2 focus-visible:ring-primary-500/40"
        @click="collapse()"
      >
        Show less
      </button>
    </div>
  </div>
</template>
