import type { UserShortcuts } from '@unocss/core'
import type { ColorRamp } from './colors'

/** Default near-black used for dark surfaces. Overridable via `darkBackground`. */
export const DEFAULT_DARK_BG = '#111'

export const DEFAULT_FONTS = {
  sans: 'DM Sans',
  mono: 'DM Mono',
} as const

export interface PresetAnthonyFonts {
  sans?: string
  mono?: string
}

export interface PresetAnthonyDesignOptions {
  /**
   * Primary brand color — a single hex (a ramp is generated) or a full
   * `{ 50..950, DEFAULT }` scale object. Defaults to the antfu green.
   */
  primary?: string | ColorRamp
  /** Near-black for dark surfaces (`bg-base`, `bg-tooltip`, `bg-glass`, …). Default `#111`. */
  darkBackground?: string
  /** Font families. Defaults to DM Sans / DM Mono. The web fonts are the consumer's to load. */
  fonts?: PresetAnthonyFonts
  /** Extra theme fields, deep-merged into the generated theme. */
  theme?: Record<string, any>
  /** Extra shortcuts appended after the built-in layer (so they can override it). */
  extendShortcuts?: UserShortcuts
}
