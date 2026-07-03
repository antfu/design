import { createGenerator } from '@unocss/core'
import presetWebFonts from '@unocss/preset-web-fonts'
import presetWind3 from '@unocss/preset-wind3'
import presetWind4 from '@unocss/preset-wind4'
import { describe, expect, it } from 'vitest'
import { presetAnthonyDesign } from '../unocss'

// A representative fixture exercising every layer of the design system.
const FIXTURE = [
  // shortcuts (semantic *-base layer)
  'bg-base',
  'bg-secondary',
  'bg-tooltip',
  'color-base',
  'color-muted',
  'color-faint',
  'color-active',
  'border-base',
  'border-mute',
  'border-active',
  'op-fade',
  'op-mute',
  'btn-action',
  'btn-primary',
  'btn-icon-square',
  'badge',
  'badge-muted',
  'text-micro',
  'pad-safe',
  // rules
  'badge-color-green',
  'bg-glass',
  'bg-glass:75',
  // severity
  'color-scale-low',
  'color-scale-critical',
  // theme colors
  'text-primary-600',
  'bg-primary',
  'text-success-500',
  'text-warning-700',
].join(' ')

async function generate(presets: any[], tokens = FIXTURE, preflights = false, shortcuts?: Record<string, string>): Promise<string> {
  const uno = await createGenerator({ presets, ...(shortcuts ? { shortcuts } : {}) })
  const { css } = await uno.generate(tokens, { preflights })
  return css
}

// The named overlay z-index layers the preset leaves to the app to define — here
// in the *app's own* top-level UnoCSS `shortcuts`, exactly as the docs show.
const Z_LAYERS = {
  'z-nav': 'z-[30]',
  'z-modal-content': 'z-[70]',
  'z-drawer-content': 'z-[90]',
}

