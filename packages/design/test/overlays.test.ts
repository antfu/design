import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, withDirectives } from 'vue'
import OverlayConfirm from '../components/Overlay/OverlayConfirm.vue'
import OverlayDrawer from '../components/Overlay/OverlayDrawer.vue'
import OverlayModal from '../components/Overlay/OverlayModal.vue'
import OverlayTooltip from '../components/Overlay/OverlayTooltip.vue'
import { vTooltip } from '../composables/tooltip'

afterEach(() => {
  document.body.innerHTML = ''
  vi.useRealTimers()
})

/** Mount a dialog component with a two-way `open` model. */
function mountDialog(component: any, props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  const open = ref(false)
  const events: string[] = []
  const wrapper = mount(defineComponent(() => () => h(component, {
    ...props,
    'open': open.value,
    'onUpdate:open': (v: boolean) => open.value = v,
    'onConfirm': () => events.push('confirm'),
    'onCancel': () => events.push('cancel'),
  }, slots)), { attachTo: document.body })
  const dialog = () => document.querySelector('dialog')!
  return { open, events, wrapper, dialog }
}

describe('native dialogs', () => {
  it.each([
    ['modal', OverlayModal],
    ['drawer', OverlayDrawer],
    ['confirm', OverlayConfirm],
  ])('%s opens with showModal() and syncs closes back to v-model', async (_, component) => {
    const { open, dialog } = mountDialog(component, { title: 'Hello' })
    expect(dialog().open).toBe(false)

    open.value = true
    await nextTick()
    expect(dialog().open).toBe(true)

    // Esc, `command="close"` and backdrop clicks all end in a `close` event.
    dialog().close()
    await nextTick()
    expect(open.value).toBe(false)
  })

  it('labels the dialog with its title and description', async () => {
    mountDialog(OverlayModal, { title: 'Settings', description: 'Project options' })
    const dialog = document.querySelector('dialog')!
    expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)?.textContent?.trim()).toBe('Settings')
    expect(document.getElementById(dialog.getAttribute('aria-describedby')!)?.textContent?.trim()).toBe('Project options')
  })

  it('opens from the #trigger slot and closes from the header button', async () => {
    const { open, dialog } = mountDialog(OverlayModal, { title: 'T' }, {
      trigger: () => h('button', { 'data-trigger': '' }, 'Open'),
      default: () => 'Body',
    })
    const trigger = document.querySelector<HTMLButtonElement>('[data-trigger]')!
    // Without invoker-command support (happy-dom), a click fallback is wired.
    trigger.click()
    await nextTick()
    expect(open.value).toBe(true)
    expect(dialog().open).toBe(true)

    document.querySelector<HTMLButtonElement>('[aria-label="Close"]')!.click()
    await nextTick()
    expect(open.value).toBe(false)
    expect(dialog().open).toBe(false)
  })

  it('wires invoker commands where the browser supports them', async () => {
    Object.defineProperty(HTMLButtonElement.prototype, 'command', { configurable: true, value: '' })
    try {
      const { dialog } = mountDialog(OverlayModal, { title: 'T' }, { trigger: () => h('button', { 'data-trigger': '' }, 'Open') })
      const trigger = document.querySelector('[data-trigger]')!
      const close = document.querySelector('[aria-label="Close"]')!
      expect(trigger.getAttribute('commandfor')).toBe(dialog().id)
      expect(close.getAttribute('commandfor')).toBe(dialog().id)
    }
    finally {
      delete (HTMLButtonElement.prototype as any).command
    }
  })

  it('light-dismisses modals and drawers, but not the alert dialog', () => {
    expect(mountDialog(OverlayModal).dialog().getAttribute('closedby')).toBe('any')
    document.body.innerHTML = ''
    expect(mountDialog(OverlayDrawer).dialog().getAttribute('closedby')).toBe('any')
    document.body.innerHTML = ''
    const confirm = mountDialog(OverlayConfirm).dialog()
    expect(confirm.getAttribute('closedby')).toBe('closerequest')
    expect(confirm.getAttribute('role')).toBe('alertdialog')
  })

  it('confirm emits its choice and closes', async () => {
    const { open, events } = mountDialog(OverlayConfirm, { confirmLabel: 'Delete' })
    open.value = true
    await nextTick()
    const [cancel, confirm] = document.querySelectorAll<HTMLButtonElement>('dialog button')
    expect(cancel!.hasAttribute('autofocus')).toBe(true)

    confirm!.click()
    await nextTick()
    expect(events).toEqual(['confirm'])
    expect(open.value).toBe(false)
  })
})

