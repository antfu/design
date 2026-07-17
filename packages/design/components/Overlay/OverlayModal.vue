<!-- @description a centered dialog (`title`, `description`, `#trigger` slot). -->
<script setup lang="ts">
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'reka-ui'

defineProps<{
  title?: string
  description?: string
}>()

const open = defineModel<boolean>('open')
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="bg-black/40 inset-0 fixed z-modal-backdrop backdrop-blur-sm" data-af-animate />
      <DialogContent
        class="outline-none border border-base rounded-xl bg-base max-w-lg w-[90vw] shadow-2xl left-1/2 top-1/2 fixed z-modal-content -translate-x-1/2 -translate-y-1/2"
        data-af-modal
      >
        <header v-if="title || description || $slots.header" class="px-4 py-3 border-b border-base flex gap-4 items-start justify-between">
          <div class="min-w-0">
            <DialogTitle v-if="title" class="color-base font-medium">
              {{ title }}
            </DialogTitle>
            <DialogDescription v-if="description" class="text-sm op-fade">
              {{ description }}
            </DialogDescription>
            <slot name="header" />
          </div>
          <DialogClose class="btn-icon shrink-0 h-7 w-7" aria-label="Close">
            <span class="i-ph:x" aria-hidden="true" />
          </DialogClose>
        </header>
        <div class="p-4">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="px-4 py-3 border-t border-base flex gap-2 justify-end">
          <slot name="footer" />
        </footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
