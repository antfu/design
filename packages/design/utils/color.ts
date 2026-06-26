/**
 * Deterministic string → HSL color utilities.
 *
 * Hue-based so the same string always maps to the same hue, with saturation /
 * lightness chosen to "adapt better contrast in light/dark mode" (the note from
 * config-inspector's color composable). Pure and framework-agnostic — the
 * dark-mode flag is an explicit argument so these stay unit-testable without a
 * DOM. Vue callers pass the scheme flag (e.g. `colorScheme === 'dark'`).
 *
 * Color-space manipulation (the OKLCH `labelStyle`) is delegated to colorjs.io.
 */
import Color from 'colorjs.io'

/**
 * Build an `hsla()` string for a given hue, dark-aware.
 *
 * Saturation and lightness are chosen per scheme (65%/40% in light mode, 50%/60%
 * in dark) so the resulting color keeps reasonable contrast against the page.
 *
 * @param hue - The hue in degrees (0–360).
 * @param opacity - The alpha channel, a number or CSS string. Defaults to `1`.
 * @param dark - Whether to use the dark-mode saturation/lightness. Defaults to `false`.
 * @returns An `hsla(...)` CSS color string.
 *
 * @example
 * getHsla(180) // → 'hsla(180, 65%, 40%, 1)'
 * getHsla(180, 0.5) // → 'hsla(180, 65%, 40%, 0.5)'
 * getHsla(180, 1, true) // → 'hsla(180, 50%, 60%, 1)'
 */
export function getHsla(
  hue: number,
  opacity: number | string = 1,
  dark = false,
): string {
  const saturation = dark ? 50 : 65
  const lightness = dark ? 60 : 40
  return `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`
}

/**
 * Map an arbitrary string to a stable hue and return an `hsla()` color.
 *
 * Uses a deterministic string hash folded into the 0–360 hue range, so the same
 * input always yields the same color across runs and machines.
 *
 * @param name - The string to derive a hue from.
 * @param opacity - The alpha channel, a number or CSS string. Defaults to `1`.
 * @param dark - Whether to use the dark-mode saturation/lightness. Defaults to `false`.
 * @returns A deterministic `hsla(...)` CSS color string for the input.
 *
 * @example
 * getHashColorFromString('Vite') === getHashColorFromString('Vite') // → true (deterministic)
 * getHashColorFromString('Vite') !== getHashColorFromString('DevTools') // → true
 */
export function getHashColorFromString(
  name: string,
  opacity: number | string = 1,
  dark = false,
): string {
  let hash = 0
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const h = ((hash % 360) + 360) % 360
  return getHsla(h, opacity, dark)
}

/**
 * Curated brand hues (in degrees) for well-known ecosystems, so common
 * package/plugin names get an on-brand color instead of an arbitrary hash.
 * Overridable by callers via {@link getPluginColor}'s `map` argument.
 *
 * @example
 * defaultBrandHues.vue // → 153
 * defaultBrandHues.react // → 193
 */
export const defaultBrandHues: Record<string, number> = {
  vue: 153,
  nuxt: 153,
  vite: 265,
  react: 193,
  node: 120,
  svelte: 15,
  angular: 348,
  solid: 217,
  ts: 211,
  typescript: 211,
  js: 47,
  javascript: 47,
  unocss: 190,
  tailwind: 198,
  rollup: 12,
  rolldown: 25,
  webpack: 200,
  esbuild: 49,
}

export interface LabelStyle {
  color: string
  background: string
  borderColor: string
}

const labelCache = new Map<string, LabelStyle>()

function oklchToHex(l: number, c: number, h: number): string {
  return new Color('oklch', [l, c, h]).to('srgb').toGamut({ space: 'srgb' }).toString({ format: 'hex' })
}

