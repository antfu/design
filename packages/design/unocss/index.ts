import type { Preset, UserShortcuts } from '@unocss/core'
import type { PresetAnthonyDesignOptions } from './options'
import { definePreset, mergeDeep } from '@unocss/core'
import { buildBlocklist } from './blocklist'
import { error, resolvePrimary, success, warning } from './colors'
import { DEFAULT_DARK_BG, DEFAULT_FONTS } from './options'
import { patternRules } from './patterns'
import { buildRules } from './rules'
import { scrollFadePreflight, scrollFadeRules } from './scroll-fade'
import { severityShortcuts } from './severity'
import { shimmerPreflight, shimmerRules } from './shimmer'
import { buildShortcuts } from './shortcuts'

function assertOptions(options: PresetAnthonyDesignOptions): void {
  const { primary, darkBackground } = options
  if (primary != null && typeof primary !== 'string' && typeof primary !== 'object')
    throw new TypeError(`[@antfu/design] \`primary\` must be a hex string or a color scale object, got ${typeof primary}.`)
  if (darkBackground != null && typeof darkBackground !== 'string')
    throw new TypeError(`[@antfu/design] \`darkBackground\` must be a CSS color string, got ${typeof darkBackground}.`)
}

const GENERIC_FALLBACK = { sans: 'sans-serif', mono: 'monospace' } as const