describe('presetAnthonyDesign', () => {
  it('generates the token fixture on Wind4', async () => {
    const css = await generate([presetAnthonyDesign(), presetWind4()])
    expect(css).toMatchSnapshot()
  })

  it('resolves the same semantic layer on Wind3 (base-agnostic)', async () => {
    const css = await generate([presetAnthonyDesign(), presetWind3()])
    // The shortcuts must resolve on Wind3 too.
    expect(css).toContain('--un-')
    expect(css.length).toBeGreaterThan(0)
    expect(css).toMatchSnapshot()
  })

  it('is a single preset (no nested presets)', async () => {
    const preset = presetAnthonyDesign()
    expect(preset.name).toBe('@antfu/design')
    expect((preset as any).presets).toBeUndefined()
  })

  it('applies a custom primary color', async () => {
    // A string primary becomes the ramp DEFAULT. Wind4 emits theme colors as
    // CSS variables in preflights, so generate with preflights to see the hex.
    const css = await generate([presetAnthonyDesign({ primary: '#0969da' }), presetWind4()], 'bg-primary', true)
    expect(css.toLowerCase()).toContain('#0969da')
  })

  it('applies a custom dark background to bg-base', async () => {
    const css = await generate([presetAnthonyDesign({ darkBackground: '#0a0a0a' }), presetWind4()], 'bg-base')
    expect(css).toContain('#0a0a0a')
  })

  it('appends extendShortcuts (which can override the built-in layer)', async () => {
    const css = await generate(
      [presetAnthonyDesign({ extendShortcuts: [{ 'badge-muted': 'text-red-500' }] }), presetWind4()],
      'badge-muted',
    )
    expect(css).toContain('red')
  })

  it('overrides redefines a built-in shortcut with the highest precedence', async () => {
    const css = await generate(
      // `overrides` wins even over `extendShortcuts` that target the same name.
      [presetAnthonyDesign({
        extendShortcuts: [{ 'bg-base': 'bg-green-500' }],
        overrides: { 'bg-base': 'bg-red-500' },
      }), presetWind4()],
      'bg-base',
    )
    expect(css).toContain('red')
    expect(css).not.toContain('green')
  })

  it('ships no z-index scale by default — named layers do not resolve unless the app defines them', async () => {
    const css = await generate([presetAnthonyDesign(), presetWind4()], 'z-modal-content z-nav z-drawer-content')
    expect(css).not.toContain('z-index')
  })

  it('resolves named layers the app defines in its own top-level shortcuts', async () => {
    const css = await generate(
      [presetAnthonyDesign(), presetWind4()],
      'z-modal-content z-nav z-drawer-content',
      false,
      Z_LAYERS,
    )
    expect(css).toContain('.z-modal-content{z-index:70;}')
    expect(css).toContain('.z-nav{z-index:30;}')
    expect(css).toContain('.z-drawer-content{z-index:90;}')
  })

  it('blocks plain z-index in user code but exempts the same value inside an app shortcut', async () => {
    const css = await generate(
      [presetAnthonyDesign(), presetWind4()],
      // `z-[70]` written directly is blocked; `z-modal-content` expands to `z-[70]`
      // inside a shortcut, which the blocklist never re-checks.
      'z-50 z-[70] -z-10 md:z-50 z-modal-content z-auto',
      false,
      Z_LAYERS,
    )
    // Plain numeric / arbitrary z-index (incl. under a variant) never reaches the output…
    expect(css).not.toContain('z-index:50')
    expect(css).not.toContain('z-index:-10')
    expect(css).not.toMatch(/\.-?z-(?:50|\\\[70\\\])\{/)
    // …but the named layer (a shortcut expansion) is exempt and `z-auto` is allowed.
    expect(css).toContain('.z-modal-content{z-index:70;}')
    expect(css).toContain('z-index:auto')
  })

  it('blocklists: false disables all guardrails (plain z-index resolves)', async () => {
    const css = await generate([presetAnthonyDesign({ blocklists: false }), presetWind4()], 'z-50')
    expect(css).toContain('z-index:50')
  })

  it('blocklists: { plainZIndex: false } opts out of just the z-index guardrail', async () => {
    const css = await generate([presetAnthonyDesign({ blocklists: { plainZIndex: false } }), presetWind4()], 'z-50')
    expect(css).toContain('z-index:50')
  })

  it('generates bg-dots / bg-grid pattern rules with a variable size', async () => {
    const css = await generate(
      [presetAnthonyDesign(), presetWind4()],
      'bg-dots bg-dots-24 bg-grid bg-grid-32',
    )
    expect(css).toContain('radial-gradient')
    expect(css).toContain('linear-gradient')
    expect(css).toContain('16px 16px') // default size
    expect(css).toContain('24px 24px')
    expect(css).toContain('32px 32px')
  })

  it('validates option shapes', () => {
    // @ts-expect-error invalid on purpose
    expect(() => presetAnthonyDesign({ primary: 123 })).toThrow(/primary/)
    // @ts-expect-error invalid on purpose
    expect(() => presetAnthonyDesign({ darkBackground: 5 })).toThrow(/darkBackground/)
  })
})

describe('fonts (regression: presetAnthonyDesign must never touch theme.fontFamily/theme.font)', () => {
  // No network fetch — resolves font names without hitting a provider.
  const webFonts = () => presetWebFonts({ provider: 'none', fonts: { sans: 'DM Sans', mono: 'DM Mono' } })

  // Wind3/Mini resolve `.font-sans`/`.font-mono` to a literal `font-family` value.
  function fontFamilyOf(css: string, cls: string): string {
    const match = css.match(new RegExp(`\\.${cls}\\{font-family:([^;]+);\\}`))
    expect(match, `expected a \`.${cls}\` rule in:\n${css}`).not.toBeNull()
    return match![1]!
  }

  // Wind4 resolves `.font-sans`/`.font-mono` to `var(--font-sans)` /
  // `var(--font-mono)`, whose value is declared in the `:root, :host` theme
  // preflight — so the stack has to be read from there instead.
  function cssVarOf(css: string, name: string): string {
    const match = css.match(new RegExp(`--${name}:\\s*([^;]+);`))
    expect(match, `expected a \`--${name}\` custom property in:\n${css}`).not.toBeNull()
    return match![1]!
  }

  it.each([
    ['presetWind3', () => presetWind3()],
    ['presetWind4', () => presetWind4()],
  ] as const)('%s alone vs. + presetAnthonyDesign: font-sans/font-mono are byte-identical', async (name, base) => {
    // presetAnthonyDesign has no opinion on fonts — adding it must not change
    // the base preset's own font-family output at all (its other preflights,
    // e.g. scroll-fade/shimmer, are unrelated and expected to still differ).
    const withDesign = await generate([presetAnthonyDesign(), base()], 'font-sans font-mono', true)
    const withoutDesign = await generate([base()], 'font-sans font-mono', true)

    const extract = name === 'presetWind4'
      ? (css: string) => [cssVarOf(css, 'font-sans'), cssVarOf(css, 'font-mono')]
      : (css: string) => [fontFamilyOf(css, 'font-sans'), fontFamilyOf(css, 'font-mono')]
    expect(extract(withDesign)).toEqual(extract(withoutDesign))
  })

  it.each([
    ['presetWind3', () => presetWind3()],
    ['presetWind4', () => presetWind4()],
  ] as const)('%s + presetAnthonyDesign (declared first) + presetWebFonts composes a fallback-safe stack', async (name, base) => {
    const uno = await createGenerator({ presets: [presetAnthonyDesign(), base(), webFonts()] })
    const { css } = await uno.generate('font-sans font-mono', { preflights: true })

    const sans = name === 'presetWind4' ? cssVarOf(css, 'font-sans') : fontFamilyOf(css, 'font-sans')
    const mono = name === 'presetWind4' ? cssVarOf(css, 'font-mono') : fontFamilyOf(css, 'font-mono')

    expect(sans).toMatch(/sans-serif/)
    expect(mono).toMatch(/monospace/)
    // No duplicated leading family (the "DM Sans",DM Sans regression).
    expect(sans.match(/DM Sans/g)?.length).toBe(1)
    expect(mono.match(/DM Mono/g)?.length).toBe(1)
  })

  it.each([
    ['presetWind3', () => presetWind3()],
    ['presetWind4', () => presetWind4()],
  ] as const)('%s + presetAnthonyDesign (declared after) + presetWebFonts composes the same fallback-safe stack', async (name, base) => {
    // Preset order must not matter — `extendTheme` hooks all see the fully
    // merged static theme regardless of declaration order.
    const uno = await createGenerator({ presets: [base(), presetAnthonyDesign(), webFonts()] })
    const { css } = await uno.generate('font-sans font-mono', { preflights: true })

    const sans = name === 'presetWind4' ? cssVarOf(css, 'font-sans') : fontFamilyOf(css, 'font-sans')
    const mono = name === 'presetWind4' ? cssVarOf(css, 'font-mono') : fontFamilyOf(css, 'font-mono')

    expect(sans).toMatch(/sans-serif/)
    expect(mono).toMatch(/monospace/)
    expect(sans.match(/DM Sans/g)?.length).toBe(1)
    expect(mono.match(/DM Mono/g)?.length).toBe(1)
  })

  it('a brand name with no fetching is set via `presetWebFonts({ provider: \'none\' })`, not presetAnthonyDesign', async () => {
    const css = await generate(
      [presetAnthonyDesign(), presetWind3(), presetWebFonts({ provider: 'none', fonts: { sans: 'Inter', mono: 'Fira Code' } })],
      'font-sans font-mono',
    )
    expect(fontFamilyOf(css, 'font-sans')).toBe('Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"')
    expect(fontFamilyOf(css, 'font-mono')).toBe('Fira Code,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace')
  })
})
