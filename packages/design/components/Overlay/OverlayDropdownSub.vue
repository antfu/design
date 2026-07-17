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
      class="text-sm color-base px-2 py-1.5 outline-none rounded-md flex gap-2 cursor-default select-none transition items-center data-[highlighted]:bg-hover data-[state=open]:bg-active data-[disabled]:op50 data-[disabled]:pointer-events-none"
    >
      <span v-if="icon" :class="icon" class="op-fade" aria-hidden="true" />
      <span class="flex-1"><slot name="trigger">{{ label }}</slot></span>
      <span class="i-ph:caret-right op-fade" aria-hidden="true" />
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
