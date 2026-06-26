<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui'

defineProps<{
  icon?: string
  disabled?: boolean
}>()

const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <DropdownMenuItem
    :disabled="disabled"
    class="text-sm color-base px-2 py-1.5 outline-none rounded-md flex gap-2 cursor-pointer select-none transition items-center data-[highlighted]:bg-active data-[disabled]:op50 data-[disabled]:pointer-events-none"
    @select="emit('select')"
  >
    <span v-if="icon" :class="icon" class="op-fade" aria-hidden="true" />
    <slot />
  </DropdownMenuItem>
</template>
