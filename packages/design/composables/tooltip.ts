/**
 * Native tooltips: the Popover API puts the tooltip in the top layer, and CSS
 * anchor positioning places it next to its trigger. No floating-ui, no
 * Teleport, so a tooltip inside a shadow root stays there and keeps its styles.
 *
 * JS only wires the triggers (hover/focus/click) and the show/hide delays,
 * until `interestfor` ships beyond Chromium. It uses `popover="hint"` where
 * supported (light dismiss and Esc for free) and `popover="manual"` plus its
 * own Esc handling elsewhere.
 *
 * The skin lives in `@antfu/design/styles/tooltip.css` (`[data-af-tooltip]`).
 */
import type { Directive } from 'vue'

export type TooltipPlacement
  = | 'top' | 'top-start' | 'top-end'
    | 'bottom' | 'bottom-start' | 'bottom-end'
    | 'left' | 'left-start' | 'left-end'
    | 'right' | 'right-start' | 'right-end'

export type TooltipTrigger = 'hover' | 'focus' | 'click'

export interface TooltipOptions {
  placement?: TooltipPlacement
  /** Gap between trigger and tooltip, in px. Default `6`. */
  distance?: number
  /** Show/hide delay in ms, or `{ show, hide }`. Default `0`. */
  delay?: number | { show?: number, hide?: number }
  /** Default `['hover', 'focus']`. An empty list means manual control only. */
  triggers?: TooltipTrigger[]
  disabled?: boolean
}

export interface TooltipHandle {
  show: () => void
  hide: () => void
  /** Remove every listener and the anchor name. */
  dispose: () => void
}

// `position-area` for each placement. `start`/`end` align the tooltip's edge
// with the trigger's edge, so it spans away from that edge.
const AREA: Record<TooltipPlacement, string> = {
  'top': 'top',
  'top-start': 'top span-right',
  'top-end': 'top span-left',
  'bottom': 'bottom',
  'bottom-start': 'bottom span-right',
  'bottom-end': 'bottom span-left',
  'left': 'left',
  'left-start': 'left span-bottom',
  'left-end': 'left span-top',
  'right': 'right',
  'right-start': 'right span-bottom',
  'right-end': 'right span-top',
}

let supportsHint: boolean | undefined
function popoverMode(): 'hint' | 'manual' {
  if (supportsHint === undefined) {
    const probe = document.createElement('div')
    probe.setAttribute('popover', 'hint')
    supportsHint = (probe as { popover?: string }).popover === 'hint'
  }
  return supportsHint ? 'hint' : 'manual'
}

let counter = 0

/**
 * Wire `popover` up as the tooltip of `anchor`. Options are read on every
 * event, so a getter over reactive props stays current.
 */
