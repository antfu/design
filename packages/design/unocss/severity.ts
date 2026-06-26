import type { DynamicShortcut, StaticShortcutMap } from '@unocss/core'

/**
 * Severity / freshness color scale, dark-aware (gray → lime → amber → orange →
 * red). Unifies the duplicated severity/age/staleness ramps across the source
 * projects (`color-scale-*`).
 */
export const severityShortcuts: (StaticShortcutMap | DynamicShortcut)[] = [
  {
    'color-scale-neutral': 'text-gray-700 dark:text-gray-300',
    'color-scale-low': 'text-lime-700 dark:text-lime-300 dark:saturate-75',
    'color-scale-medium': 'text-amber-700 dark:text-amber-300 dark:saturate-90',
    'color-scale-high': 'text-orange-700 dark:text-orange-300',
    'color-scale-critical': 'text-red-700 dark:text-red-300',
  },
]
