<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    clearable?: boolean
    placeholder?: string
    type?: string
    size?: 'sm' | 'md'
    disabled?: boolean
  }>(),
  { type: 'text', size: 'md' },
)

const model = defineModel<string>({ default: '' })
</script>

<template>
  <label
    class="px-2 border border-base rounded bg-base inline-flex gap-2 transition items-center focus-within:ring-2 focus-within:ring-primary-500/40"
    :class="[size === 'sm' ? 'h-7 text-sm' : 'h-9', { 'op50 pointer-events-none': disabled }]"
  >
    <span v-if="icon" :class="icon" class="op-fade shrink-0" aria-hidden="true" />
    <slot name="prefix" />
    <input
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="color-base outline-none bg-transparent flex-1 min-w-0 placeholder:op-mute"
    >
    <button
      v-if="clearable && model"
      type="button"
      class="op-fade shrink-0 transition hover:op100"
      aria-label="Clear"
      @click="model = ''"
    >
      <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
    <slot name="suffix" />
  </label>
</template>
