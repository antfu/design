/**
 * Keyboard chord parsing + platform-aware display, adapted from ghfs's
 * `parseKey`. Pure (the one environment touch, `isMac`, degrades gracefully on
 * the server). Kept for the `Kbd` component; the command-registry pairing is
 * deferred with the command palette.
 */

/**
 * Whether the current environment is an Apple platform (macOS/iOS).
 *
 * Detected from `navigator.platform`/`userAgent`; `false` on the server or any
 * non-Apple platform. Drives the `mod` alias (→ `meta` on Apple, `ctrl`
 * elsewhere) and glyph vs. label display.
 *
 * @example
 * isMac // → true on macOS, false on Windows/Linux/server
 */
export const isMac: boolean = typeof navigator !== 'undefined'
  && /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent)

export interface ParsedChord {
  /** Modifiers, alphabetically ordered: `alt` | `ctrl` | `meta` | `shift`. */
  modifiers: string[]
  /** The final non-modifier key, e.g. `k`, `Enter`, `ArrowUp`, `/`. */
  key: string
}

const MOD_ALIASES: Record<string, string> = {
  mod: isMac ? 'meta' : 'ctrl',
  cmd: 'meta',
  command: 'meta',
  super: 'meta',
  win: 'meta',
  meta: 'meta',
  ctrl: 'ctrl',
  control: 'ctrl',
  alt: 'alt',
  option: 'alt',
  opt: 'alt',
  shift: 'shift',
}

const KEY_ALIASES: Record<string, string> = {
  esc: 'Escape',
  escape: 'Escape',
  enter: 'Enter',
  return: 'Enter',
  space: ' ',
  tab: 'Tab',
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
}

const MOD_ORDER = ['ctrl', 'alt', 'shift', 'meta']

/**
 * Parse a single chord like `mod+shift+k`.
 *
 * Splits on `+`, resolving modifier aliases (`mod`/`cmd`/`ctrl`/`alt`/`shift`,
 * etc.) and key aliases (`esc`→`Escape`, `up`→`ArrowUp`, …). Modifiers are
 * returned in canonical `ctrl, alt, shift, meta` order; the last non-modifier
 * token becomes `key`. The platform-sensitive `mod` resolves to `meta` on Apple
 * and `ctrl` elsewhere (see {@link isMac}).
 *
 * @param input - The chord string, e.g. `'mod+shift+k'`.
 * @returns A {@link ParsedChord} with ordered `modifiers` and the final `key`.
 *
 * @example
 * const chord = parseChord('mod+shift+k')
 * chord.key // → 'k'
 * chord.modifiers // → ['shift', 'meta'] on macOS, ['ctrl', 'shift'] elsewhere
 */
export function parseChord(input: string): ParsedChord {
  const tokens = input.trim().split('+').map(t => t.trim()).filter(Boolean)
  const modifiers = new Set<string>()
  let key = ''
  for (const token of tokens) {
    const lower = token.toLowerCase()
    if (lower in MOD_ALIASES)
      modifiers.add(MOD_ALIASES[lower])
    else
      key = KEY_ALIASES[lower] ?? (token.length === 1 ? token.toLowerCase() : token)
  }
  return {
    modifiers: MOD_ORDER.filter(m => modifiers.has(m)),
    key,
  }
}

/**
 * Parse a whitespace-separated chord sequence (`g g`, `ctrl+k p`).
 *
 * Each whitespace-delimited token is parsed with {@link parseChord}, producing an
 * ordered list of chords for multi-keystroke bindings.
 *
 * @param binding - The binding string, e.g. `'g g'` or `'ctrl+k p'`.
 * @returns An array of {@link ParsedChord}, one per chord in the sequence.
 *
 * @example
 * parseBinding('g g') // → [{ modifiers: [], key: 'g' }, { modifiers: [], key: 'g' }] (length 2)
 */
export function parseBinding(binding: string): ParsedChord[] {
  return binding.trim().split(/\s+/).filter(Boolean).map(parseChord)
}

