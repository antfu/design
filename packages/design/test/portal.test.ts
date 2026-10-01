import type { VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'
import { mount as mountComponent } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import Toasts from '../components/Feedback/FeedbackToasts.vue'
import Combobox from '../components/Form/FormCombobox.vue'
import Select from '../components/Form/FormSelect.vue'
import Menubar from '../components/Layout/LayoutMenubar.vue'
import Confirm from '../components/Overlay/OverlayConfirm.vue'
import ContextMenu from '../components/Overlay/OverlayContextMenu.vue'
import Drawer from '../components/Overlay/OverlayDrawer.vue'
import Dropdown from '../components/Overlay/OverlayDropdown.vue'
import DropdownItem from '../components/Overlay/OverlayDropdownItem.vue'
import DropdownSub from '../components/Overlay/OverlayDropdownSub.vue'
import HoverCard from '../components/Overlay/OverlayHoverCard.vue'
import Modal from '../components/Overlay/OverlayModal.vue'

const settle = () => new Promise(resolve => setTimeout(resolve, 10))

const options = [{ value: 'a' }, { value: 'b' }]
const trigger = () => h('button', { 'data-trigger': '' }, 'open')
const marker = () => h('span', { 'data-marker': '' }, 'content')

interface Case {
  name: string
  component: Component
  props?: Record<string, unknown>
  slots?: Record<string, () => ReturnType<typeof h>>
  /** Portaled-content selector. */
  marker: string
  /** Open the popup from its trigger inside `root`. */
  open?: (root: ParentNode) => Promise<void>
}

async function fire(root: ParentNode, selector: string, event: Event) {
  root.querySelector(selector)!.dispatchEvent(event)
  await nextTick()
  await settle()
}

const cases: Case[] = [
  { name: 'modal', component: Modal, props: { open: true }, marker: '[data-af-modal]' },
  { name: 'drawer', component: Drawer, props: { open: true }, marker: '[data-af-drawer]' },
  { name: 'confirm', component: Confirm, props: { open: true }, marker: '[data-af-modal]' },
  { name: 'toasts', component: Toasts, props: { items: [{ id: 1, message: 'hi' }] }, marker: '[role="region"]' },
  {
    name: 'select',
    component: Select,
    props: { options },
    marker: '[role="listbox"]',
    open: root => fire(root, '[role="combobox"]', new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })),
  },
  {
    name: 'combobox',
    component: Combobox,
    props: { options },
    marker: '[role="listbox"]',
    open: root => fire(root, 'input', new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })),
  },
  {
    name: 'menubar',
    component: Menubar,
    props: { menus: [{ value: 'file', label: 'File', items: [{ value: 'new', label: 'New' }] }] },
    marker: '[role="menu"]',
    open: root => fire(root, '[role="menuitem"]', new PointerEvent('pointerdown', { button: 0, bubbles: true })),
  },
  {
    name: 'dropdown',
    component: Dropdown,
    slots: { trigger, default: marker },
    marker: '[data-marker]',
    open: root => fire(root, '[data-trigger]', new MouseEvent('click', { button: 0, bubbles: true })),
  },
  {
    name: 'dropdown submenu',
    component: Dropdown,
    slots: {
      trigger,
      default: () => h(DropdownSub, { label: 'More' }, { default: () => h(DropdownItem, { label: 'Deep' }, { default: marker }) }),
    },
    marker: '[data-marker]',
    open: async (root) => {
      await fire(root, '[data-trigger]', new MouseEvent('click', { button: 0, bubbles: true }))
      await fire(root, '[aria-haspopup="menu"][role="menuitem"]', new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    },
  },
  {
    name: 'hover card',
    component: HoverCard,
    props: { openDelay: 0 },
    slots: { trigger, default: marker },
    marker: '[data-marker]',
    open: root => fire(root, '[data-trigger]', new PointerEvent('pointerenter', { pointerType: 'mouse' })),
  },
  {
    name: 'context menu',
    component: ContextMenu,
    slots: { trigger, default: marker },
    marker: '[data-marker]',
    open: root => fire(root, '[data-trigger]', new MouseEvent('contextmenu', { bubbles: true, cancelable: true })),
  },
]

const mounted: VueWrapper[] = []
const mount: typeof mountComponent = (...args) => {
  const wrapper = mountComponent(...args)
  mounted.push(wrapper)
  return wrapper
}

function shadowMountPoint() {
  const host = document.createElement('div')
  document.body.append(host)
  const shadow = host.attachShadow({ mode: 'open' })
  const mountPoint = document.createElement('div')
  shadow.append(mountPoint)
  return { shadow, mountPoint }
}

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

/** The container `usePortalTarget` appended to the shadow root. */
function portalContainer(shadow: ShadowRoot) {
  return Array.from(shadow.children).find(child => child.querySelector('[data-af-modal]'))!
}

describe('portals default to document.body', () => {
  it.each(cases)('$name teleports its content to the body', async ({ component, props, slots, marker, open }) => {
    mount(component, { attachTo: document.body, props, slots })
    await nextTick()
    await open?.(document.body)
    await nextTick()
    expect(document.body.querySelector(marker)).toBeTruthy()
  })
})

describe('portals stay inside a shadow root', () => {
  it.each(cases)('$name teleports its content into the enclosing shadow root, not the body', async ({ component, props, slots, marker, open }) => {
    const { shadow, mountPoint } = shadowMountPoint()

    mount(component, { attachTo: mountPoint, props, slots })
    await nextTick()
    await open?.(shadow)
    await nextTick()

    expect(shadow.querySelector(marker)).toBeTruthy()
    // The whole point: it must not escape to the light-DOM body, where the
    // shadow root's stylesheet can't reach it.
    expect(document.body.querySelector(marker)).toBeNull()
  })
})

describe('an explicit `to` wins over auto-detection', () => {
  it('teleports into the given container', async () => {
    const { shadow, mountPoint } = shadowMountPoint()

    const target = document.createElement('div')
    document.body.append(target)

    mount(Modal, { attachTo: mountPoint, props: { open: true, to: target } })
    await nextTick()
    await nextTick()

    expect(target.querySelector('[data-af-modal]')).toBeTruthy()
    expect(shadow.querySelector('[data-af-modal]')).toBeNull()
  })
})

describe('the portal container mirrors the scheme wrapper', () => {
  it('copies `dark`/`light` from the nearest scheme ancestor and follows toggles', async () => {
    const { shadow, mountPoint } = shadowMountPoint()
    mountPoint.className = 'dark'

    mount(Modal, { attachTo: mountPoint, props: { open: true } })
    await nextTick()
    await nextTick()

    const container = portalContainer(shadow)
    expect(container.classList.contains('dark')).toBe(true)

    mountPoint.className = 'light'
    await settle()
    expect(container.classList.contains('dark')).toBe(false)
    expect(container.classList.contains('light')).toBe(true)
  })

  it('leaves the container bare when there is no scheme wrapper', async () => {
    const { shadow, mountPoint } = shadowMountPoint()

    mount(Modal, { attachTo: mountPoint, props: { open: true } })
    await nextTick()
    await nextTick()

    expect(portalContainer(shadow).className).toBe('')
  })
})
