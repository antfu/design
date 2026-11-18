<!-- @description a native alert `<dialog>` for a confirm/cancel decision, `variant="danger"` for destructive actions. -->
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useNativeDialog } from '../../composables/dialog'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    /** `danger` paints the confirm button red for destructive actions. */
    variant?: 'default' | 'danger'
  }>(),
  { confirmLabel: 'Confirm', cancelLabel: 'Cancel', variant: 'default' },
)

const emit = defineEmits<{ confirm: [], cancel: [] }>()
const open = defineModel<boolean>('open')

// An alert dialog asks for a decision: Esc cancels, a backdrop click doesn't.
const native = useNativeDialog(useTemplateRef('dialog'), open, { lightDismiss: false })
const { Trigger } = native
</script>

<template>
  <Trigger v-if="$slots.trigger">
    <slot name="trigger" />
  </Trigger>
  <dialog
    :id="native.id"
    ref="dialog"
    role="alertdialog"
    :closedby="native.closedby"
    :aria-labelledby="title ? `${native.id}-title` : undefined"
    :aria-describedby="description ? `${native.id}-description` : undefined"
    class="color-base m-auto p-4 outline-none border border-base rounded-xl bg-base max-h-[calc(100dvh-2rem)] max-w-sm w-[calc(100%-2rem)] shadow-2xl overflow-auto sm:max-h-[calc(100dvh-3rem)]"
    data-af-modal
  >
    <h2 v-if="title" :id="`${native.id}-title`" class="color-base font-medium">
      {{ title }}
    </h2>
    <p v-if="description" :id="`${native.id}-description`" class="text-sm mt-1 op-fade">
      {{ description }}
    </p>
    <div class="mt-4 flex gap-2 justify-end">
      <!-- `autofocus`: open on the least destructive choice. -->
      <button v-bind="native.closeProps()" class="btn-action" autofocus @click="emit('cancel')">
        {{ cancelLabel }}
      </button>
      <button
        v-bind="native.closeProps()"
        class="btn-primary"
        :class="variant === 'danger' ? 'bg-red-500! hover:bg-red-600!' : ''"
        @click="emit('confirm')"
      >
        {{ confirmLabel }}
      </button>
    </div>
  </dialog>
</template>
