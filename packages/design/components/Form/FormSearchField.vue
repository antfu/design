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
      <span class="i-ph:magnifying-glass op-fade shrink-0" aria-hidden="true" />
    </template>
    <template #suffix>
      <DisplayKbd v-if="shortcut && !model" :keys="shortcut" />
    </template>
  </FormTextInput>
</template>
