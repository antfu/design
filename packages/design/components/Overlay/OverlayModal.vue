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
      <DialogOverlay class="bg-[#ddd]/40 inset-0 fixed z-modal-backdrop backdrop-blur-sm dark:bg-black/40" data-af-animate />
      <!--
        Centering lives on this wrapper rather than on the content itself: a
        `left-1/2 -translate-x-1/2` content box double-shifts under Wind4 (whose
        translate utilities use the native `translate` property, which stacks on
        top of the animation's `transform`). The padding here doubles as the
        modal's minimum margin, and makes `max-h-full` mean "viewport minus that
        margin", so tall content scrolls in the body instead of overflowing.
      -->
      <div class="p-4 flex pointer-events-none items-center inset-0 justify-center fixed z-modal-content">
        <DialogContent
          class="outline-none border border-base rounded-lg bg-base flex flex-col max-h-full max-w-lg w-full pointer-events-auto shadow-xl overflow-hidden"
          data-af-modal
        >
          <header v-if="title || description || $slots.header" class="px-3 py-2 border-b border-base flex shrink-0 gap-2 items-start justify-between">
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
          <div class="p-3 flex-1 overflow-auto">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="px-2 py-2 border-t border-base flex shrink-0 gap-2 justify-end">
            <slot name="footer" />
          </footer>
        </DialogContent>
      </div>
    </DialogPortal>
  </DialogRoot>
</template>
