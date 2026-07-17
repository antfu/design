import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from '../components/Action/ActionButton.vue'
import ToggleGroup from '../components/Action/ActionToggleGroup.vue'
import BytesDisplay from '../components/Display/DisplayBytes.vue'
import DurationDisplay from '../components/Display/DisplayDuration.vue'
import NumberDisplay from '../components/Display/DisplayNumber.vue'
import StatusPill from '../components/Display/DisplayStatusPill.vue'
import Version from '../components/Display/DisplayVersion.vue'
import EmptyState from '../components/Feedback/FeedbackEmptyState.vue'
import Skeleton from '../components/Feedback/FeedbackSkeleton.vue'
import Tip from '../components/Feedback/FeedbackTip.vue'
import Checkbox from '../components/Form/FormCheckbox.vue'
import SegmentedControl from '../components/Form/FormSegmentedControl.vue'
import Slider from '../components/Form/FormSlider.vue'
import Accordion from '../components/Layout/LayoutAccordion.vue'
import Separator from '../components/Layout/LayoutSeparator.vue'
import Tabs from '../components/Layout/LayoutTabs.vue'

describe('button', () => {
  it('renders a <button> by default with the action recipe', () => {
    const wrapper = mount(Button, { slots: { default: 'Click' } })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.classes()).toContain('btn-action')
    expect(wrapper.text()).toBe('Click')
  })
  it('renders an <a> when href is given', () => {
    const wrapper = mount(Button, { props: { href: '/x' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/x')
  })
  it('uses the primary recipe', () => {
    const wrapper = mount(Button, { props: { variant: 'primary' } })
    expect(wrapper.classes()).toContain('btn-primary')
  })
  it('disables + marks busy while loading', () => {
    const wrapper = mount(Button, { props: { loading: true } })
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
  })
})

describe('number / unit displays', () => {
  it('formats numbers', () => {
    const wrapper = mount(NumberDisplay, { props: { value: 1234567 } })
    expect(wrapper.text()).toContain('1,234,567')
  })
  it('formats durations with severity color', () => {
    const wrapper = mount(DurationDisplay, { props: { ms: 1500, colorize: true } })
    expect(wrapper.text()).toContain('1.5')
    expect(wrapper.text()).toContain('s')
    // 1500ms falls in the 1000–5000ms ("high") band.
    expect(wrapper.classes()).toContain('color-scale-high')
  })
  it('formats bytes + percent of total', () => {
    const wrapper = mount(BytesDisplay, { props: { bytes: 512 * 1024, total: 1024 * 1024 } })
    expect(wrapper.text()).toContain('512')
    expect(wrapper.text()).toContain('KB')
    expect(wrapper.text()).toContain('50%')
  })
  it('prefixes versions with v', () => {
    expect(mount(Version, { props: { version: '1.2.3' } }).text()).toBe('v1.2.3')
    expect(mount(Version, { props: { version: 'v1.2.3', prefix: false } }).text()).toBe('1.2.3')
  })
})

describe('misc components', () => {
  it('statusPill renders a label', () => {
    const wrapper = mount(StatusPill, { props: { status: 'success', label: 'Online' } })
    expect(wrapper.text()).toBe('Online')
  })
  it('tip applies a type-based palette', () => {
    const wrapper = mount(Tip, { props: { type: 'warning' }, slots: { default: 'Heads up' } })
    expect(wrapper.text()).toBe('Heads up')
    expect(wrapper.attributes('role')).toBe('note')
  })
  it('emptyState renders title + hint slot', () => {
    const wrapper = mount(EmptyState, { props: { title: 'Nothing here' }, slots: { hint: 'Try again' } })
    expect(wrapper.text()).toContain('Nothing here')
    expect(wrapper.text()).toContain('Try again')
  })
  it('checkbox reflects modelValue + renders label', () => {
    const wrapper = mount(Checkbox, { props: { modelValue: true, label: 'Accept' } })
    expect(wrapper.text()).toBe('Accept')
    expect(wrapper.get('[role="checkbox"]').attributes('aria-checked')).toBe('true')
  })
  it('tabs renders a trigger per tab with counts', () => {
    const wrapper = mount(Tabs, {
      props: { tabs: [{ value: 'a', label: 'A', count: 3 }, { value: 'b', label: 'B' }], modelValue: 'a' },
    })
    const triggers = wrapper.findAll('[role="tab"]')
    expect(triggers).toHaveLength(2)
    expect(wrapper.text()).toContain('A')
    expect(wrapper.text()).toContain('3')
  })
})

describe('new primitives', () => {
  it('separator is decorative by default, labelled when given a label', () => {
    const plain = mount(Separator)
    expect(plain.find('[role="none"], [data-orientation]').exists()).toBe(true)
    const labelled = mount(Separator, { props: { label: 'or' } })
    expect(labelled.text()).toBe('or')
  })
  it('skeleton text variant renders the requested lines', () => {
    const wrapper = mount(Skeleton, { props: { lines: 3 } })
    expect(wrapper.attributes('aria-label')).toBe('Loading')
    expect(wrapper.findAll('span')).toHaveLength(3)
  })
  it('slider exposes a thumb for a single value', () => {
    const wrapper = mount(Slider, { props: { modelValue: 30 } })
    expect(wrapper.find('[role="slider"]').exists()).toBe(true)
  })
  it('toggleGroup renders an item per option', () => {
    const wrapper = mount(ToggleGroup, {
      props: { modelValue: 'grid', options: [{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }] },
    })
    expect(wrapper.text()).toContain('Grid')
    expect(wrapper.text()).toContain('List')
  })
  it('accordion renders a trigger per item', () => {
    const wrapper = mount(Accordion, { props: { items: [{ value: 'a', title: 'A' }, { value: 'b', title: 'B' }] } })
    expect(wrapper.text()).toContain('A')
    expect(wrapper.text()).toContain('B')
  })
  it('segmentedControl renders a radio per option and reflects the checked one, including a null value', () => {
    const wrapper = mount(SegmentedControl, {
      props: { modelValue: null, options: [{ value: null, label: 'Any' }, { value: 'true', label: 'Yes' }] },
    })
    const [any, yes] = wrapper.findAll('[role="radio"]')
    expect(any?.attributes('aria-checked')).toBe('true')
    expect(yes?.attributes('aria-checked')).toBe('false')
  })
})
