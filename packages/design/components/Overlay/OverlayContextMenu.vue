<!-- @description a right-click menu. -->
<script setup lang="ts">
import { ContextMenuContent, ContextMenuPortal, ContextMenuRoot, ContextMenuTrigger } from 'reka-ui'
import { usePortalTarget } from '../../composables/portalTarget'

const props = defineProps<{
  disabled?: boolean
  /** Teleport target for the menu; defaults to the enclosing shadow root, else `document.body`. */
  to?: string | HTMLElement
}>()

const portalTo = usePortalTarget(() => props.to)
</script>

<template>
  <ContextMenuRoot>
    <ContextMenuTrigger :disabled="disabled" as-child>
      <slot name="trigger" />
    </ContextMenuTrigger>
    <ContextMenuPortal :to="portalTo">
      <ContextMenuContent
        :collision-padding="8"
        class="p-1 outline-none border border-base rounded-lg bg-glass:75 min-w-40 shadow-lg z-dropdown"
        data-af-animate
      >
        <slot />
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
