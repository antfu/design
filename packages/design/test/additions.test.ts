import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'

import ActionButton from '../components/Action/ActionButton.vue'
import ActionIconButton from '../components/Action/ActionIconButton.vue'
import DisplayAvatar from '../components/Display/DisplayAvatar.vue'
import DisplayDuration from '../components/Display/DisplayDuration.vue'
import DisplayKeyValue from '../components/Display/DisplayKeyValue.vue'
import DisplayPackageName from '../components/Display/DisplayPackageName.vue'
import DisplaySafeImage from '../components/Display/DisplaySafeImage.vue'
import DisplayStatusPill from '../components/Display/DisplayStatusPill.vue'
import DisplayTree from '../components/Display/DisplayTree.vue'
import FeedbackToasts from '../components/Feedback/FeedbackToasts.vue'
import FormField from '../components/Form/FormField.vue'
import FormNumberInput from '../components/Form/FormNumberInput.vue'
import LayoutBreadcrumb from '../components/Layout/LayoutBreadcrumb.vue'
import LayoutDataTable from '../components/Layout/LayoutDataTable.vue'
import LayoutSideNav from '../components/Layout/LayoutSideNav.vue'
import OverlayDrawer from '../components/Overlay/OverlayDrawer.vue'
import OverlayModal from '../components/Overlay/OverlayModal.vue'

import { provideColorScheme, useColorScheme } from '../composables/colorScheme'
import { useToast } from '../composables/toast'
import { darken, getPluginColor, lighten, stripPluginPrefix, toHex } from '../utils/color'
import { formatDuration, formatNumber, getBytesColor, getDefaultLocale, setDefaultLocale } from '../utils/format'
import { getFolderIcon } from '../utils/icon'
import { relativeModulePath } from '../utils/path'

describe('utils additions — format', () => {
  it('formatDuration accepts ns / us input', () => {
    expect(formatDuration(1500, { unit: 'ns' })).toEqual(['1.5', 'µs'])
    expect(formatDuration(500, { unit: 'ns' })).toEqual(['500', 'ns'])
    expect(formatDuration(820, { unit: 'us' })).toEqual(['820', 'µs'])
    // default ms behavior unchanged
    expect(formatDuration(0.5)).toEqual(['<1', 'ms'])
    expect(formatDuration(1500)).toEqual(['1.5', 's'])
  })
  it('getBytesColor takes a custom scale', () => {
    const scale = [[50, 'color-scale-low'], [Number.POSITIVE_INFINITY, 'color-scale-critical']] as const
    expect(getBytesColor(10, scale)).toBe('color-scale-low')
    expect(getBytesColor(100, scale)).toBe('color-scale-critical')
  })
  it('locale is configurable', () => {
    const original = getDefaultLocale()
    setDefaultLocale('de-DE')
    expect(getDefaultLocale()).toBe('de-DE')
    expect(formatNumber(1234567)).toBe('1.234.567')
    expect(formatNumber(1234567, undefined, 'en-US')).toBe('1,234,567')
    setDefaultLocale(original)
  })
})

