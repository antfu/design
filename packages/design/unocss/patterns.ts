import type { Rule } from '@unocss/core'

const DOT_COLOR = 'rgba(136, 136, 136, 0.25)'
const GRID_COLOR = 'rgba(136, 136, 136, 0.15)'

/**
 * Background-pattern rules with a variable cell size in px:
 *
 * - `bg-dots` / `bg-dots-<n>` — a radial dot grid (default 16px).
 * - `bg-grid` / `bg-grid-<n>` — crosshatch grid lines (default 16px).
 *
 * Real UnoCSS rules (they emit `background-image` + `background-size`), so the
 * size is dynamic — `bg-dots-24`, `bg-grid-32`, … — rather than a fixed class.
 * The dot/line color is a theme-neutral gray that reads in light and dark.
 *
 * @example
 * // bg-dots      → 16px dot grid
 * // bg-dots-24   → 24px dot grid
 * // bg-grid-32   → 32px grid lines
 */
export const patternRules: Rule[] = [
  [
    /^bg-dots(?:-(\d+))?$/,
    ([, size = '16']) => ({
      'background-image': `radial-gradient(${DOT_COLOR} 1px, transparent 1px)`,
      'background-size': `${size}px ${size}px`,
    }),
    { layer: 'default' },
  ],
  [
    /^bg-grid(?:-(\d+))?$/,
    ([, size = '16']) => ({
      'background-image': `linear-gradient(to right, ${GRID_COLOR} 1px, transparent 1px), linear-gradient(to bottom, ${GRID_COLOR} 1px, transparent 1px)`,
      'background-size': `${size}px ${size}px`,
    }),
    { layer: 'default' },
  ],
]
