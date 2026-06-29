<script setup lang="ts">
import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'reka-ui'

withDefaults(
  defineProps<{
    placement?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    openDelay?: number
    closeDelay?: number
  }>(),
  { placement: 'bottom', align: 'center', openDelay: 200, closeDelay: 150 },
)
</script>

<template>
  <HoverCardRoot :open-delay="openDelay" :close-delay="closeDelay">
    <HoverCardTrigger as-child>
      <slot name="trigger" />
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        :side="placement"
        :align="align"
        :side-offset="6"
        class="text-sm p-3 outline-none border border-base rounded-lg bg-base max-w-xs shadow-lg z-dropdown"
        data-af-animate
      >
        <slot />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
