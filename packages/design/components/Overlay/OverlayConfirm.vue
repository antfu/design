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
      <AlertDialogOverlay class="bg-[#ddd]/40 inset-0 fixed z-modal-backdrop backdrop-blur-sm dark:bg-black/40" data-af-animate />
      <!-- Centered by the wrapper, whose padding is also the minimum margin — see OverlayModal. -->
      <div class="p-4 flex pointer-events-none items-center inset-0 justify-center fixed z-modal-content sm:p-6">
        <AlertDialogContent
          class="p-4 outline-none border border-base rounded-xl bg-base max-h-full max-w-sm w-full pointer-events-auto shadow-2xl overflow-auto"
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
      </div>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
