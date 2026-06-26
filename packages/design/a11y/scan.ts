/**
 * Programmatic color-contrast scan, adapted from config-inspector's
 * `a11y.spec.ts`: launch a URL, toggle light **and** dark mode, run axe-core's
 * `color-contrast` rule, and collect violations. `@axe-core/playwright` and
 * `playwright` are optional peers, imported lazily so the rest of the package
 * stays usable without them.
 */

export type ColorMode = 'light' | 'dark'

export interface ContrastScanOptions {
  /** Target URL (an app or Storybook iframe). */
  url: string
  /** Modes to scan. Default `['light', 'dark']`. */
  modes?: ColorMode[]
  /** CSS selectors to exclude (e.g. code blocks). */
  exclude?: string[]
  /** localStorage key the app reads its color scheme from. */
  colorSchemeStorageKey?: string
  /** Stored value representing light mode. */
  lightValue?: string
  /** Stored value representing dark mode. */
  darkValue?: string
  /** Headless browser. Default `true`. */
  headless?: boolean
  /** Max ms to wait for the `dark` class to settle. Default `5000`. */
  timeout?: number
}

export interface ContrastViolationNode {
  target: string[]
  failureSummary?: string
}

export interface ContrastViolation {
  id: string
  impact?: string | null
  help: string
  mode: ColorMode
  nodes: ContrastViolationNode[]
}

export interface ContrastScanResult {
  passed: boolean
  violations: ContrastViolation[]
}

const DEFAULT_EXCLUDE = ['.shiki', '[data-a11y-skip]']

/** Run the contrast scan and return structured violations. */
export async function runContrastScan(options: ContrastScanOptions): Promise<ContrastScanResult> {
  const {
    url,
    modes = ['light', 'dark'],
    exclude = DEFAULT_EXCLUDE,
    colorSchemeStorageKey = 'antfu-design-color-scheme',
    lightValue = 'light',
    darkValue = 'dark',
    headless = true,
    timeout = 5000,
  } = options

  const { chromium } = await import('playwright')
  const { default: AxeBuilder } = await import('@axe-core/playwright')

  const browser = await chromium.launch({ headless })
  const violations: ContrastViolation[] = []

  try {
    for (const mode of modes) {
      const context = await browser.newContext()
      const page = await context.newPage()
      await page.addInitScript(
        ([key, value]) => {
          try {
            localStorage.setItem(key, value)
          }
          catch {}
        },
        [colorSchemeStorageKey, mode === 'dark' ? darkValue : lightValue] as [string, string],
      )
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForFunction(
        m => document.documentElement.classList.contains('dark') === (m === 'dark'),
        mode,
        { timeout },
      ).catch(() => {})

      let builder = new AxeBuilder({ page }).withRules(['color-contrast'])
      for (const sel of exclude)
        builder = builder.exclude(sel)

      const results = await builder.analyze()
      for (const v of results.violations) {
        violations.push({
          id: v.id,
          impact: v.impact,
          help: v.help,
          mode,
          nodes: v.nodes.map(n => ({
            target: n.target.map(String),
            failureSummary: n.failureSummary,
          })),
        })
      }
      await context.close()
    }
  }
  finally {
    await browser.close()
  }

  return { passed: violations.length === 0, violations }
}

/** Format a scan result as a readable, multi-line report. */
export function formatContrastReport(result: ContrastScanResult): string {
  if (result.passed)
    return '✓ No color-contrast violations found.'
  const lines: string[] = [`✗ ${result.violations.length} color-contrast violation(s):`, '']
  for (const v of result.violations) {
    lines.push(`  [${v.mode}] ${v.help}${v.impact ? ` (${v.impact})` : ''}`)
    for (const node of v.nodes)
      lines.push(`    - ${node.target.join(' ')}`)
  }
  return lines.join('\n')
}
