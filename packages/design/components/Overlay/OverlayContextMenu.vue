<script setup lang="ts">
import { ContextMenuContent, ContextMenuPortal, ContextMenuRoot, ContextMenuTrigger } from 'reka-ui'

defineProps<{
  disabled?: boolean
}>()
</script>

<template>
  <ContextMenuRoot>
    <ContextMenuTrigger :disabled="disabled" as-child>
      <slot name="trigger" />
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent
        :collision-padding="8"
        class="p-1 outline-none border border-base rounded-lg bg-base min-w-40 shadow-lg z-dropdown"
        data-af-animate
      >
        <slot />
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
