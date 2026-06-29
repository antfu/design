import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createGenerator } from '@unocss/core'
import presetWind4 from '@unocss/preset-wind4'
import transformerDirectives from '@unocss/transformer-directives'
import MagicString from 'magic-string'
import { describe, expect, it } from 'vitest'
import { presetAnthonyDesign } from '../unocss'

const stylesDir = resolve(import.meta.dirname, '../styles')

/** Run the directives transformer over a CSS string, exactly as a consuming app's build would. */
async function transform(css: string): Promise<string> {
  const uno = await createGenerator({ presets: [presetAnthonyDesign(), presetWind4()] })
  const t = transformerDirectives()
  const s = new MagicString(css)
  await t.transform(s as any, 'test.css', { uno, tokens: new Set() } as any)
  return s.toString()
}

const readStyle = (name: string): string => readFileSync(resolve(stylesDir, name), 'utf8')

describe('shipped styles use the design tokens via @unocss/transformer-directives', () => {
  it('expands base.css `bg-base` / `color-base` with a dark variant', async () => {
    const out = await transform(readStyle('base.css'))
    // The `--at-apply` directive must be consumed (no leftover apply *declaration*).
    expect(out).not.toMatch(/--at-apply\s*:/)
    // Light surface references the white token…
    expect(out).toContain('--colors-white')
    // …and the dark surface (`#111`) is scoped under `.dark html`.
    expect(out).toMatch(/\.dark\s+html\{[^}]*#111/)
  })

  it('expands floating-vue.css tooltip tokens (bg-tooltip carries backdrop blur)', async () => {
    const out = await transform(readStyle('floating-vue.css'))
    expect(out).not.toMatch(/--at-apply\s*:/)
    expect(out).toContain('backdrop-filter')
    expect(out).toContain('blur')
  })

  it('expands splitpanes.css splitter tint', async () => {
    const out = await transform(readStyle('splitpanes.css'))
    expect(out).not.toMatch(/--at-apply\s*:/)
    expect(out.toLowerCase()).toContain('background-color')
  })

  it('leaves no `--af-*` token-mirror variables behind in any shipped style', () => {
    for (const f of ['base.css', 'floating-vue.css', 'splitpanes.css', 'reka-ui.css', 'scrollbar.css', 'animations.css'])
      expect(readStyle(f)).not.toContain('--af-')
  })
})