/**
 * Canonical token for matching, e.g. `ctrl+shift+k`.
 *
 * Joins the (already ordered) modifiers and the lower-cased key with `+`,
 * producing a stable string suitable for keying a binding map or comparing
 * against {@link eventToToken}.
 *
 * @param chord - The parsed chord to serialize.
 * @returns The canonical `+`-joined token.
 *
 * @example
 * chordToken(parseChord('shift+ctrl+a')) // → 'ctrl+shift+a'
 */
export function chordToken(chord: ParsedChord): string {
  return [...chord.modifiers, chord.key.toLowerCase()].join('+')
}

/**
 * Token from a real keyboard event.
 *
 * Reads the event's modifier flags and `key`, applies the same key aliases and
 * canonical modifier ordering as {@link parseChord}, and returns a token that
 * can be compared directly against {@link chordToken}.
 *
 * @param event - The `KeyboardEvent` to serialize.
 * @returns The canonical `+`-joined token for the event.
 *
 * @example
 * // For a Ctrl+K keydown event:
 * eventToToken(event) // → 'ctrl+k'
 */
export function eventToToken(event: KeyboardEvent): string {
  const modifiers: string[] = []
  if (event.ctrlKey)
    modifiers.push('ctrl')
  if (event.altKey)
    modifiers.push('alt')
  if (event.shiftKey)
    modifiers.push('shift')
  if (event.metaKey)
    modifiers.push('meta')
  const key = KEY_ALIASES[event.key.toLowerCase()] ?? event.key
  return [...MOD_ORDER.filter(m => modifiers.includes(m)), key.toLowerCase()].join('+')
}

const GLYPHS_MAC: Record<string, string> = { meta: '⌘', ctrl: '⌃', alt: '⌥', shift: '⇧' }
const LABELS: Record<string, string> = { meta: 'Win', ctrl: 'Ctrl', alt: 'Alt', shift: 'Shift' }
const KEY_GLYPHS: Record<string, string> = {
  'Enter': '↵',
  'Escape': 'Esc',
  'ArrowUp': '↑',
  'ArrowDown': '↓',
  'ArrowLeft': '←',
  'ArrowRight': '→',
  ' ': 'Space',
}

/**
 * Render a chord into display tokens, e.g. `['⌘', '⇧', 'K']` on macOS.
 *
 * Modifiers become platform glyphs on Apple (`⌘ ⌃ ⌥ ⇧`) or word labels
 * elsewhere (`Win`, `Ctrl`, `Alt`, `Shift`); the key becomes its glyph (e.g.
 * `↵`, `↑`) or an upper-cased single character.
 *
 * @param chord - The parsed chord to render.
 * @returns An array of display tokens, modifiers first then the key.
 *
 * @example
 * chordDisplay(parseChord('ctrl+k'))
 * // → ['⌃', 'K'] on macOS, ['Ctrl', 'K'] elsewhere
 */
export function chordDisplay(chord: ParsedChord): string[] {
  const mods = chord.modifiers.map(m => isMac ? GLYPHS_MAC[m] : LABELS[m])
  const key = KEY_GLYPHS[chord.key] ?? (chord.key.length === 1 ? chord.key.toUpperCase() : chord.key)
  return [...mods, key]
}

/**
 * Flatten a full binding sequence into display tokens.
 *
 * Parses the binding with {@link parseBinding} and concatenates each chord's
 * {@link chordDisplay} tokens into a single flat array.
 *
 * @param binding - The binding string, e.g. `'ctrl+k'` or `'g g'`.
 * @returns A flat array of display tokens for the whole sequence.
 *
 * @example
 * bindingDisplay('ctrl+k') // → ['⌃', 'K'] on macOS, ['Ctrl', 'K'] elsewhere (non-empty)
 */
export function bindingDisplay(binding: string): string[] {
  return parseBinding(binding).flatMap(chordDisplay)
}