export function bindTooltip(
  anchor: HTMLElement,
  popover: HTMLElement,
  options: () => TooltipOptions,
): TooltipHandle {
  const name = `--af-tooltip-${++counter}`
  popover.id ||= `af-tooltip-${counter}`
  popover.setAttribute('popover', popoverMode())
  popover.setAttribute('role', 'tooltip')
  popover.dataset.afTooltip = ''
  popover.dataset.state = 'closed'
  anchor.style.setProperty('anchor-name', name)
  popover.style.setProperty('position-anchor', name)
  anchor.setAttribute('aria-describedby', popover.id)

  let timer: ReturnType<typeof setTimeout> | undefined
  let shown = false

  function place(): void {
    const { placement = 'top', distance = 6 } = options()
    popover.style.setProperty('position-area', AREA[placement] ?? AREA.top)
    popover.style.margin = `${distance}px`
  }

  // Dismissible, per WCAG 1.4.13. Immediate, ignoring the hide delay.
  function onEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      clearTimeout(timer)
      setShown(false)
    }
  }

  function setShown(value: boolean): void {
    if (shown === value)
      return
    shown = value
    popover.dataset.state = value ? 'open' : 'closed'
    if (value) {
      place()
      popover.showPopover?.()
      document.addEventListener('keydown', onEscape)
    }
    else {
      popover.hidePopover?.()
      document.removeEventListener('keydown', onEscape)
    }
  }

  function delayFor(kind: 'show' | 'hide'): number {
    const { delay = 0 } = options()
    return typeof delay === 'number' ? delay : delay[kind] ?? 0
  }

  function schedule(value: boolean): void {
    clearTimeout(timer)
    if (value && options().disabled)
      return
    const ms = delayFor(value ? 'show' : 'hide')
    if (ms)
      timer = setTimeout(setShown, ms, value)
    else
      setShown(value)
  }

  const has = (trigger: TooltipTrigger): boolean => (options().triggers ?? ['hover', 'focus']).includes(trigger)
  const on = (trigger: TooltipTrigger, value: boolean) => (): void => {
    if (has(trigger))
      schedule(value)
  }
  const enter = on('hover', true)
  const leave = on('hover', false)
  const focus = on('focus', true)
  const blur = on('focus', false)
  const click = (event: Event): void => {
    // The component nests the tooltip inside its trigger wrapper.
    if (has('click') && !popover.contains(event.target as Node))
      schedule(!shown)
  }
  // Light dismiss (`hint` mode) closes it without us.
  const toggle = (event: Event): void => {
    if ((event as ToggleEvent).newState === 'closed')
      setShown(false)
  }

  anchor.addEventListener('pointerenter', enter)
  anchor.addEventListener('pointerleave', leave)
  // Hoverable, per WCAG 1.4.13: moving onto the tooltip keeps it open.
  popover.addEventListener('pointerenter', enter)
  popover.addEventListener('pointerleave', leave)
  anchor.addEventListener('focusin', focus)
  anchor.addEventListener('focusout', blur)
  anchor.addEventListener('click', click)
  popover.addEventListener('toggle', toggle)

  return {
    show: () => schedule(true),
    hide: () => schedule(false),
    dispose() {
      clearTimeout(timer)
      setShown(false)
      anchor.removeEventListener('pointerenter', enter)
      anchor.removeEventListener('pointerleave', leave)
      popover.removeEventListener('pointerenter', enter)
      popover.removeEventListener('pointerleave', leave)
      anchor.removeEventListener('focusin', focus)
      anchor.removeEventListener('focusout', blur)
      anchor.removeEventListener('click', click)
      popover.removeEventListener('toggle', toggle)
      anchor.style.removeProperty('anchor-name')
      if (anchor.getAttribute('aria-describedby') === popover.id)
        anchor.removeAttribute('aria-describedby')
    },
  }
}

/** `v-tooltip` value: the text, or the text plus options. Empty text disables it. */
export type TooltipDirectiveValue = string | (TooltipOptions & { content: string })

interface TooltipState {
  host: HTMLElement
  popover: HTMLElement
  handle: TooltipHandle
  value: TooltipDirectiveValue
}

const states = new WeakMap<HTMLElement, TooltipState>()

function normalize(value: TooltipDirectiveValue): TooltipOptions & { content: string } {
  return typeof value === 'string' ? { content: value } : value
}

/**
 * `v-tooltip="'Copy'"` or `v-tooltip="{ content: 'Copy', placement: 'bottom' }"`.
 *
 * The tooltip is appended to the trigger's root node (the document body, or
 * the enclosing shadow root) rather than into the trigger, so it never becomes
 * part of a button's accessible name. Its wrapper copies the `dark`/`light`
 * class of the trigger's nearest scheme ancestor when shown.
 */
export const vTooltip: Directive<HTMLElement, TooltipDirectiveValue> = {
  mounted(el, { value }) {
    // `display: contents` costs no layout; the class is the scheme hook.
    const host = document.createElement('div')
    host.style.display = 'contents'
    const popover = document.createElement('div')
    host.append(popover)
    const root = el.getRootNode()
    ;(root instanceof ShadowRoot ? root : el.ownerDocument.body).append(host)

    const state: TooltipState = { host, popover, value, handle: undefined! }
    const options = (): TooltipOptions => {
      const { content, ...rest } = normalize(state.value)
      return { ...rest, disabled: rest.disabled || !content }
    }
    state.handle = bindTooltip(el, popover, options)
    popover.textContent = normalize(value).content
    popover.addEventListener('beforetoggle', () => {
      const scheme = el.closest('.dark, .light')
      host.className = scheme ? (scheme.classList.contains('dark') ? 'dark' : 'light') : ''
    })
    states.set(el, state)
  },
  updated(el, { value }) {
    const state = states.get(el)
    if (!state)
      return
    state.value = value
    const { content } = normalize(value)
    state.popover.textContent = content
    if (!content)
      state.handle.hide()
  },
  beforeUnmount(el) {
    const state = states.get(el)
    state?.handle.dispose()
    state?.host.remove()
    states.delete(el)
  },
}
