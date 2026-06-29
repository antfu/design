import { createGenerator } from '@unocss/core'
import presetWind4 from '@unocss/preset-wind4'
import { describe, expect, it } from 'vitest'
import { presetAnthonyDesign } from '../unocss'

async function generate(tokens: string, preflights = false): Promise<string> {
  const uno = await createGenerator({ presets: [presetAnthonyDesign(), presetWind4()] })
  const { css } = await uno.generate(tokens, { preflights })
  return css
}

describe('scroll-fade (ported from shadcn/ui)', () => {
  it('sizes both edges on the spacing scale and via arbitrary value', async () => {
    const css = await generate('scroll-fade-24 scroll-fade-[15%]')
    expect(css).toContain('--scroll-fade-size:calc(var(--spacing) * 24)')
    expect(css).toContain('--scroll-fade-size:15%')
  })
  it('overrides a single edge', async () => {
    const css = await generate('scroll-fade-t-2 scroll-fade-b-8 scroll-fade-e-[20%]')
    expect(css).toContain('--scroll-fade-t-size:calc(var(--spacing) * 2)')
    expect(css).toContain('--scroll-fade-b-size:calc(var(--spacing) * 8)')
    expect(css).toContain('--scroll-fade-e-size:20%')
  })
  it('disables in any variant', async () => {
    const css = await generate('scroll-fade-none md:scroll-fade-none')
    expect(css).toContain('.scroll-fade-none{--scroll-fade-mask:none;}')
    expect(css).toContain('--scroll-fade-mask:none')
  })
  it('preflight ships base/edge classes, @property, keyframes and no-scrollbar', async () => {
    const css = await generate('', true)
    expect(css).toContain('@property --scroll-fade-mask')
    expect(css).toContain('@keyframes scroll-fade-reveal-t')
    expect(css).toContain('animation-timeline: scroll(self y)')
    expect(css).toContain('mask-image:')
    for (const c of ['.scroll-fade-y', '.scroll-fade-x', '.scroll-fade-l', '.scroll-fade-r', '.no-scrollbar'])
      expect(css).toContain(c)
  })
})

describe('shimmer (ported from shadcn/ui)', () => {
  it('toggles and sweeps via modifiers', async () => {
    const css = await generate('shimmer-once shimmer-reverse shimmer-none shimmer-duration-1000 shimmer-angle-45 shimmer-spread-24 shimmer-spread-[5rem]')
    expect(css).toContain('animation-iteration-count:1')
    expect(css).toContain('animation-direction:reverse')
    expect(css).toContain('--shimmer-image:none')
    expect(css).toContain('--shimmer-duration:calc(1000 * 1ms)')
    expect(css).toContain('--shimmer-angle:calc(45 * 1deg)')
    expect(css).toContain('--shimmer-spread:calc(var(--spacing) * 24)')
    expect(css).toContain('--shimmer-spread:5rem')
  })
  it('resolves theme color with opacity and arbitrary color', async () => {
    const css = await generate('shimmer-color-blue-500/60 shimmer-color-[#378ADD]')
    expect(css).toContain('color-mix(in oklch')
    expect(css).toContain('--shimmer-color:#378ADD')
  })
  it('preflight ships base class, keyframes, dark brightening and reduced-motion', async () => {
    const css = await generate('', true)
    expect(css).toContain('@keyframes tw-shimmer')
    expect(css).toContain('background-clip: text')
    expect(css).toContain('html.dark')
    expect(css).toContain('prefers-reduced-motion: reduce')
  })
})
