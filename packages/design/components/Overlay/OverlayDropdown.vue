<!-- @description a trigger-anchored dropdown menu. -->
<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'reka-ui'

withDefaults(
  defineProps<{
    placement?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
  }>(),
  { placement: 'bottom', align: 'start' },
)
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        :side="placement"
        :align="align"
        :side-offset="6"
        class="p-1 outline-none border border-base rounded-lg bg-base min-w-40 shadow-lg z-dropdown"
        data-af-animate
      >
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
