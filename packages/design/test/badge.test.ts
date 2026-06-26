import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Badge from '../components/Display/DisplayBadge.vue'

describe('badge', () => {
  it('renders text content + base class', () => {
    const wrapper = mount(Badge, { props: { text: 'hello' } })
    expect(wrapper.text()).toBe('hello')
    expect(wrapper.classes()).toContain('badge')
  })

  it('renders slot over text', () => {
    const wrapper = mount(Badge, { props: { text: 'x' }, slots: { default: 'slotted' } })
    expect(wrapper.text()).toBe('slotted')
  })

  it('applies a palette class for named colors', () => {
    const wrapper = mount(Badge, { props: { text: 'esm', color: 'green' } })
    expect(wrapper.classes()).toContain('badge-color-green')
  })

  it('falls back to muted when color is false', () => {
    const wrapper = mount(Badge, { props: { text: 'x', color: false } })
    expect(wrapper.classes()).toContain('badge-muted')
  })

  it('applies an inline hash color style by default', () => {
    const wrapper = mount(Badge, { props: { text: 'vite' } })
    expect(wrapper.attributes('style')).toMatch(/hsla/)
  })

  it('renders an icon element', () => {
    const wrapper = mount(Badge, { props: { text: 'x', icon: 'i-catppuccin:vue' } })
    expect(wrapper.find('.i-catppuccin\\:vue').exists()).toBe(true)
  })

  it('supports polymorphic `as`', () => {
    const wrapper = mount(Badge, { props: { text: 'x', as: 'div' } })
    expect(wrapper.element.tagName).toBe('DIV')
  })
})
