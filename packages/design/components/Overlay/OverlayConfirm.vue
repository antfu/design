<!-- @description an AlertDialog for a confirm/cancel decision, `variant="danger"` for destructive actions. -->
<script setup lang="ts">
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogRoot, AlertDialogTitle, AlertDialogTrigger } from 'reka-ui'

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
</script>

<template>
  <AlertDialogRoot v-model:open="open">
    <AlertDialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay class="bg-black/40 inset-0 fixed z-modal-backdrop backdrop-blur-sm" data-af-animate />
      <AlertDialogContent
        class="p-4 outline-none border border-base rounded-xl bg-base max-w-sm w-[90vw] shadow-2xl left-1/2 top-1/2 fixed z-modal-content -translate-x-1/2 -translate-y-1/2"
        data-af-modal
      >
        <AlertDialogTitle v-if="title" class="color-base font-medium">
          {{ title }}
        </AlertDialogTitle>
        <AlertDialogDescription v-if="description" class="text-sm mt-1 op-fade">
          {{ description }}
        </AlertDialogDescription>
        <div class="mt-4 flex gap-2 justify-end">
          <AlertDialogCancel class="btn-action" @click="emit('cancel')">
            {{ cancelLabel }}
          </AlertDialogCancel>
          <AlertDialogAction
            class="btn-primary"
            :class="variant === 'danger' ? 'bg-red-500! hover:bg-red-600!' : ''"
            @click="emit('confirm')"
          >
            {{ confirmLabel }}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