/**
 * Contrast-aware foreground / background / border for a label from a base color,
 * dark-aware. Uses OKLCH (via colorjs.io) for perceptually even results — the
 * chroma is clamped so arbitrary inputs never look garish — and caches by
 * `color|scheme`. (The OKLCH lightness/chroma stops match ghfs's `labelStyle`.)
 *
 * @param input - The base color as any CSS color string.
 * @param dark - Whether to produce the dark-mode variant. Defaults to `false`.
 * @returns A {@link LabelStyle} with hex `color`, `background` and `borderColor`.
 *
 * @example
 * labelStyle('#d73a4a') // → { color: '#…', background: '#…', borderColor: '#…' } (light)
 * labelStyle('#d73a4a', true) // → the dark-mode variant
 */
export function labelStyle(input: string, dark = false): LabelStyle {
  const key = `${input}|${dark ? 'd' : 'l'}`
  const cached = labelCache.get(key)
  if (cached)
    return cached

  const [, rawChroma, rawHue] = new Color(input).to('oklch').coords
  const h = rawHue == null || !Number.isFinite(rawHue) ? 0 : rawHue
  const c = Math.min(rawChroma == null || !Number.isFinite(rawChroma) ? 0 : rawChroma, 0.18)

  const style: LabelStyle = dark
    ? {
        color: oklchToHex(0.80, c, h),
        background: oklchToHex(0.22, c * 0.5, h),
        borderColor: oklchToHex(0.38, c * 0.7, h),
      }
    : {
        color: oklchToHex(0.42, c, h),
        background: oklchToHex(0.94, c * 0.35, h),
        borderColor: oklchToHex(0.82, c * 0.5, h),
      }

  labelCache.set(key, style)
  return style
}

const PLUGIN_PREFIX_RE = /^(?:@[^/]+\/)?(?:vite-plugin-|rollup-plugin-|webpack-plugin-|unplugin-|nuxt-|eslint-plugin-|postcss-)/

/**
 * Strip common tool prefixes/scopes to get the meaningful part of a name.
 *
 * Removes a recognised plugin prefix (`vite-plugin-`, `rollup-plugin-`,
 * `unplugin-`, `nuxt-`, `eslint-plugin-`, `postcss-`, optionally scoped) and any
 * remaining leading `@scope/`.
 *
 * @param name - The package or plugin name to strip.
 * @returns The meaningful suffix of the name.
 *
 * @example
 * stripPluginPrefix('vite-plugin-inspect') // → 'inspect'
 * stripPluginPrefix('@antfu/eslint-config') // → 'eslint-config'
 */
export function stripPluginPrefix(name: string): string {
  return name.replace(PLUGIN_PREFIX_RE, '').replace(/^@[^/]+\//, '')
}

/**
 * Color a package/plugin name: brand hue when recognised, deterministic hash
 * otherwise.
 *
 * The name is stripped of plugin prefixes and lower-cased, then matched against
 * `map` (exact, or as a `key-` / `key.` prefix). On a hit the brand hue is used;
 * otherwise it falls back to {@link getHashColorFromString} on the original name.
 *
 * @param name - The package or plugin name to color.
 * @param opacity - The alpha channel, a number or CSS string. Defaults to `1`.
 * @param dark - Whether to use the dark-mode variant. Defaults to `false`.
 * @param map - Brand-hue lookup table. Defaults to {@link defaultBrandHues}.
 * @returns An `hsla(...)` CSS color string.
 *
 * @example
 * getPluginColor('vue') // → 'hsla(153, 65%, 40%, 1)'
 * getPluginColor('react') // → 'hsla(193, 65%, 40%, 1)'
 * getPluginColor('vite-plugin-vue') // → 'hsla(153, 65%, 40%, 1)' (matched by suffix)
 */
export function getPluginColor(
  name: string,
  opacity: number | string = 1,
  dark = false,
  map: Record<string, number> = defaultBrandHues,
): string {
  const bare = stripPluginPrefix(name).toLowerCase()
  const key = Object.keys(map).find(k => bare === k || bare.startsWith(`${k}-`) || bare.startsWith(`${k}.`))
  if (key != null)
    return getHsla(map[key], opacity, dark)
  return getHashColorFromString(name, opacity, dark)
}
