import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Badge from '../components/Display/DisplayBadge.vue'

describe('badge', () => {
  it('renders text content + base layout classes', () => {
    const wrapper = mount(Badge, { props: { text: 'hello' } })
    expect(wrapper.text()).toBe('hello')
    expect(wrapper.classes()).toContain('inline-flex')
  })

  it('pads relative to font-size, not a fixed size prop', () => {
    const wrapper = mount(Badge, { props: { text: 'hello' } })
    expect(wrapper.attributes('style')).toMatch(/padding:\s*0\.25em 0\.5em/)
  })

  it('overrides the padding ratio via paddingX/paddingY', () => {
    const wrapper = mount(Badge, { props: { text: 'hello', paddingX: 0.65, paddingY: 0.15 } })
    expect(wrapper.attributes('style')).toMatch(/padding:\s*0\.15em 0\.65em/)
  })

  it('defaults to a md radius, switches to full when rounded="full"', () => {
    const md = mount(Badge, { props: { text: 'x' } })
    expect(md.classes()).toContain('rounded-md')
    const full = mount(Badge, { props: { text: 'x', rounded: 'full' } })
    expect(full.classes()).toContain('rounded-full')
    expect(full.classes()).not.toContain('rounded-md')
  })

  it('accepts a numeric rounded as an explicit em radius', () => {
    const wrapper = mount(Badge, { props: { text: 'x', rounded: 0.75 } })
    expect(wrapper.classes()).not.toContain('rounded-md')
    expect(wrapper.classes()).not.toContain('rounded-full')
    expect(wrapper.attributes('style')).toMatch(/border-radius:\s*0\.75em/)
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
    expect(wrapper.classes()).toContain('color-muted')
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
