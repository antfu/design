import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { presetAnthonyDesign } from '../unocss'
import { DEFAULT_DARK_BG } from '../unocss/options'
import { severityShortcuts } from '../unocss/severity'
import { buildShortcuts } from '../unocss/shortcuts'

// Type-level guard: the options used in the README / skill examples must stay
// valid against the real preset signature (checked by `vue-tsc`).
const example = presetAnthonyDesign({
  primary: '#49833E',
  darkBackground: '#111',
})

const tokens = [
  ...Object.keys((buildShortcuts(DEFAULT_DARK_BG) as Record<string, string>[])[0]),
  ...Object.keys((severityShortcuts as Record<string, string>[])[0]),
]

function read(rel: string): string {
  return readFileSync(new URL(rel, import.meta.url), 'utf8')
}

describe('docs / skill sync', () => {
  it('the example preset config is valid', () => {
    expect(example.name).toBe('@antfu/design')
  })

  it('rEADME documents every token (run `pnpm docs:gen` if this fails)', () => {
    const readme = read('../README.md')
    for (const token of tokens)
      expect(readme, `missing \`${token}\` in README`).toContain(`\`${token}\``)
  })

  it('skill core-tokens documents every token', () => {
    const core = read('../skills/antfu-design/references/core-tokens.md')
    for (const token of tokens)
      expect(core, `missing \`${token}\` in core-tokens`).toContain(`\`${token}\``)
  })
})
