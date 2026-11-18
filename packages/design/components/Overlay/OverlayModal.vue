<!-- @description a centered native `<dialog>` (`title`, `description`, `#trigger` slot). -->
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useNativeDialog } from '../../composables/dialog'

defineProps<{
  title?: string
  description?: string
}>()

const open = defineModel<boolean>('open')

const native = useNativeDialog(useTemplateRef('dialog'), open)
const { Trigger } = native
</script>

<template>
  <Trigger v-if="$slots.trigger">
    <slot name="trigger" />
  </Trigger>
  <!--
    `showModal()` puts this in the top layer; `m-auto` centers it against the
    UA `inset: 0` (the preflight resets the UA `margin: auto`). The `max-h`
    leaves a 1rem margin; the inner column inherits it, so tall content scrolls
    in the body instead of overflowing.
  -->
  <dialog
    :id="native.id"
    ref="dialog"
    :closedby="native.closedby"
    :aria-labelledby="title ? `${native.id}-title` : undefined"
    :aria-describedby="description ? `${native.id}-description` : undefined"
    class="color-base m-auto p-0 outline-none border border-base rounded-lg bg-base max-h-[calc(100dvh-2rem)] max-w-lg w-[calc(100%-2rem)] shadow-xl overflow-hidden"
    data-af-modal
  >
    <div class="flex flex-col max-h-[inherit]">
      <header v-if="title || description || $slots.header" class="px-3 py-2 border-b border-base flex shrink-0 gap-2 items-start justify-between">
        <div class="min-w-0">
          <h2 v-if="title" :id="`${native.id}-title`" class="color-base font-medium">
            {{ title }}
          </h2>
          <p v-if="description" :id="`${native.id}-description`" class="text-sm op-fade">
            {{ description }}
          </p>
          <slot name="header" />
        </div>
        <button v-bind="native.closeProps()" class="btn-icon shrink-0 h-7 w-7" aria-label="Close">
          <span class="i-ph:x" aria-hidden="true" />
        </button>
      </header>
      <div class="p-3 flex-1 overflow-auto">
        <slot />
      </div>
      <footer v-if="$slots.footer" class="px-2 py-2 border-t border-base flex shrink-0 gap-2 justify-end">
        <slot name="footer" />
      </footer>
    </div>
  </dialog>
</template>
