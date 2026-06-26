<script lang="ts">
export type ToastType = 'info' | 'success' | 'warning' | 'error'

/** A single toast. The **app** owns the list and the ids — this component is presentational. */
export interface ToastItem {
  /** Stable identity, echoed back by the `dismiss` event. */
  id: string | number
  message: string
  title?: string
  type?: ToastType
  /** Leading icon class (e.g. `i-ph:check-circle`). */
  icon?: string
  /** Auto-dismiss after this many ms (handled by `useToast`, not this component). */
  duration?: number
  /** Determinate progress, 0–1 — renders a progress bar (e.g. a download/scan). */
  progress?: number
  /** Optional action button label; pressing it fires the `action` event. */
  action?: string
}
</script>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /** The toast list — owned and mutated by the app (e.g. a local `ref`). */
    items: ToastItem[]
    position?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
  }>(),
  { position: 'bottom-right' },
)

const emit = defineEmits<{
  /** Fired when a toast's close button is pressed; the app removes it from `items`. */
  dismiss: [id: string | number]
  /** Fired when a toast's action button is pressed. */
  action: [id: string | number]
}>()

const POSITION = {
  'top-right': 'top-4 right-4',
  'bottom-right': 'bottom-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-left': 'bottom-4 left-4',
} as const

const TYPE_CLASS: Record<ToastType, string> = {
  info: 'color-active',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-amber-600 dark:text-amber-400',
  error: 'text-red-600 dark:text-red-400',
}
</script>

<template>
  <Teleport to="body">
    <div
      class="flex flex-col gap-2 max-w-[calc(100vw-2rem)] w-80 fixed z-toast"
      :class="POSITION[position]"
      role="region"
      aria-label="Notifications"
    >
      <TransitionGroup
        enter-active-class="transition duration-250 ease-out"
        leave-active-class="transition duration-250 ease-out absolute w-full"
        enter-from-class="op0 translate-y-2 scale-98"
        leave-to-class="op0 translate-y-2 scale-98"
      >
        <div
          v-for="item in items"
          :key="item.id"
          class="p-3 border border-base rounded-lg bg-glass flex gap-2 shadow-lg items-start"
          role="status"
          aria-live="polite"
        >
          <span v-if="item.icon" :class="[item.icon, TYPE_CLASS[item.type ?? 'info']]" class="mt-0.5 shrink-0" aria-hidden="true" />
          <div class="flex-1 min-w-0">
            <div v-if="item.title" class="text-sm font-medium" :class="TYPE_CLASS[item.type ?? 'info']">
              {{ item.title }}
            </div>
            <div class="text-sm color-muted break-words">
              {{ item.message }}
            </div>
            <div v-if="item.progress != null" class="mt-1.5 rounded-full bg-active h-1 w-full overflow-hidden">
              <div class="rounded-full h-full transition-all duration-300" :class="TYPE_CLASS[item.type ?? 'info']" style="background: currentColor" :style="{ width: `${Math.round(Math.max(0, Math.min(1, item.progress)) * 100)}%` }" />
            </div>
            <button
              v-if="item.action"
              type="button"
              class="text-sm font-medium mt-1.5 outline-none rounded hover:underline focus-visible:ring-2 focus-visible:ring-primary-500/40"
              :class="TYPE_CLASS[item.type ?? 'info']"
              @click="emit('action', item.id)"
            >
              {{ item.action }}
            </button>
          </div>
          <button type="button" class="op-fade shrink-0 transition hover:op100" aria-label="Dismiss" @click="emit('dismiss', item.id)">
            <svg width="0.9em" height="0.9em" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
