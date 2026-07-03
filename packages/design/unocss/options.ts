import type { UserShortcuts } from '@unocss/core'
import type { BlocklistsOption } from './blocklist'
import type { ColorRamp } from './colors'

/** Default near-black used for dark surfaces. Overridable via `darkBackground`. */
export const DEFAULT_DARK_BG = '#111'

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
  /**
   * Optional brand font family **names** — not full font stacks, and no
   * default. Left unset, this preset doesn't touch the theme's font family at
   * all — `font-sans`/`font-mono` resolve to whatever the base preset or
   * `presetWebFonts` already set. Pass a name and it's *composed* onto
   * whatever stack is already there, never used to replace it, so
   * `font-sans`/`font-mono` stay fallback-safe either way. The web font
   * itself is still the consumer's to load (e.g. via `presetWebFonts`).
   */
  fonts?: PresetAnthonyFonts
  /** Extra theme fields, deep-merged into the generated theme. */
  theme?: Record<string, any>
  /** Extra shortcuts appended after the built-in layer (so they can override it). */
  extendShortcuts?: UserShortcuts
  /**
   * Override built-in shortcuts by name. Merged in with the **highest** precedence
   * (after the built-in layer and `extendShortcuts`), so e.g.
   * `{ 'bg-base': 'bg-zinc-50 dark:bg-zinc-950' }` redefines what `bg-base` resolves
   * to. Use this to retune the semantic vocabulary; use `extendShortcuts` to add new
   * ones.
   */
  overrides?: Record<string, string>
  /**
   * Best-practice guardrails. Defaults to `true` (all on). Currently the only
   * entry is `plainZIndex`, which blocks plain `z-<number>` / `z-[…]` utilities so
   * every z-index goes through a named layer the app defines (see Setup). Pass
   * `false` to disable all, or `{ plainZIndex: false }` to opt out of one.
   */
  blocklists?: BlocklistsOption
}
