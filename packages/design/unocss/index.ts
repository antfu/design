import type { Preset, UserShortcuts } from '@unocss/core'
import type { PresetAnthonyDesignOptions } from './options'
import { definePreset, mergeDeep } from '@unocss/core'
import { error, resolvePrimary, success, warning } from './colors'
import { DEFAULT_DARK_BG, DEFAULT_FONTS } from './options'
import { buildRules } from './rules'
import { severityShortcuts } from './severity'
import { buildShortcuts } from './shortcuts'

function assertOptions(options: PresetAnthonyDesignOptions): void {
  const { primary, darkBackground } = options
  if (primary != null && typeof primary !== 'string' && typeof primary !== 'object')
    throw new TypeError(`[@antfu/design] \`primary\` must be a hex string or a color scale object, got ${typeof primary}.`)
  if (darkBackground != null && typeof darkBackground !== 'string')
    throw new TypeError(`[@antfu/design] \`darkBackground\` must be a CSS color string, got ${typeof darkBackground}.`)
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
 * @param options - Theme + dark-surface options (see {@link PresetAnthonyDesignOptions}).
 * @returns A single UnoCSS `Preset`.
 *
 * @example
 * ```ts
 * import { presetAnthonyDesign } from '@antfu/design/unocss'
 * import { defineConfig, presetIcons, presetWebFonts, presetWind4 } from 'unocss'
 *
 * export default defineConfig({
 *   presets: [
 *     presetAnthonyDesign({ primary: '#49833E' }),
 *     presetWind4(), // a base preset is required — bring your own
 *     presetIcons(),
 *     presetWebFonts({ fonts: { sans: 'DM Sans', mono: 'DM Mono' } }),
 *   ],
 * })
 * ```
 */
export const presetAnthonyDesign = definePreset((options: PresetAnthonyDesignOptions = {}): Preset => {
  assertOptions(options)

  const darkBackground = options.darkBackground ?? DEFAULT_DARK_BG
  const primary = resolvePrimary(options.primary)
  const fonts = { ...DEFAULT_FONTS, ...options.fonts }

  const themeOverrides = mergeDeep(
    {
      colors: { primary, warning, success, error },
      fontFamily: { sans: fonts.sans, mono: fonts.mono },
    } as Record<string, any>,
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
  ]

  return {
    name: '@antfu/design',
    extendTheme: theme => mergeDeep(theme as any, themeOverrides as any),
    shortcuts,
  }
})

export default presetAnthonyDesign

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