describe('native tooltips', () => {
  function mountTooltip(props: Record<string, unknown> = {}) {
    const wrapper = mount(OverlayTooltip, {
      props: { content: 'Copy', ...props },
      slots: { default: () => h('button', 'Trigger') },
      attachTo: document.body,
    })
    const tip = () => document.querySelector<HTMLElement>('[data-af-tooltip]')!
    const anchor = () => wrapper.element as HTMLElement
    return { wrapper, tip, anchor }
  }

  it('renders a popover tooltip anchored to its trigger', () => {
    const { tip, anchor } = mountTooltip()
    expect(tip().getAttribute('popover')).toMatch(/^(hint|manual)$/)
    expect(tip().getAttribute('role')).toBe('tooltip')
    expect(anchor().getAttribute('aria-describedby')).toBe(tip().id)
    const name = anchor().style.getPropertyValue('anchor-name')
    expect(name).toMatch(/^--af-tooltip-/)
    expect(tip().style.getPropertyValue('position-anchor')).toBe(name)
  })

  it('shows on hover and focus, hides on leave, blur and Escape', async () => {
    const { tip, anchor } = mountTooltip({ placement: 'bottom-start', distance: 8 })
    anchor().dispatchEvent(new PointerEvent('pointerenter'))
    expect(tip().dataset.state).toBe('open')
    expect(tip().style.getPropertyValue('position-area')).toBe('bottom span-right')
    expect(tip().style.margin).toBe('8px')
    anchor().dispatchEvent(new PointerEvent('pointerleave'))
    expect(tip().dataset.state).toBe('closed')

    anchor().dispatchEvent(new FocusEvent('focusin'))
    expect(tip().dataset.state).toBe('open')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(tip().dataset.state).toBe('closed')
  })

  it('honors show/hide delays', () => {
    vi.useFakeTimers()
    const { tip, anchor } = mountTooltip({ delay: { show: 200, hide: 100 } })
    anchor().dispatchEvent(new PointerEvent('pointerenter'))
    expect(tip().dataset.state).toBe('closed')
    vi.advanceTimersByTime(200)
    expect(tip().dataset.state).toBe('open')
    anchor().dispatchEvent(new PointerEvent('pointerleave'))
    vi.advanceTimersByTime(99)
    expect(tip().dataset.state).toBe('open')
    vi.advanceTimersByTime(1)
    expect(tip().dataset.state).toBe('closed')
  })

  it('toggles on click with `triggers: [\'click\']`, and ignores hover', () => {
    const { tip, anchor } = mountTooltip({ triggers: ['click'] })
    anchor().dispatchEvent(new PointerEvent('pointerenter'))
    expect(tip().dataset.state).toBe('closed')
    anchor().querySelector('button')!.click()
    expect(tip().dataset.state).toBe('open')
    // A click inside the tooltip itself doesn't toggle it.
    tip().click()
    expect(tip().dataset.state).toBe('open')
    anchor().querySelector('button')!.click()
    expect(tip().dataset.state).toBe('closed')
  })

  it('follows `shown`, bypassing triggers, and never shows while disabled', async () => {
    const { wrapper, tip, anchor } = mountTooltip({ shown: true })
    await nextTick()
    expect(tip().dataset.state).toBe('open')
    anchor().dispatchEvent(new PointerEvent('pointerleave'))
    expect(tip().dataset.state).toBe('open')
    await wrapper.setProps({ shown: false })
    expect(tip().dataset.state).toBe('closed')

    await wrapper.setProps({ shown: undefined, disabled: true })
    anchor().dispatchEvent(new PointerEvent('pointerenter'))
    expect(tip().dataset.state).toBe('closed')
  })

  it('anchors to a viewport coordinate', async () => {
    const wrapper = mount(OverlayTooltip, { props: { content: 'Hi', anchor: { x: 120, y: 64 }, shown: true }, attachTo: document.body })
    await nextTick()
    const marker = wrapper.find('span[aria-hidden="true"]').element as HTMLElement
    expect(marker.style.getPropertyValue('anchor-name')).toMatch(/^--af-tooltip-/)
    expect(document.querySelector<HTMLElement>('[data-af-tooltip]')!.dataset.state).toBe('open')
  })
})

describe('v-tooltip', () => {
  const Host = defineComponent({
    props: { text: { type: String, default: 'Copy' } },
    setup: props => () => withDirectives(h('button', 'Trigger'), [[vTooltip, props.text]]),
  })

  it('appends the tooltip to the root node, outside the trigger', () => {
    const wrapper = mount(Host, { attachTo: document.body })
    const tip = document.querySelector<HTMLElement>('[data-af-tooltip]')!
    expect(tip.textContent).toBe('Copy')
    expect(wrapper.element.contains(tip)).toBe(false)
    expect(wrapper.element.getAttribute('aria-describedby')).toBe(tip.id)
  })

  it('stays inside an enclosing shadow root', () => {
    const host = document.createElement('div')
    document.body.append(host)
    const shadow = host.attachShadow({ mode: 'open' })
    const point = document.createElement('div')
    shadow.append(point)
    mount(Host, { attachTo: point })
    expect(shadow.querySelector('[data-af-tooltip]')).toBeTruthy()
    expect(document.body.querySelector('[data-af-tooltip]')).toBeNull()
  })

  it('updates its text, is disabled when empty, and cleans up on unmount', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    const tip = document.querySelector<HTMLElement>('[data-af-tooltip]')!
    await wrapper.setProps({ text: 'Copied' })
    expect(tip.textContent).toBe('Copied')

    await wrapper.setProps({ text: '' })
    wrapper.element.dispatchEvent(new PointerEvent('pointerenter'))
    expect(tip.dataset.state).toBe('closed')

    wrapper.unmount()
    expect(document.querySelector('[data-af-tooltip]')).toBeNull()
  })
})
