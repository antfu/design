/**
 * WCAG contrast helpers — relative luminance and contrast ratio — built on
 * [colorjs.io](https://colorjs.io) rather than hand-rolled color math, so token
 * pairs can be asserted in unit tests (e.g. `color-base` on `bg-base` meets AA
 * in both themes). Complements the runnable axe-core scan in `../a11y`.
 */
import Color from 'colorjs.io'

export interface RGB {
  r: number
  g: number
  b: number
}

function toColor(input: string | RGB): Color {
  return typeof input === 'string'
    ? new Color(input)
    : new Color('srgb', [input.r / 255, input.g / 255, input.b / 255])
}

/**
 * Parse any CSS color into `{ r, g, b }` (0–255), via colorjs.io. An already
 * parsed {@link RGB} is returned unchanged.
 *
 * @param input - A CSS color string (hex, `rgb()`, `hsl()`, named, …) or an {@link RGB}.
 * @returns The color as `{ r, g, b }` with 0–255 channels.
 *
 * @example
 * parseColor('#fff') // → { r: 255, g: 255, b: 255 }
 * parseColor('#000000') // → { r: 0, g: 0, b: 0 }
 * parseColor('white') // → { r: 255, g: 255, b: 255 }
 */
export function parseColor(input: string | RGB): RGB {
  if (typeof input !== 'string')
    return input
  const [r, g, b] = new Color(input).to('srgb').coords
  return { r: Math.round((r ?? 0) * 255), g: Math.round((g ?? 0) * 255), b: Math.round((b ?? 0) * 255) }
}

/**
 * WCAG relative luminance of a color (0 = black, 1 = white).
 *
 * @param color - The color as a CSS string or {@link RGB} object.
 * @returns The relative luminance in the range 0–1.
 *
 * @example
 * relativeLuminance('#000') // → 0
 * relativeLuminance('#fff') // → 1
 */
export function relativeLuminance(color: string | RGB): number {
  return toColor(color).luminance
}

/**
 * WCAG 2.1 contrast ratio between two colors (1 → 21). Argument order does not
 * matter.
 *
 * @param a - The first color, as a CSS string or {@link RGB} object.
 * @param b - The second color, as a CSS string or {@link RGB} object.
 * @returns The contrast ratio, from `1` (identical) up to `21` (black on white).
 *
 * @example
 * Math.round(contrastRatio('#000', '#fff')) // → 21
 */
export function contrastRatio(a: string | RGB, b: string | RGB): number {
  return toColor(a).contrast(toColor(b), 'WCAG21')
}

export type ContrastLevel = 'AA' | 'AAA'

/**
 * Whether a ratio satisfies a WCAG level for normal or large text.
 *
 * Thresholds are 4.5 (AA) / 7 (AAA) for normal text and 3 (AA) / 4.5 (AAA) for
 * large text.
 *
 * @param ratio - The contrast ratio to test (see {@link contrastRatio}).
 * @param level - The WCAG conformance level, `'AA'` or `'AAA'`. Defaults to `'AA'`.
 * @param large - Whether to use the relaxed large-text thresholds. Defaults to `false`.
 * @returns `true` if the ratio meets or exceeds the threshold.
 *
 * @example
 * meetsContrast(4.5) // → true
 * meetsContrast(4.49) // → false
 */
export function meetsContrast(ratio: number, level: ContrastLevel = 'AA', large = false): boolean {
  const thresholds = { AA: large ? 3 : 4.5, AAA: large ? 4.5 : 7 }
  return ratio >= thresholds[level]
}

export interface ContrastResult {
  ratio: number
  AA: boolean
  AALarge: boolean
  AAA: boolean
  AAALarge: boolean
}

/**
 * Full contrast report between a foreground and background color.
 *
 * @param foreground - The foreground color, as a CSS string or {@link RGB} object.
 * @param background - The background color, as a CSS string or {@link RGB} object.
 * @returns A {@link ContrastResult} with the rounded `ratio` and per-level booleans.
 *
 * @example
 * checkContrast('#525252', '#fff').AA // → true
 */
export function checkContrast(foreground: string | RGB, background: string | RGB): ContrastResult {
  const ratio = Math.round(contrastRatio(foreground, background) * 100) / 100
  return {
    ratio,
    AA: meetsContrast(ratio, 'AA'),
    AALarge: meetsContrast(ratio, 'AA', true),
    AAA: meetsContrast(ratio, 'AAA'),
    AAALarge: meetsContrast(ratio, 'AAA', true),
  }
}
