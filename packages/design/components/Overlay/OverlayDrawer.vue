<!-- @description a slide-in native `<dialog>` panel from any `side` (left/right/top/bottom), sized by `width`. -->
<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useNativeDialog } from '../../composables/dialog'

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

const native = useNativeDialog(useTemplateRef('dialog'), open)
const { Trigger } = native

// A modal `<dialog>` is `position: fixed; inset: 0; margin: auto` by default:
// pin it to one edge instead.
const SIDE_CLASS = {
  right: 'inset-[0_0_0_auto] h-full max-h-none w-80 max-w-[90vw] [border-width:0_0_0_1px]',
  left: 'inset-[0_auto_0_0] h-full max-h-none w-80 max-w-[90vw] [border-width:0_1px_0_0]',
  top: 'inset-[0_0_auto_0] w-full max-w-none h-1/3 [border-width:0_0_1px_0]',
  bottom: 'inset-[auto_0_0_0] w-full max-w-none h-1/3 [border-width:1px_0_0_0]',
} as const

// Inline style rather than a class so any CSS length works; it wins over `w-80`.
const style = computed(() => {
  if (props.width == null || props.side === 'top' || props.side === 'bottom')
    return undefined
  return { width: typeof props.width === 'number' ? `${props.width}px` : props.width }
})
</script>

<template>
  <Trigger v-if="$slots.trigger">
    <slot name="trigger" />
  </Trigger>
  <dialog
    :id="native.id"
    ref="dialog"
    :closedby="native.closedby"
    :aria-labelledby="title ? `${native.id}-title` : undefined"
    class="color-base m-0 p-0 outline-none border-base border-solid bg-base shadow-2xl"
    :class="SIDE_CLASS[side]"
    :style="style"
    data-af-drawer
    :data-side="side"
  >
    <div class="flex flex-col h-full">
      <header class="px-4 py-3 border-b border-base flex shrink-0 gap-4 items-center justify-between">
        <h2 v-if="title" :id="`${native.id}-title`" class="color-base font-medium">
          {{ title }}
        </h2>
        <div v-if="$slots.description" class="sr-only">
          <slot name="description" />
        </div>
        <slot name="header" />
        <button v-bind="native.closeProps()" class="btn-icon shrink-0 h-7 w-7" aria-label="Close">
          <span class="i-ph:x" aria-hidden="true" />
        </button>
      </header>
      <div class="p-4 flex-1 overflow-auto">
        <slot />
      </div>
      <footer v-if="$slots.footer" class="px-4 py-3 border-t border-base flex shrink-0 gap-2 items-center justify-end">
        <slot name="footer" />
      </footer>
    </div>
  </dialog>
</template>
