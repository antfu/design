<script setup lang="ts">
import { ContextMenuItem } from 'reka-ui'
import DisplayKbd from '../Display/DisplayKbd.vue'

withDefaults(
  defineProps<{
    icon?: string
    disabled?: boolean
    /** `danger` tints the item red for destructive actions. */
    variant?: 'default' | 'danger'
    /** Keyboard-shortcut hint shown trailing (a chord string, e.g. `mod+c`). */
    shortcut?: string
  }>(),
  { variant: 'default' },
)

const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <ContextMenuItem
    :disabled="disabled"
    class="text-sm px-2 py-1.5 outline-none rounded-md flex gap-2 cursor-pointer select-none transition items-center data-[highlighted]:bg-active data-[disabled]:op50 data-[disabled]:pointer-events-none"
    :class="variant === 'danger' ? 'text-red-600 dark:text-red-400 data-[highlighted]:bg-red-500/10' : 'color-base'"
    @select="emit('select')"
  >
    <span v-if="icon" :class="icon" class="op-fade" aria-hidden="true" />
    <span class="flex-1"><slot /></span>
    <DisplayKbd v-if="shortcut" :keys="shortcut" class="op-fade" />
  </ContextMenuItem>
</template>
