<script setup lang="ts">
import DisplayKbd from '../Display/DisplayKbd.vue'
import FormTextInput from './FormTextInput.vue'

withDefaults(
  defineProps<{
    placeholder?: string
    /** A keyboard hint shown while empty, e.g. `mod+k`. */
    shortcut?: string
    size?: 'sm' | 'md'
  }>(),
  { placeholder: 'Search…' },
)

const model = defineModel<string>({ default: '' })
</script>

<template>
  <FormTextInput v-model="model" :placeholder="placeholder" :size="size" clearable type="search">
    <template #prefix>
      <svg width="1em" height="1em" viewBox="0 0 24 24" class="op-fade shrink-0" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21l-4.3-4.3" />
        </g>
      </svg>
    </template>
    <template #suffix>
      <DisplayKbd v-if="shortcut && !model" :keys="shortcut" />
    </template>
  </FormTextInput>
</template>
