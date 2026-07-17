<!-- @description a single-line text input, `icon`, `invalid` state. -->
<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    clearable?: boolean
    placeholder?: string
    type?: string
    size?: 'sm' | 'md'
    disabled?: boolean
    /** Render the invalid (red) state. */
    invalid?: boolean
  }>(),
  { type: 'text', size: 'md' },
)

const model = defineModel<string>({ default: '' })
</script>

<template>
  <label
    class="px-2 border rounded bg-base inline-flex gap-2 transition items-center focus-within:ring-2"
    :class="[
      size === 'sm' ? 'h-7 text-sm' : 'h-9',
      invalid ? 'border-red-500/60 focus-within:ring-red-500/40' : 'border-base focus-within:ring-primary-500/40',
      { 'op50 pointer-events-none': disabled },
    ]"
  >
    <span v-if="icon" :class="icon" class="op-fade shrink-0" aria-hidden="true" />
    <slot name="prefix" />
    <input
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      class="color-base outline-none bg-transparent flex-1 min-w-0 placeholder:op-mute"
    >
    <button
      v-if="clearable && model"
      type="button"
      class="op-fade shrink-0 transition hover:op100"
      aria-label="Clear"
      @click="model = ''"
    >
      <span class="i-ph:x" aria-hidden="true" />
    </button>
    <slot name="suffix" />
  </label>
</template>
