import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import DisplayIconifyRemoteIcon from '../components/Display/DisplayIconifyRemoteIcon.vue'
import { getIconifySvg } from '../utils/iconify'

// DisplayIconifyRemoteIcon is tested with `getIconifySvg` mocked rather than a
// real fetch + dompurify round-trip: dompurify's SVG/namespace handling isn't
// reliably emulated by happy-dom (our vitest DOM), so asserting on its exact
// output here would test that gap instead of our own component logic.
vi.mock('../utils/iconify', () => ({ getIconifySvg: vi.fn() }))

const getIconifySvgMock = vi.mocked(getIconifySvg)

describe('getIconifySvg', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetches from the iconify API and returns the sanitized markup', async () => {
    fetchMock.mockResolvedValue({ text: async () => '<svg><path d="M0 0"/></svg>' })
    // `getIconifySvg` is mocked at the module level above (for the component
    // tests below); import the real implementation directly for this suite.
    const { getIconifySvg: realGetIconifySvg } = await vi.importActual<typeof import('../utils/iconify')>('../utils/iconify')
    const svg = await realGetIconifySvg('catppuccin', 'vue')
    expect(fetchMock).toHaveBeenCalledWith('https://api.iconify.design/catppuccin/vue.svg?color=currentColor&width=100%')
    // dompurify's exact tag-stripping shape varies by DOM implementation; just
    // confirm the meaningful content survived sanitization.
    expect(svg).toContain('M0 0')
  })

  it('caches by collection:icon so a second call skips the network', async () => {
    fetchMock.mockResolvedValue({ text: async () => '<svg><path d="M1 1"/></svg>' })
    const { getIconifySvg: realGetIconifySvg } = await vi.importActual<typeof import('../utils/iconify')>('../utils/iconify')
    await realGetIconifySvg('catppuccin', 'typescript')
    await realGetIconifySvg('catppuccin', 'typescript')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('does not cache a failed fetch, so a later call can retry', async () => {
    const { getIconifySvg: realGetIconifySvg } = await vi.importActual<typeof import('../utils/iconify')>('../utils/iconify')
    fetchMock.mockRejectedValueOnce(new Error('offline'))
    await expect(realGetIconifySvg('catppuccin', 'npm')).rejects.toThrow('offline')

    fetchMock.mockResolvedValueOnce({ text: async () => '<svg><path d="M2 2"/></svg>' })
    const svg = await realGetIconifySvg('catppuccin', 'npm')
    expect(svg).toContain('M2 2')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})

describe('displayIconifyRemoteIcon', () => {
  beforeEach(() => {
    getIconifySvgMock.mockReset()
  })

  it('resolves a collection:icon pair via getIconifySvg and renders it as markup', async () => {
    getIconifySvgMock.mockResolvedValue('<svg data-testid="icon"><path d="M0 0"/></svg>')
    const wrapper = mount(DisplayIconifyRemoteIcon, { props: { icon: 'catppuccin:vue' } })
    await flushPromises()
    expect(getIconifySvgMock).toHaveBeenCalledWith('catppuccin', 'vue')
    expect(wrapper.html()).toContain('data-testid="icon"')
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('strips a leading i- prefix before resolving collection:icon', async () => {
    getIconifySvgMock.mockResolvedValue('<svg><path/></svg>')
    mount(DisplayIconifyRemoteIcon, { props: { icon: 'i-ph:heart' } })
    await flushPromises()
    expect(getIconifySvgMock).toHaveBeenCalledWith('ph', 'heart')
  })

  it('renders an <img> for a URL / data: / builtin: icon instead of resolving via iconify', async () => {
    const wrapper = mount(DisplayIconifyRemoteIcon, { props: { icon: 'https://example.com/a.svg' } })
    await flushPromises()
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/a.svg')
    expect(getIconifySvgMock).not.toHaveBeenCalled()
  })

  it('degrades to blank (no throw) when getIconifySvg rejects', async () => {
    getIconifySvgMock.mockRejectedValue(new Error('offline'))
    const wrapper = mount(DisplayIconifyRemoteIcon, { props: { icon: 'catppuccin:vue' } })
    await flushPromises()
    expect(wrapper.html()).toBe('<div></div>')
  })
})
