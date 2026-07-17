<script setup lang="ts">
import { DropdownMenuCheckboxItem, DropdownMenuItemIndicator } from 'reka-ui'
import DisplayKbd from '../Display/DisplayKbd.vue'

defineProps<{
  disabled?: boolean
  /** Keyboard-shortcut hint shown trailing (a chord string, e.g. `mod+b`). */
  shortcut?: string
}>()

const emit = defineEmits<{ select: [] }>()
/** Checked state — use with `v-model`. */
const model = defineModel<boolean>()
</script>

<template>
  <DropdownMenuCheckboxItem
    v-model="model"
    :disabled="disabled"
    class="text-sm color-base py-1.5 pl-7 pr-2 outline-none rounded-md flex gap-2 cursor-pointer select-none transition items-center relative data-[highlighted]:bg-hover data-[disabled]:op50 data-[disabled]:pointer-events-none"
    @select="emit('select')"
  >
    <DropdownMenuItemIndicator class="color-active inline-flex items-center left-2 absolute">
      <span class="i-ph:check-bold" aria-hidden="true" />
    </DropdownMenuItemIndicator>
    <span class="flex-1"><slot /></span>
    <DisplayKbd v-if="shortcut" :keys="shortcut" class="op-fade" />
  </DropdownMenuCheckboxItem>
</template>
