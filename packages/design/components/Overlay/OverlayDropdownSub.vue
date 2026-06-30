<script setup lang="ts">
import { DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from 'reka-ui'

defineProps<{
  /** Submenu trigger label (or use the `trigger` slot for rich content). */
  label?: string
  /** Optional leading icon class for the trigger. */
  icon?: string
  disabled?: boolean
}>()
</script>

<template>
  <DropdownMenuSub>
    <DropdownMenuSubTrigger
      :disabled="disabled"
      class="text-sm color-base px-2 py-1.5 outline-none rounded-md flex gap-2 cursor-default select-none transition items-center data-[highlighted]:bg-active data-[state=open]:bg-active data-[disabled]:op50 data-[disabled]:pointer-events-none"
    >
      <span v-if="icon" :class="icon" class="op-fade" aria-hidden="true" />
      <span class="flex-1"><slot name="trigger">{{ label }}</slot></span>
      <svg class="op-fade" width="0.85em" height="0.85em" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m9 6l6 6l-6 6" />
      </svg>
    </DropdownMenuSubTrigger>
    <DropdownMenuPortal>
      <DropdownMenuSubContent
        :side-offset="4"
        :align-offset="-4"
        class="p-1 outline-none border border-base rounded-lg bg-base min-w-40 shadow-lg z-dropdown"
        data-af-animate
      >
        <slot />
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  </DropdownMenuSub>
</template>
