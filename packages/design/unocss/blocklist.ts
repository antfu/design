import type { BlocklistRule } from '@unocss/core'

/**
 * Granular toggle for the preset's blocklists. `true` (default) enables them all,
 * `false` disables them all, or pass an object to flip individual entries. Kept
 * open-ended so future guardrails slot in without another option.
 */
export type BlocklistsOption = boolean | {
  /**
   * Block plain `z-<number>` / `z-[…]` utilities so every z-index flows through a
   * named, app-owned layer (see Setup). Default `true`.
   */
  plainZIndex?: boolean
}

/**
 * Matches a plain z-index utility — `z-50`, `z-[70]`, `-z-10`, `z-[var(--x)]` —
 * but **not** a named layer (`z-modal-content`, `z-nav`) nor the `z-auto` reset.
 *
 * The named layers are shortcuts the app defines in its own UnoCSS `shortcuts`
 * config; their expansion to `z-[70]` happens *inside* the shortcut, which the
 * blocklist never re-checks. So the layers keep resolving while a plain z-index
 * written in markup fails to generate — pushing authors to semantic layers.
 */
export const RE_PLAIN_Z_INDEX = /^-?z-(?:\d+|\[[^\]]+\])$/

/** Blocklist entry banning plain z-index utilities (see {@link RE_PLAIN_Z_INDEX}). */
export const plainZIndexBlocklist: BlocklistRule = [
  RE_PLAIN_Z_INDEX,
  {
    message: (selector: string) =>
      `[@antfu/design] "${selector}" — plain z-index is blocked. Define a named layer in your UnoCSS \`shortcuts\` (e.g. z-modal-content: 'z-[70]') and use that, or pass \`blocklists: { plainZIndex: false }\` to opt out.`,
  },
]

/** Resolve the preset's `blocklist` array from the `blocklists` option (default all on). */
export function buildBlocklist(option: BlocklistsOption = true): BlocklistRule[] {
  if (option === false)
    return []
  const plainZIndex = option === true ? true : option.plainZIndex !== false
  return [
    ...(plainZIndex ? [plainZIndexBlocklist] : []),
  ]
}
