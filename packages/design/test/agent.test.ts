import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import FormCheckbox from '../components/Form/FormCheckbox.vue'
import FormCombobox from '../components/Form/FormCombobox.vue'
import FormField from '../components/Form/FormField.vue'
import FormNumberInput from '../components/Form/FormNumberInput.vue'
import FormRadioGroup from '../components/Form/FormRadioGroup.vue'
import FormSearchField from '../components/Form/FormSearchField.vue'
import FormSegmentedControl from '../components/Form/FormSegmentedControl.vue'
import FormSelect from '../components/Form/FormSelect.vue'
import FormSwitch from '../components/Form/FormSwitch.vue'
import FormTextarea from '../components/Form/FormTextarea.vue'
import FormTextInput from '../components/Form/FormTextInput.vue'
import LayoutTabs from '../components/Layout/LayoutTabs.vue'
import { createAgent, getChangeSource } from '../composables/agent'

function setup(options?: Parameters<typeof createAgent>[0]) {
  const agent = createAgent(options)
  const state = {
    name: ref('Apollo'),
    notify: ref(false),
    archived: ref(false),
    region: ref('us'),
    tab: ref('general'),
    disabledName: ref('x'),
  }
  const sources: string[] = []
  const App = defineComponent(() => () => h('div', [
    h(FormField, { label: 'Project name' }, () => h(FormTextInput, {
      'modelValue': state.name.value,
      'onUpdate:modelValue': (v: string) => {
        sources.push(getChangeSource())
        state.name.value = v
      },
    })),
    h(FormSwitch, { 'label': 'Notifications', 'modelValue': state.notify.value, 'onUpdate:modelValue': (v: boolean) => state.notify.value = v }),
    h(FormCheckbox, { 'label': 'Archived', 'modelValue': state.archived.value, 'onUpdate:modelValue': (v: boolean) => state.archived.value = v }),
    h(FormSelect, {
      'aria-label': 'Region',
      'options': [{ value: 'us' }, { value: 'eu' }, { value: 'ap', disabled: true }],
      'modelValue': state.region.value,
      'onUpdate:modelValue': (v: string | undefined) => state.region.value = v!,
    }),
    h(LayoutTabs, {
      'aria-label': 'Sections',
      'tabs': [{ value: 'general' }, { value: 'danger' }],
      'modelValue': state.tab.value,
      'onUpdate:modelValue': (v: string | undefined) => state.tab.value = v!,
    }),
    h(FormTextInput, { placeholder: 'Locked', disabled: true, modelValue: state.disabledName.value }),
  ]))
  const wrapper = mount(App, { global: { plugins: [agent] } })
  return { agent, state, sources, wrapper }
}

describe('agent bridge', () => {
  it('snapshots instrumented controls', () => {
    const { agent } = setup()
    expect(agent.snapshot()).toEqual([
      { ref: 'c1', component: 'text-input', label: 'Project name', value: 'Apollo', actions: ['setValue', 'clear'] },
      { ref: 'c2', component: 'switch', label: 'Notifications', value: false, actions: ['setValue', 'toggle'] },
      { ref: 'c3', component: 'checkbox', label: 'Archived', value: false, actions: ['setValue', 'toggle'] },
      { ref: 'c4', component: 'select', label: 'Region', value: 'us', options: ['us', 'eu'], actions: ['setValue'] },
      { ref: 'c5', component: 'tabs', label: 'Sections', value: 'general', options: ['general', 'danger'], actions: ['select'] },
      { ref: 'c6', component: 'text-input', label: 'Locked', value: 'x', disabled: true, actions: ['setValue', 'clear'] },
    ])
  })

  it('acts through v-model and tags the source', async () => {
    const { agent, state, sources, wrapper } = setup()
    const { results } = await agent.act({
      steps: [
        { ref: 'Project name', action: 'setValue', args: ['Atlas'] },
        { ref: 'Notifications', action: 'toggle' },
        { ref: 'c3', action: 'setValue', args: [true] },
        { ref: 'Region', action: 'setValue', args: ['eu'] },
        { ref: 'Sections', action: 'select', args: ['danger'] },
      ],
    })
    expect(results.every(r => r.ok)).toBe(true)
    expect(state.name.value).toBe('Atlas')
    expect(state.notify.value).toBe(true)
    expect(state.archived.value).toBe(true)
    expect(state.region.value).toBe('eu')
    expect(state.tab.value).toBe('danger')
    expect(sources).toEqual(['agent'])
    expect(wrapper.find('input').element.value).toBe('Atlas')
    expect(getChangeSource()).toBe('user')
  })

  it('stops at the first failing step', async () => {
    const { agent, state } = setup()
    const { results } = await agent.act({
      steps: [
        { ref: 'Region', action: 'setValue', args: ['ap'] },
        { ref: 'Notifications', action: 'toggle' },
      ],
    })
    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({ ok: false, error: '"ap" is not one of: "us", "eu"' })
    expect(state.notify.value).toBe(false)
  })

  it('rejects disabled controls, unknown targets, and unknown actions', async () => {
    const { agent } = setup()
    const errors: (string | undefined)[] = []
    for (const step of [
      { ref: 'Locked', action: 'clear' },
      { ref: 'Nope', action: 'clear' },
      { ref: 'Notifications', action: 'explode' },
    ])
      errors.push((await agent.act({ steps: [step] })).results[0]!.error)
    expect(errors).toEqual([
      'Control "Locked" is disabled',
      'No control "Nope"',
      'Unknown action "explode"; available: setValue, toggle',
    ])
  })

  it('honors the allow guard', async () => {
    const allow = vi.fn((step: { action: string }) => step.action !== 'clear')
    const { agent, state } = setup({ allow })
    const { results } = await agent.act({ steps: [{ ref: 'Project name', action: 'clear' }] })
    expect(results[0]).toMatchObject({ ok: false, error: 'Rejected by allow()' })
    expect(allow).toHaveBeenCalledWith(
      { ref: 'Project name', action: 'clear' },
      expect.objectContaining({ ref: 'c1', label: 'Project name' }),
    )
    expect(state.name.value).toBe('Apollo')
  })

  it('exposes snapshot/act as tools', async () => {
    const { agent, state } = setup()
    const tools = Object.fromEntries(agent.tools().map(t => [t.name, t]))
    expect((await tools.ui_snapshot!.execute({}) as unknown[]).length).toBe(6)
    await tools.ui_act!.execute({ steps: [{ ref: 'Notifications', action: 'toggle' }] })
    expect(state.notify.value).toBe(true)
  })

  it('unregisters on unmount and is inert without a bridge', () => {
    const { agent, wrapper } = setup()
    wrapper.unmount()
    expect(agent.snapshot()).toEqual([])
    expect(() => mount(FormSwitch, { props: { label: 'x' } })).not.toThrow()
  })
})

