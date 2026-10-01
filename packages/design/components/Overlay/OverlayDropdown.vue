<!-- @description a trigger-anchored dropdown menu. -->
<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'reka-ui'
import { usePortalTarget } from '../../composables/portalTarget'

const props = withDefaults(
  defineProps<{
    placement?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    /** Teleport target for the menu; defaults to the enclosing shadow root, else `document.body`. */
    to?: string | HTMLElement
  }>(),
  { placement: 'bottom', align: 'start' },
)

const portalTo = usePortalTarget(() => props.to)
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal :to="portalTo">
      <DropdownMenuContent
        :side="placement"
        :align="align"
        :side-offset="6"
        class="p-1 outline-none border border-base rounded-lg bg-glass:75 min-w-40 shadow-lg z-dropdown"
        data-af-animate
      >
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
