import type { Component } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Confirm from '../components/Overlay/OverlayConfirm.vue'
import Drawer from '../components/Overlay/OverlayDrawer.vue'
import Modal from '../components/Overlay/OverlayModal.vue'

const dialogs: [name: string, component: Component, marker: string][] = [
  ['modal', Modal, '[data-af-modal]'],
  ['drawer', Drawer, '[data-af-drawer]'],
  ['confirm', Confirm, '[data-af-modal]'],
]

afterEach(() => {
  document.body.innerHTML = ''
})

describe('dialog portals default to document.body', () => {
  it.each(dialogs)('%s teleports its content to the body', async (_name, component, marker) => {
    mount(component, { props: { open: true } })
    await nextTick()
    await nextTick()
    expect(document.body.querySelector(marker)).toBeTruthy()
  })
})

describe('dialog portals stay inside a shadow root', () => {
  it.each(dialogs)('%s teleports its content into the enclosing shadow root, not the body', async (_name, component, marker) => {
    const host = document.createElement('div')
    document.body.append(host)
    const shadow = host.attachShadow({ mode: 'open' })
    const mountPoint = document.createElement('div')
    shadow.append(mountPoint)

    mount(component, { attachTo: mountPoint, props: { open: true } })
    await nextTick()
    await nextTick()

    expect(shadow.querySelector(marker)).toBeTruthy()
    // The whole point: it must not escape to the light-DOM body, where the
    // shadow root's stylesheet can't reach it.
    expect(document.body.querySelector(marker)).toBeNull()
  })
})

describe('an explicit `to` wins over auto-detection', () => {
  it('teleports into the given container', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const shadow = host.attachShadow({ mode: 'open' })
    const mountPoint = document.createElement('div')
    shadow.append(mountPoint)

    const target = document.createElement('div')
    target.id = 'target'
    document.body.append(target)

    mount(Modal, { attachTo: mountPoint, props: { open: true, to: target } })
    await nextTick()
    await nextTick()

    expect(target.querySelector('[data-af-modal]')).toBeTruthy()
    expect(shadow.querySelector('[data-af-modal]')).toBeNull()
  })
})
