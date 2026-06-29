/**
 * Generate the canonical token table *from the preset* and inject it between
 * `<!-- TOKENS:START -->` / `<!-- TOKENS:END -->` markers in the README and the
 * skill's `core-tokens` reference — so docs, skill and code never drift.
 *
 * Run with `pnpm docs:gen`.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { DEFAULT_DARK_BG } from '../unocss/options'
import { severityShortcuts } from '../unocss/severity'
import { buildShortcuts } from '../unocss/shortcuts'

const shortcuts = (buildShortcuts(DEFAULT_DARK_BG) as Record<string, string>[])[0] ?? {}
const severity = (severityShortcuts as Record<string, string>[])[0] ?? {}

function table(rows: [string, string][]): string {
  const head = '| Token | Expands to |\n|---|---|'
  const body = rows
    .map(([k, v]) => `| \`${k}\` | \`${v.replace(/\|/g, '\\|')}\` |`)
    .join('\n')
  return `${head}\n${body}`
}

const type: [string, string][] = []
const semantic: [string, string][] = []
for (const [k, v] of Object.entries(shortcuts)) {
  if (/^text-(?:micro|mini|compact)$/.test(k))
    type.push([k, v])
  else
    semantic.push([k, v])
}

const content = [
  '### Semantic & composite shortcuts',
  '',
  table(semantic),
  '',
  '### Severity scale',
  '',
  table(Object.entries(severity) as [string, string][]),
  '',
  '### Type sizes',
  '',
  table(type),
  '',
  '### Dynamic',
  '',
  '| Token | Expands to |',
  '|---|---|',
  '| `badge-color-<name>` | a chip tinted by any palette color name (dark-aware) |',
  '| `bg-glass` / `bg-glass:<n>` | translucent surface + `backdrop-blur` |',
  '| `bg-dots` / `bg-dots-<n>` | radial dot-grid background, variable cell size in px (default 16) |',
  '| `bg-grid` / `bg-grid-<n>` | crosshatch grid-lines background, variable cell size in px (default 16) |',
  '| `scroll-fade` / `scroll-fade-{x,y,t,b,l,r,s,e}` | scroll-aware edge fade (`scroll-fade-<n>`, `scroll-fade-none`); pairs with `no-scrollbar` |',
  '| `shimmer` / `shimmer-{once,reverse,none}` | text shimmer over `currentColor` (`shimmer-{color,duration,spread,angle}-*`) |',
].join('\n')

function inject(file: string): void {
  const src = readFileSync(file, 'utf8')
  const re = /<!-- TOKENS:START -->[\s\S]*?<!-- TOKENS:END -->/
  if (!re.test(src)) {
    console.warn(`[gen-tokens] no markers in ${file}, skipped`)
    return
  }
  const next = src.replace(re, `<!-- TOKENS:START -->\n${content}\n<!-- TOKENS:END -->`)
  writeFileSync(file, next)

  console.log(`[gen-tokens] wrote ${file}`)
}

const here = fileURLToPath(new URL('.', import.meta.url))
inject(`${here}../README.md`)
inject(`${here}../skills/antfu-design/references/core-tokens.md`)
