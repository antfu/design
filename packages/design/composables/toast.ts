/**
 * A controlled toast queue for {@link FeedbackToasts}.
 *
 * The package stays stateless — `FeedbackToasts` is presentational and the *app*
 * owns the list. This composable is the ergonomic owner: create it once and share
 * the returned `toasts` ref with the component, then `add`/`dismiss` from anywhere.
 * Share a single instance app-wide via `provide`/`inject` or a module-level export.
 *
 * @example
 * const { toasts, add, dismiss } = useToast()
 * add('Saved', { type: 'success', duration: 3000 })
 * // <FeedbackToasts :items="toasts" @dismiss="dismiss" />
 */
import type { Ref } from 'vue'
import type { ToastItem, ToastType } from '../components/Feedback/FeedbackToasts.vue'
import { ref } from 'vue'

/** Options accepted when pushing a toast (everything but `id`/`message`). */
export type ToastInput = Omit<ToastItem, 'id' | 'message'> & { id?: ToastItem['id'] }

export interface ToastQueue {
  /** The reactive toast list — pass to `<FeedbackToasts :items>`. */
  toasts: Ref<ToastItem[]>
  /** Push a toast; returns its id. Auto-dismisses after `duration` ms when set. */
  add: (message: string, options?: ToastInput) => ToastItem['id']
  /** Patch an existing toast (e.g. update `progress`). */
  update: (id: ToastItem['id'], patch: Partial<ToastItem>) => void
  /** Remove a toast by id. */
  dismiss: (id: ToastItem['id']) => void
  /** Remove all toasts. */
  clear: () => void
  /** Shorthands that preset `type`. */
  success: (message: string, options?: ToastInput) => ToastItem['id']
  error: (message: string, options?: ToastInput) => ToastItem['id']
  info: (message: string, options?: ToastInput) => ToastItem['id']
  warning: (message: string, options?: ToastInput) => ToastItem['id']
}

let counter = 0

/**
 * Create a toast queue. Stateless package, caller owns the instance.
 *
 * @returns A {@link ToastQueue}.
 */
export function useToast(): ToastQueue {
  const toasts = ref<ToastItem[]>([])

  function dismiss(id: ToastItem['id']): void {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function update(id: ToastItem['id'], patch: Partial<ToastItem>): void {
    const item = toasts.value.find(t => t.id === id)
    if (item)
      Object.assign(item, patch)
  }

  function add(message: string, options: ToastInput = {}): ToastItem['id'] {
    const { id = `t${++counter}`, duration, ...rest } = options
    toasts.value.push({ id, message, ...rest })
    if (duration != null && duration > 0)
      setTimeout(dismiss, duration, id)
    return id
  }

  const withType = (type: ToastType) => (message: string, options: ToastInput = {}) =>
    add(message, { type, ...options })

  return {
    toasts,
    add,
    update,
    dismiss,
    clear: () => { toasts.value = [] },
    success: withType('success'),
    error: withType('error'),
    info: withType('info'),
    warning: withType('warning'),
  }
}
