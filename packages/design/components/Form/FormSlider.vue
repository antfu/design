<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { computed } from 'vue'

withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    /** Show the current value(s) trailing. */
    showValue?: boolean
  }>(),
  { min: 0, max: 100, step: 1 },
)

/** Single value, or a tuple for a range. */
const model = defineModel<number | number[]>({ default: 50 })

const values = computed(() => (Array.isArray(model.value) ? model.value : [model.value]))

function onChange(next: number[]) {
  model.value = Array.isArray(model.value) ? next : (next[0] ?? 0)
}
</script>

<template>
  <div class="flex gap-3 items-center">
    <SliderRoot
      :model-value="values"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      class="flex flex-1 h-5 select-none items-center touch-none data-[disabled]:op50 data-[disabled]:pointer-events-none"
      @update:model-value="onChange($event ?? [])"
    >
      <SliderTrack class="rounded-full bg-active grow h-1.5 relative">
        <SliderRange class="rounded-full bg-primary-500 h-full absolute" />
      </SliderTrack>
      <SliderThumb
        v-for="(_, i) in values"
        :key="i"
        class="outline-none border-2 border-primary-500 rounded-full bg-base h-4 w-4 block shadow transition-shadow focus-visible:ring-2 focus-visible:ring-primary-500/40"
      />
    </SliderRoot>
    <span v-if="showValue" class="text-sm color-muted font-mono tabular-nums">{{ values.join('–') }}</span>
  </div>
</template>
