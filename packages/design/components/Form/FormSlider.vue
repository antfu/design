<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    /** Show the current value(s) trailing the track. */
    showValue?: boolean
    /** Unit suffix appended to the readout (e.g. `%`, `px`). */
    unit?: string
    /**
     * Offer a toggle that expands a single value into a `[min, max]` band (and
     * collapses it back). Off by default — a plain slider unless asked for.
     */
    expandable?: boolean
    /** Optional reference value, drawn as a tick on the track. */
    default?: number
  }>(),
  { min: 0, max: 100, step: 1 },
)

/** A single value, or a `[min, max]` tuple for a range. */
const model = defineModel<number | number[]>({ default: 50 })

const isRange = computed(() => Array.isArray(model.value))
const values = computed(() => (Array.isArray(model.value) ? model.value : [model.value]))

function clamp(value: number): number {
  return Math.min(Math.max(value, props.min), props.max)
}

function onChange(next: number[]): void {
  model.value = Array.isArray(model.value) ? next : (next[0] ?? 0)
}

function toggle(): void {
  if (Array.isArray(model.value)) {
    const mid = ((model.value[0] ?? props.min) + (model.value[1] ?? props.max)) / 2
    model.value = Math.round(mid / props.step) * props.step
  }
  else {
    const span = props.step * 10
    model.value = [clamp(model.value - span), clamp(model.value + span)]
  }
}

const tickLeft = computed(() =>
  props.default == null ? null : `${((props.default - props.min) / (props.max - props.min)) * 100}%`,
)

const readout = computed(() => `${values.value.join('–')}${props.unit ?? ''}`)
</script>

<template>
  <div class="flex gap-3 items-center" :class="{ 'op50 pointer-events-none': disabled }">
    <SliderRoot
      :model-value="values"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      class="flex flex-1 h-5 select-none items-center touch-none data-[disabled]:pointer-events-none"
      @update:model-value="onChange($event ?? [])"
    >
      <SliderTrack class="rounded-full bg-active grow h-1.5 relative">
        <SliderRange class="rounded-full bg-primary-500 h-full absolute" />
        <span
          v-if="tickLeft"
          class="border border-base bg-base h-3 w-0.5 top-1/2 absolute -translate-x-1/2 -translate-y-1/2"
          :style="{ left: tickLeft }"
          aria-hidden="true"
        />
      </SliderTrack>
      <SliderThumb
        v-for="(_, i) in values"
        :key="i"
        class="outline-none border-2 border-primary-500 rounded-full bg-base h-4 w-4 block shadow transition-shadow focus-visible:ring-2 focus-visible:ring-primary-500/40"
      />
    </SliderRoot>
    <span v-if="showValue" class="text-sm color-muted font-mono whitespace-nowrap tabular-nums">{{ readout }}</span>
    <button
      v-if="expandable"
      type="button"
      class="p0.5 rounded op-fade transition hover:bg-active hover:op100 focus-visible:ring-2 focus-visible:ring-primary-500/40"
      :disabled="disabled"
      :title="isRange ? 'Collapse to a single value' : 'Expand to a range'"
      :aria-label="isRange ? 'Collapse to a single value' : 'Expand to a range'"
      @click="toggle"
    >
      <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
        <path
          v-if="isRange"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          d="M9 8l3 3l3-3M9 16l3-3l3 3"
        />
        <path
          v-else
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          d="M9 7l3-3l3 3M9 17l3 3l3-3"
        />
      </svg>
    </button>
  </div>
</template>
