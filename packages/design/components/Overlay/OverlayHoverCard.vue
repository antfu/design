<!-- @description a hover-triggered popover with configurable `openDelay`/`closeDelay`. -->
<script setup lang="ts">
import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'reka-ui'
import { usePortalTarget } from '../../composables/portalTarget'

const props = withDefaults(
  defineProps<{
    placement?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    openDelay?: number
    closeDelay?: number
    /** Teleport target for the card; defaults to the enclosing shadow root, else `document.body`. */
    to?: string | HTMLElement
  }>(),
  { placement: 'bottom', align: 'center', openDelay: 200, closeDelay: 150 },
)

const portalTo = usePortalTarget(() => props.to)
</script>

<template>
  <HoverCardRoot :open-delay="openDelay" :close-delay="closeDelay">
    <HoverCardTrigger as-child>
      <slot name="trigger" />
    </HoverCardTrigger>
    <HoverCardPortal :to="portalTo">
      <HoverCardContent
        :side="placement"
        :align="align"
        :side-offset="6"
        class="text-sm p-3 outline-none border border-base rounded-lg bg-glass:75 max-w-xs shadow-lg z-dropdown"
        data-af-animate
      >
        <slot />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
