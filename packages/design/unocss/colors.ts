/**
 * Color ramps for the design system.
 *
 * Defaults are hand-tuned for AA contrast in both light and dark mode (the
 * a11y contrast check guards this). A `generateColorRamp` helper produces a
 * usable ramp from a single hex when a consumer overrides `primary` with a
 * plain string rather than a full scale object — stepped in OKLCH via colorjs.io.
 */
import Color from 'colorjs.io'

export type ColorRamp = Record<string | number, string>

/** Default antfu green — the brand color, used as `primary` unless overridden. */
export const primaryGreen: ColorRamp = {
  50: '#f4f9f1',
  100: '#e6f2e0',
  200: '#cde4c2',
  300: '#a8cf96',
  400: '#7eb267',
  500: '#5b9544',
  600: '#49833e',
  700: '#3b6832',
  800: '#31532b',
  900: '#2a4526',
  950: '#132611',
  DEFAULT: '#49833e',
}

/**
 * Semantic ramps sourced from `eslint/config-inspector` (the most complete
 * reference set among the source projects). Added under semantic names so they
 * never clobber the base preset's built-in palette (`amber`, `green`, `red`).
 */
export const warning: ColorRamp = {
  50: '#fffaeb',
  100: '#fef0c7',
  200: '#fedf89',
  300: '#fec84b',
  400: '#fdb022',
  500: '#f79009',
  600: '#dc6803',
  700: '#b54708',
  800: '#93370d',
  900: '#7a2e0e',
  950: '#4e1d09',
  DEFAULT: '#f79009',
}

export const success: ColorRamp = {
  50: '#ecfdf3',
  100: '#d1fadf',
  200: '#a6f4c5',
  300: '#6ce9a6',
  400: '#32d583',
  500: '#12b76a',
  600: '#039855',
  700: '#027a48',
  800: '#05603a',
  900: '#054f31',
  950: '#03281a',
  DEFAULT: '#12b76a',
}

export const error: ColorRamp = {
  50: '#fff1f3',
  100: '#ffe4e8',
  200: '#fecdd6',
  300: '#fea3b4',
  400: '#fd6f8e',
  500: '#f63d68',
  600: '#e31b54',
  700: '#c01048',
  800: '#a11043',
  900: '#89123e',
  950: '#510322',
  DEFAULT: '#f63d68',
}

/** Each stop paired with its target OKLCH lightness (0–1). */
const RAMP_STEPS = [
  [50, 0.97],
  [100, 0.94],
  [200, 0.87],
  [300, 0.78],
  [400, 0.68],
  [500, 0.58],
  [600, 0.50],
  [700, 0.42],
  [800, 0.35],
  [900, 0.28],
  [950, 0.18],
] as const

/**
 * Generate an 11-stop color ramp (`50`..`950` + `DEFAULT`) from a single color,
 * preserving its OKLCH hue while stepping lightness across fixed stops (chroma is
 * tapered toward the extremes so tints/shades stay clean). Stepped in OKLCH via
 * colorjs.io for perceptually even results. Used when `primary` is a string.
 *
 * @param input - The base color as any CSS color string; becomes the ramp's `DEFAULT`.
 * @returns A ramp keyed `50`–`950` plus `DEFAULT`.
 *
 * @example
 * generateColorRamp('#0969da')
 * // → { DEFAULT: '#0969da', 50: '#…', … , 950: '#…' }
 */
export function generateColorRamp(input: string): ColorRamp {
  const [, chroma, rawHue] = new Color(input).to('oklch').coords
  const hue = Number.isFinite(rawHue) ? rawHue : 0
  const ramp: ColorRamp = { DEFAULT: input }
  RAMP_STEPS.forEach(([stop, l]) => {
    // Taper chroma at the lightest/darkest stops so they don't look muddy.
    const c = (chroma || 0) * (l > 0.9 || l < 0.25 ? 0.6 : 1)
    ramp[stop] = new Color('oklch', [l, c, hue]).to('srgb').toGamut({ space: 'srgb' }).toString({ format: 'hex' })
  })
  return ramp
}

/**
 * Normalize the `primary` option into a full color ramp: a string is expanded
 * via {@link generateColorRamp}, a ramp object passes through, and `undefined`
 * falls back to the default antfu green.
 *
 * @param primary - A hex string, a full ramp, or `undefined`.
 * @returns The resolved {@link ColorRamp}.
 *
 * @example
 * resolvePrimary() // → primaryGreen
 * resolvePrimary('#0969da') // → generated ramp with DEFAULT '#0969da'
 */
export function resolvePrimary(primary?: string | ColorRamp): ColorRamp {
  if (!primary)
    return primaryGreen
  if (typeof primary === 'string')
    return generateColorRamp(primary)
  return primary
}
