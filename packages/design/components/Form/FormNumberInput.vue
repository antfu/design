<script setup lang="ts">
import { clamp } from '@antfu/utils'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    /** Increment/decrement applied by the stepper buttons. */
    step?: number
    placeholder?: string
    disabled?: boolean
    /** Render the invalid (red) state. */
    invalid?: boolean
    /** Show the −/+ stepper buttons. */
    controls?: boolean
  }>(),
  { step: 1, controls: true },
)

const model = defineModel<number>()

function bounded(value: number): number {
  return clamp(value, props.min ?? -Infinity, props.max ?? Infinity)
}

function onInput(event: Event): void {
  const raw = (event.target as HTMLInputElement).value
  model.value = raw === '' ? undefined : Number(raw)
}

function stepBy(direction: number): void {
  model.value = bounded((model.value ?? 0) + direction * props.step)
}

const atMin = computed(() => props.min != null && model.value != null && model.value <= props.min)
const atMax = computed(() => props.max != null && model.value != null && model.value >= props.max)
</script>

<template>
  <div
    class="px-2 border rounded bg-base inline-flex gap-1 h-9 transition items-center focus-within:ring-2"
    :class="[
      invalid ? 'border-red-500/60 focus-within:ring-red-500/40' : 'border-base focus-within:ring-primary-500/40',
      { 'op50 pointer-events-none': disabled },
    ]"
  >
    <button
      v-if="controls"
      type="button"
      class="op-fade shrink-0 transition disabled:op-mute hover:op100 disabled:pointer-events-none"
      :disabled="disabled || atMin"
      aria-label="Decrement"
      @click="stepBy(-1)"
    >
      <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M5 12h14" />
      </svg>
    </button>
    <input
      :value="model"
      type="number"
      :min="min"
      :max="max"
      :step="step"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      class="color-base outline-none bg-transparent flex-1 min-w-0"
      @input="onInput"
    >
    <button
      v-if="controls"
      type="button"
      class="op-fade shrink-0 transition disabled:op-mute hover:op100 disabled:pointer-events-none"
      :disabled="disabled || atMax"
      aria-label="Increment"
      @click="stepBy(1)"
    >
      <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 5v14M5 12h14" />
      </svg>
    </button>
  </div>
</template>
