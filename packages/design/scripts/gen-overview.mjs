// Regenerates the Storybook Overview page (components/Overview.mdx) from the
// stories on disk: one linked `### [Name](…)` title + a <Canvas> per variation.
// Run from the package root: `node scripts/gen-overview.mjs`
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'

const base = 'components'
const cats = ['Action', 'Display', 'Form', 'Feedback', 'Layout', 'Overlay', 'Utility']
const files = []
for (const c of cats) {
  for (const f of readdirSync(`${base}/${c}`).filter(f => f.endsWith('.stories.ts')).sort()) {
    const name = f.replace('.stories.ts', '')
    const exps = [...readFileSync(`${base}/${c}/${f}`, 'utf8').matchAll(/export const (\w+)/g)].map(m => m[1])
    files.push({ c, name, exps, id: `${c.toLowerCase()}-${name.toLowerCase()}--docs` })
  }
}
let out = `import { Canvas, Meta } from '@storybook/addon-docs/blocks'\n`
for (const f of files) out += `import * as ${f.name} from './${f.c}/${f.name}.stories'\n`
out += `\n<Meta title="Overview" />\n\n# @antfu/design\n\nA composable, token-driven design system for devtools-style Vue apps. Each tile is a live story; click a component name to open its full page.\n`
let cur = ''
for (const f of files) {
  if (f.c !== cur) {
    out += `\n## ${f.c}\n`
    cur = f.c
  }
  out += `\n### [${f.name}](/?path=/docs/${f.id})\n\n${f.exps.map(e => `<Canvas of={${f.name}.${e}} />`).join('\n')}\n`
}
writeFileSync(`${base}/Overview.mdx`, out)
console.log(`Overview.mdx: ${files.length} components`)