function stripQuotes(family: string): string {
  return family.trim().replace(/^["']|["']$/g, '')
}

/**
 * Composes a font family onto whatever stack a base preset already declared,
 * instead of replacing it outright.
 *
 * By the time any `extendTheme` hook runs, `@unocss/core` has already merged
 * every preset's static `theme` field — so `existing` reflects the base
 * preset's full fallback chain (e.g. Wind3/Wind4's `ui-sans-serif,system-ui,
 * …,sans-serif,…`). Prepending onto it (rather than overwriting) keeps that
 * chain intact so text never renders in the browser default (often serif)
 * before/if a web font loads. If nothing is there to compose with — a base
 * preset that doesn't declare this theme key at all — append a generic
 * keyword instead so the stack is never bare.
 *
 * Idempotent: if `family` is already the leading entry, `existing` is
 * returned unchanged (no `"DM Sans",DM Sans` duplication on repeated
 * resolves, or when the caller's `fonts` option already matches).
 */
function composeFontFamily(existing: string | undefined, family: string, generic: string): string {
  if (!existing)
    return `${family},${generic}`
  const leading = existing.split(',')[0] ?? ''
  if (stripQuotes(leading).toLowerCase() === stripQuotes(family).toLowerCase())
    return existing
  return `${family},${existing}`
}

/**
 * `presetAnthonyDesign` — the **single** antfu design preset.
 *
 * One preset contributes the whole design layer: the theme scales (a `primary`
 * ramp + `warning`/`success`/`error` + fonts), the semantic `*-base` shortcuts,
 * the dynamic `badge-color-*` / `bg-glass` shortcuts, and the `color-scale-*`
 * severity layer. It bundles **no** base preset, icons, web-fonts or reset — the
 * consumer composes those themselves. The semantic layer is base-agnostic, so it
 * resolves under Wind4, Wind3 or Mini.
 *
 * It deliberately ships **no z-index scale** — stacking is a whole-app concern.
 * The overlay components reference named layers (`z-modal-content`, `z-dropdown`,
 * …); define those in your own UnoCSS `shortcuts` config (see Setup). As a
 * guardrail the preset blocks plain `z-<number>` utilities so every z-index goes
 * through a named layer (opt out with `blocklists: { plainZIndex: false }`).
 *
 * `fonts` is a **brand-name override**, not a full stack you must supply —
 * whatever family name it resolves to (custom, or the `DM Sans` / `DM Mono`
 * default) is *composed* onto the base preset's own generic-fallback chain
 * (`ui-sans-serif, system-ui, …, sans-serif, …`), never a replacement of it.
 * `font-sans` / `font-mono` are fallback-safe out of the box, with or without
 * `presetWebFonts` and regardless of preset order.
 *
 * @param options - Theme + dark-surface options (see {@link PresetAnthonyDesignOptions}).
 * @returns A single UnoCSS `Preset`.
 *
 * @example
 * ```ts
 * import { presetAnthonyDesign } from '@antfu/design/unocss'
 * import transformerDirectives from '@unocss/transformer-directives'
 * import { defineConfig, presetIcons, presetWebFonts, presetWind4 } from 'unocss'
 *
 * export default defineConfig({
 *   presets: [
 *     presetAnthonyDesign({ primary: '#49833E' }),
 *     presetWind4(), // a base preset is required — bring your own
 *     presetIcons(),
 *     presetWebFonts({ fonts: { sans: 'DM Sans', mono: 'DM Mono' } }),
 *   ],
 *   // Required — expands the token `--at-apply` directives in the shipped styles.
 *   transformers: [transformerDirectives()],
 * })
 * ```
 */
export const presetAnthonyDesign = definePreset((options: PresetAnthonyDesignOptions = {}): Preset => {
  assertOptions(options)

  const darkBackground = options.darkBackground ?? DEFAULT_DARK_BG
  const primary = resolvePrimary(options.primary)
  const fonts = { ...DEFAULT_FONTS, ...options.fonts }

  const themeOverrides = mergeDeep(
    { colors: { primary, warning, success, error } } as Record<string, any>,
    (options.theme ?? {}) as Record<string, any>,
  )

  // Appended last so consumers can override the built-in layer precisely.
  const extend = options.extendShortcuts == null
    ? []
    : Array.isArray(options.extendShortcuts)
      ? options.extendShortcuts
      : [options.extendShortcuts]

  const shortcuts: UserShortcuts = [
    ...buildShortcuts(darkBackground),
    ...buildRules(darkBackground),
    ...severityShortcuts,
    ...extend,
    // Appended last so a same-named entry wins over everything above it.
    ...(options.overrides ? [options.overrides] : []),
  ]

  return {
    name: '@antfu/design',
    extendTheme: (theme, config) => {
      const t = theme as Record<string, any>
      // Wind4 keys its font stacks under `theme.font`, not `theme.fontFamily`
      // (which `presetWind4` doesn't declare at all) — mirror the same
      // detection `presetWebFonts` uses so `fonts` composes correctly and
      // takes effect under either base preset.
      const hasWind4 = config.presets?.some(p => p.name === '@unocss/preset-wind4')
      const hasWebFonts = config.presets?.some(p => p.name === '@unocss/preset-web-fonts')
      const fontKey = hasWind4 ? 'font' : 'fontFamily'
      t[fontKey] = { ...t[fontKey] }
      ;(['sans', 'mono'] as const).forEach((key) => {
        // `presetWebFonts` prepends its own family name onto this same stack
        // (unconditionally, on every resolve — it has no idempotency guard
        // of its own). If the consumer configured one and didn't explicitly
        // override `fonts` here, defer to it entirely instead of composing
        // our own default in first — otherwise the *same* brand name (the
        // default `fonts` and `presetWebFonts`'s `fonts` typically match, per
        // the Setup docs) ends up prepended twice.
        if (hasWebFonts && options.fonts?.[key] == null)
          return
        t[fontKey][key] = composeFontFamily(t[fontKey][key], fonts[key], GENERIC_FALLBACK[key])
      })
      return mergeDeep(t as any, themeOverrides as any)
    },
    shortcuts,
    rules: [...patternRules, ...scrollFadeRules, ...shimmerRules],
    preflights: [scrollFadePreflight, shimmerPreflight],
    // Best-practice guardrails (default all on); see the `blocklists` option.
    blocklist: buildBlocklist(options.blocklists),
  }
})

export default presetAnthonyDesign

export {
  type BlocklistsOption,
  buildBlocklist,
  plainZIndexBlocklist,
  RE_PLAIN_Z_INDEX,
} from './blocklist'

export {
  type ColorRamp,
  error as errorRamp,
  generateColorRamp,
  primaryGreen,
  resolvePrimary,
  success as successRamp,
  warning as warningRamp,
} from './colors'

export type {
  PresetAnthonyDesignOptions,
  PresetAnthonyFonts,
} from './options'
