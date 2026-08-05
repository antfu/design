<!-- @description a slide-in panel from any `side` (left/right/top/bottom), sized by `width`. -->
<script setup lang="ts">
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'reka-ui'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    side?: 'left' | 'right' | 'top' | 'bottom'
    /**
     * Panel width, overriding the default `w-80`. A number is treated as px;
     * a string is used verbatim (`'32rem'`, `'50vw'`, …). The `max-w-[90vw]`
     * cap still applies. No-op for the `top`/`bottom` sides, which span the
     * full viewport width.
     */
    width?: string | number
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

// Inline style rather than a class so any CSS length works; it wins over `w-80`.
const style = computed(() => {
  if (props.width == null || props.side === 'top' || props.side === 'bottom')
    return undefined
  return { width: typeof props.width === 'number' ? `${props.width}px` : props.width }
})
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="bg-[#ddd]/40 inset-0 fixed z-drawer-backdrop backdrop-blur-sm dark:bg-black/40" data-af-animate />
      <DialogContent
        class="outline-none border-base bg-base flex flex-col shadow-2xl fixed z-drawer-content"
        :class="SIDE_CLASS[side]"
        :style="style"
        data-af-drawer
        :data-side="side"
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
            <span class="i-ph:x" aria-hidden="true" />
          </DialogClose>
        </header>
        <div class="p-4 flex-1 overflow-auto">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="px-4 py-3 border-t border-base flex shrink-0 gap-2 items-center justify-end">
          <slot name="footer" />
        </footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
