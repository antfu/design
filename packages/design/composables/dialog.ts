/**
 * Native modal dialogs: `<dialog>` + `showModal()` gives the top layer, the
 * focus trap, the inert page and Esc-to-close. Nothing teleports, so a dialog
 * inside a shadow root stays there and keeps its styles.
 *
 * Triggers and close buttons use invoker commands (`commandfor` +
 * `command="show-modal" | "close"`), with a click fallback where they're
 * unsupported. Backdrop clicks close it via `closedby="any"`, with a JS
 * fallback for browsers that don't support `closedby` yet.
 */
import type { FunctionalComponent, Ref, ShallowRef, VNode } from 'vue'
import { cloneVNode, Comment, Fragment, onBeforeUnmount, useId, watch } from 'vue'

export interface NativeDialogOptions {
  /** Close on a backdrop click. Default `true`; alert dialogs pass `false`. */
  lightDismiss?: boolean
}

export interface NativeDialog {
  /** Bind as `id` on the `<dialog>`. */
  id: string
  /** Bind as `closedby` on the `<dialog>`. */
  closedby: 'any' | 'closerequest'
  /** Props for a button that opens the dialog. */
  openProps: () => Record<string, unknown>
  /** Props for a button that closes the dialog. */
  closeProps: () => Record<string, unknown>
  /** Renders the slotted trigger with {@link NativeDialog.openProps} merged in. */
  Trigger: FunctionalComponent
}

function supportsCommands(): boolean {
  return typeof HTMLButtonElement !== 'undefined' && 'command' in HTMLButtonElement.prototype
}

function supportsClosedBy(): boolean {
  return typeof HTMLDialogElement !== 'undefined' && 'closedBy' in HTMLDialogElement.prototype
}

/**
 * Sync a `v-model:open` ref with a `<dialog>` element.
 *
 * @example
 * const native = useNativeDialog(useTemplateRef('dialog'), open)
 * // <dialog :id="native.id" ref="dialog" :closedby="native.closedby">
 */
export function useNativeDialog(
  el: Readonly<ShallowRef<HTMLDialogElement | null>>,
  open: Ref<boolean | undefined>,
  options: NativeDialogOptions = {},
): NativeDialog {
  const { lightDismiss = true } = options
  const id = useId()

  // A close by any route (Esc, `command="close"`, backdrop) lands here.
  const onClose = (): void => {
    open.value = false
  }
  // An invoker opened it natively; reflect that in the model.
  const onCommand = (event: Event): void => {
    if ((event as Event & { command?: string }).command === 'show-modal')
      open.value = true
  }
  // `closedby` fallback: a click whose target is the dialog itself, outside
  // its box, is a click on the `::backdrop`.
  const onClick = (event: MouseEvent): void => {
    const dialog = el.value
    if (!dialog || event.target !== dialog)
      return
    const r = dialog.getBoundingClientRect()
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)
      dialog.close()
  }

  watch(el, (dialog, previous) => {
    previous?.removeEventListener('close', onClose)
    previous?.removeEventListener('command', onCommand)
    previous?.removeEventListener('click', onClick)
    if (!dialog)
      return
    dialog.addEventListener('close', onClose)
    dialog.addEventListener('command', onCommand)
    if (lightDismiss && !supportsClosedBy())
      dialog.addEventListener('click', onClick)
  }, { flush: 'post' })

  watch([open, el], ([value, dialog]) => {
    if (!dialog)
      return
    if (value && !dialog.open)
      dialog.showModal()
    else if (!value && dialog.open)
      dialog.close()
  }, { flush: 'post', immediate: true })

  onBeforeUnmount(() => {
    if (el.value?.open)
      el.value.close()
  })

  const command = (name: 'show-modal' | 'close', fallback: () => void) => (): Record<string, unknown> =>
    supportsCommands()
      ? { type: 'button', commandfor: id, command: name }
      : { type: 'button', onClick: fallback }

  const openProps = command('show-modal', () => {
    open.value = true
  })
  const closeProps = command('close', () => {
    open.value = false
  })

  // `<slot>` renders as a Fragment, which can't take props: reach the
  // elements/components inside it.
  const withOpenProps = (vnodes: VNode[]): VNode[] => vnodes.flatMap(vnode =>
    vnode.type === Fragment && Array.isArray(vnode.children)
      ? withOpenProps(vnode.children as VNode[])
      : vnode.type === Comment || typeof vnode.type === 'symbol'
        ? [vnode]
        : [cloneVNode(vnode, openProps(), true)])

  const Trigger: FunctionalComponent = (_, { slots }) => withOpenProps(slots.default?.() ?? [])

  return {
    id,
    closedby: lightDismiss ? 'any' : 'closerequest',
    openProps,
    closeProps,
    Trigger,
  }
}
