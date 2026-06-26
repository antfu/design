<script setup lang="ts">
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'reka-ui'

withDefaults(
  defineProps<{
    title?: string
    side?: 'left' | 'right' | 'top' | 'bottom'
  }>(),
  { side: 'right' },
)

const open = defineModel<boolean>('open')

const SIDE_CLASS = {
  right: 'right-0 top-0 h-full w-80 max-w-[90vw] border-l',
  left: 'left-0 top-0 h-full w-80 max-w-[90vw] border-r',
  top: 'top-0 inset-x-0 h-1/3 border-b',
  bottom: 'bottom-0 inset-x-0 h-1/3 border-t',
} as const
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="bg-black/40 inset-0 fixed z-drawer-backdrop" data-af-animate />
      <DialogContent
        class="outline-none border-base bg-base flex flex-col shadow-2xl fixed z-drawer-content"
        :class="SIDE_CLASS[side]"
      >
        <header class="px-4 py-3 border-b border-base flex shrink-0 gap-4 items-center justify-between">
          <DialogTitle v-if="title" class="color-base font-medium">
            {{ title }}
          </DialogTitle>
          <DialogDescription v-if="$slots.description" class="sr-only">
            <slot name="description" />
          </DialogDescription>
          <slot name="header" />
          <DialogClose class="btn-icon shrink-0 h-7 w-7" aria-label="Close">
            <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </DialogClose>
        </header>
        <div class="p-4 flex-1 overflow-auto">
          <slot />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
