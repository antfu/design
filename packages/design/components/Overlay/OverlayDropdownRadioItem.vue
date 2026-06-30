<script setup lang="ts">
import { DropdownMenuItemIndicator, DropdownMenuRadioItem } from 'reka-ui'

defineProps<{
  /** The unique value selected when this item is chosen. */
  value: string | number
  disabled?: boolean
}>()

const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <DropdownMenuRadioItem
    :value="value"
    :disabled="disabled"
    class="text-sm color-base py-1.5 pl-7 pr-2 outline-none rounded-md flex gap-2 cursor-pointer select-none transition items-center relative data-[highlighted]:bg-active data-[disabled]:op50 data-[disabled]:pointer-events-none"
    @select="emit('select')"
  >
    <DropdownMenuItemIndicator class="color-active inline-flex items-center left-2.5 absolute">
      <span class="rounded-full bg-current h-1.5 w-1.5 block" aria-hidden="true" />
    </DropdownMenuItemIndicator>
    <span class="flex-1"><slot /></span>
  </DropdownMenuRadioItem>
</template>