describe('utils additions — color', () => {
  it('getPluginColor merges custom hues over defaults', () => {
    // defaults still work
    expect(getPluginColor('vue')).toBe(getPluginColor('vue'))
    // a custom hue is merged, not replacing the defaults
    expect(getPluginColor('acme', 1, false, { acme: 300 })).toContain('300')
    expect(getPluginColor('vue', 1, false, { acme: 300 })).toContain('153')
  })
  it('stripPluginPrefix handles namespaces + a custom list', () => {
    expect(stripPluginPrefix('vite:import-analysis')).toBe('import-analysis')
    expect(stripPluginPrefix('vite-plugin-inspect')).toBe('inspect')
    expect(stripPluginPrefix('foo-x', ['foo-'])).toBe('x')
    expect(stripPluginPrefix('vite-plugin-x', ['only-'])).toBe('vite-plugin-x')
  })
  it('color math returns hex', () => {
    expect(toHex('hsl(0, 100%, 50%)')).toBe('#ff0000')
    expect(lighten('#336699')).toMatch(/^#[0-9a-f]{6}$/i)
    expect(darken('#336699')).toMatch(/^#[0-9a-f]{6}$/i)
    expect(lighten('#000000', 0.5)).not.toBe('#000000')
  })
})

describe('utils additions — path / icon', () => {
  it('relativeModulePath synthesizes ../ and keeps under-root behavior', () => {
    expect(relativeModulePath('/root/src/a.ts', '/root')).toBe('./src/a.ts')
    expect(relativeModulePath('/root/pkg/b.ts', '/root/app')).toBe('../pkg/b.ts')
  })
  it('getFolderIcon resolves named + open folders', () => {
    expect(getFolderIcon('src')).toBe('i-catppuccin:folder-src')
    expect(getFolderIcon('whatever', true)).toBe('i-catppuccin:folder-open')
    expect(getFolderIcon()).toBe('i-catppuccin:folder')
  })
})

describe('composables — useColorScheme', () => {
  it('prop wins, else provided context, else light', () => {
    const Child = defineComponent({
      props: { colorScheme: { type: String, default: undefined } },
      setup(props) {
        const scheme = useColorScheme(() => props.colorScheme as 'light' | 'dark' | undefined)
        return () => scheme.value
      },
    })
    // provided context = dark
    const Parent = defineComponent({
      components: { Child },
      setup() { provideColorScheme('dark') },
      template: `<div><Child /><Child color-scheme="light" /></div>`,
    })
    const w = mount(Parent)
    expect(w.text()).toBe('darklight')
    // no provider → defaults to light
    expect(mount(Child).text()).toBe('light')
  })
})

describe('composables — useToast', () => {
  it('adds, dismisses, clears, and presets type', () => {
    const t = useToast()
    const id = t.add('hello')
    expect(t.toasts.value).toHaveLength(1)
    expect(t.toasts.value[0]).toMatchObject({ id, message: 'hello' })
    const sid = t.success('done')
    expect(t.toasts.value.find(x => x.id === sid)?.type).toBe('success')
    t.dismiss(id)
    expect(t.toasts.value.find(x => x.id === id)).toBeUndefined()
    t.clear()
    expect(t.toasts.value).toHaveLength(0)
  })
})

describe('new display components', () => {
  it('avatar shows initials fallback when no src', () => {
    const w = mount(DisplayAvatar, { props: { name: 'Anthony Fu' } })
    expect(w.text()).toBe('AF')
  })
  it('safeImage renders the fallback slot without a src', () => {
    const w = mount(DisplaySafeImage, { slots: { fallback: 'NA' } })
    expect(w.find('img').exists()).toBe(false)
    expect(w.text()).toBe('NA')
  })
  it('duration renders ns/µs and colorizes from the ms-equivalent', () => {
    const w = mount(DisplayDuration, { props: { ms: 1500, unit: 'ns', colorize: true } })
    expect(w.text()).toContain('1.5')
    expect(w.text()).toContain('µs')
    // 1500ns = 0.0015ms → neutral band
    expect(w.classes()).toContain('color-scale-neutral')
  })
  it('keyValue renders label + value', () => {
    const w = mount(DisplayKeyValue, { props: { label: 'Size', value: '12 kB' } })
    expect(w.text()).toContain('Size')
    expect(w.text()).toContain('12 kB')
  })
  it('packageName strips prefixes on demand', () => {
    const w = mount(DisplayPackageName, { props: { name: 'vite-plugin-inspect', strip: true } })
    expect(w.text()).toBe('inspect')
  })
  it('statusPill accepts a custom dot color', () => {
    const w = mount(DisplayStatusPill, { props: { color: '#ff0000', label: 'x' } })
    expect(w.html()).toContain('background: #ff0000')
  })
  it('tree renders branch + leaf names', () => {
    const w = mount(DisplayTree, {
      props: { items: [{ p: 'src/a.ts' }, { p: 'src/b.ts' }], getPath: (i: unknown) => (i as { p: string }).p },
    })
    expect(w.text()).toContain('src')
    expect(w.text()).toContain('a.ts')
  })
})

describe('new form components', () => {
  it('field renders label, required marker and error', () => {
    const w = mount(FormField, {
      props: { label: 'Name', required: true, error: 'Required' },
      slots: { default: '<input>' },
    })
    expect(w.text()).toContain('Name')
    expect(w.text()).toContain('*')
    expect(w.find('[role="alert"]').text()).toBe('Required')
  })
  it('numberInput steps within bounds', async () => {
    const w = mount(FormNumberInput, { props: { modelValue: 5, step: 2, max: 8 } })
    await w.get('[aria-label="Increment"]').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([7])
    await w.setProps({ modelValue: 7 })
    await w.get('[aria-label="Increment"]').trigger('click')
    expect(w.emitted('update:modelValue')?.[1]).toEqual([8]) // clamped to max
  })
})

describe('new layout components', () => {
  it('dataTable sorts internally on header click', async () => {
    const w = mount(LayoutDataTable, {
      props: {
        columns: [{ key: 'n', label: 'N', sortable: true }],
        rows: [{ n: 3 }, { n: 1 }, { n: 2 }],
      },
    })
    await w.get('th button').trigger('click')
    expect(w.emitted('sort')?.[0]).toEqual([{ key: 'n', dir: 'asc' }])
    expect(w.findAll('td')[0].text()).toBe('1')
  })
  it('breadcrumb marks the last crumb as current', () => {
    const w = mount(LayoutBreadcrumb, {
      props: { items: [{ label: 'Home', href: '/' }, { label: 'Now' }] },
    })
    expect(w.find('a').attributes('href')).toBe('/')
    expect(w.find('[aria-current="page"]').text()).toContain('Now')
  })
  it('sideNav highlights the active item', () => {
    const w = mount(LayoutSideNav, {
      props: { items: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B', badge: 3 }], modelValue: 'b' },
    })
    expect(w.find('[aria-current="page"]').text()).toContain('B')
    expect(w.text()).toContain('3')
  })
})

describe('component edits', () => {
  it('iconButton supports size + custom active class', () => {
    const w = mount(ActionIconButton, { props: { icon: 'i-catppuccin:vue', size: 'sm', active: true, activeClass: 'text-green-400' } })
    expect(w.classes()).toContain('w-7!')
    expect(w.classes()).toContain('text-green-400')
  })
  it('button applies size to the primary variant', () => {
    const w = mount(ActionButton, { props: { variant: 'primary', size: 'sm' }, slots: { default: 'Go' } })
    expect(w.classes()).toContain('btn-primary')
    expect(w.classes()).toContain('text-sm')
  })
  it('toasts render progress + action and emit action', async () => {
    const w = mount(FeedbackToasts, {
      props: { items: [{ id: 1, message: 'Downloading', progress: 0.5, action: 'Cancel' }] },
      attachTo: document.body,
    })
    await nextTick()
    const btn = document.body.querySelector('button[type="button"]') as HTMLButtonElement | null
    expect(document.body.textContent).toContain('Cancel')
    expect(btn).not.toBeNull()
    w.unmount()
  })
})

describe('feedback fixes', () => {
  it('iconButton has a compact (square) variation', () => {
    const def = mount(ActionIconButton, { props: { icon: 'i-catppuccin:vue' } })
    expect(def.classes()).toContain('btn-icon')
    const compact = mount(ActionIconButton, { props: { icon: 'i-catppuccin:vue', compact: true } })
    expect(compact.classes()).toContain('btn-icon-compact')
    expect(compact.classes()).not.toContain('btn-icon')
  })
  it('tree shows folder icons on branch nodes', () => {
    // Two children keep `src` an un-flattened branch (a single child would collapse to a leaf).
    const w = mount(DisplayTree, {
      props: { items: [{ p: 'src/a.ts' }, { p: 'src/b.ts' }], getPath: (i: unknown) => (i as { p: string }).p, fileIcons: true },
    })
    expect(w.html()).toContain('i-catppuccin:folder')
  })
  it('modal content carries the animation hook', async () => {
    mount(OverlayModal, { props: { open: true }, slots: { default: 'Hi' }, attachTo: document.body })
    await nextTick()
    expect(document.body.querySelector('[data-af-modal]')).not.toBeNull()
    document.body.innerHTML = ''
  })
  it('drawer content slides from its side', async () => {
    mount(OverlayDrawer, { props: { open: true, side: 'left' }, slots: { default: 'Hi' }, attachTo: document.body })
    await nextTick()
    const el = document.body.querySelector('[data-af-drawer]')
    expect(el).not.toBeNull()
    expect(el?.getAttribute('data-side')).toBe('left')
    document.body.innerHTML = ''
  })
})

// Reset module-level locale between files just in case.
beforeEach(() => setDefaultLocale('en-US'))