describe('agent bridge: more controls', () => {
  function mountWith(vnode: () => ReturnType<typeof h>) {
    const agent = createAgent()
    mount(defineComponent(() => () => h('div', vnode())), { global: { plugins: [agent] } })
    return agent
  }

  function bound<T>(initial: T) {
    const value = ref(initial)
    return { value, props: () => ({ 'modelValue': value.value, 'onUpdate:modelValue': (v: T) => value.value = v }) }
  }

  it('drives combobox, radio group, segmented control, textarea, and search field', async () => {
    const combo = bound<string | undefined>(undefined)
    const radio = bound<string | undefined>('a')
    const seg = bound<string | number | null | undefined>(null)
    const notes = bound('hi')
    const search = bound('')
    const agent = mountWith(() => [
      h(FormCombobox, { 'aria-label': 'Framework', 'options': [{ value: 'vue' }, { value: 'svelte' }], ...combo.props() }),
      h(FormRadioGroup, { 'aria-label': 'Plan', 'options': [{ value: 'a' }, { value: 'b' }, { value: 'c', disabled: true }], ...radio.props() }),
      h(FormSegmentedControl, { 'aria-label': 'Size', 'options': [{ value: null, label: 'Any' }, { value: 1 }, { value: 2 }], ...seg.props() }),
      h(FormField, { label: 'Notes' }, () => h(FormTextarea, notes.props())),
      h(FormSearchField, search.props()),
    ] as any)

    expect(agent.snapshot().map(c => [c.component, c.label, c.options])).toEqual([
      ['combobox', 'Framework', ['vue', 'svelte']],
      ['radio-group', 'Plan', ['a', 'b']],
      ['segmented-control', 'Size', [null, 1, 2]],
      ['textarea', 'Notes', undefined],
      ['text-input', 'Search…', undefined],
    ])

    const { results } = await agent.act({
      steps: [
        { ref: 'Framework', action: 'setValue', args: ['svelte'] },
        { ref: 'Plan', action: 'setValue', args: ['b'] },
        { ref: 'Size', action: 'setValue', args: [2] },
        { ref: 'Notes', action: 'clear' },
        { ref: 'Search…', action: 'setValue', args: ['button'] },
      ],
    })
    expect(results.every(r => r.ok)).toBe(true)
    expect([combo.value.value, radio.value.value, seg.value.value, notes.value.value, search.value.value])
      .toEqual(['svelte', 'b', 2, '', 'button'])

    const rejected = await agent.act({ steps: [{ ref: 'Plan', action: 'setValue', args: ['c'] }] })
    expect(rejected.results[0]!.ok).toBe(false)
    expect(radio.value.value).toBe('b')
  })

  it('clamps and steps the number input like the user path', async () => {
    const count = bound<number | undefined>(5)
    const agent = mountWith(() => h(FormNumberInput, { 'aria-label': 'Count', 'min': 0, 'max': 10, 'step': 2, ...count.props() }))

    await agent.act({ steps: [{ ref: 'Count', action: 'setValue', args: [42] }] })
    expect(count.value.value).toBe(10)
    await agent.act({ steps: [{ ref: 'Count', action: 'decrement' }] })
    expect(count.value.value).toBe(8)
    await agent.act({ steps: [{ ref: 'Count', action: 'increment' }, { ref: 'Count', action: 'increment' }] })
    expect(count.value.value).toBe(10)

    const { results } = await agent.act({ steps: [{ ref: 'Count', action: 'setValue', args: ['7'] }] })
    expect(results[0]!.error).toBe('"7" is not a number')
    await agent.act({ steps: [{ ref: 'Count', action: 'clear' }] })
    expect(count.value.value).toBeUndefined()
  })
})
