// Regenerates the component catalog table — injected between
// `<!-- COMPONENTS:START -->` / `<!-- COMPONENTS:END -->` markers in the
// package README and the skill's `core-components` reference — from the
// components on disk, so the docs, the skill, and the code never drift.
//
// "Documented" (one row per component) = has a co-located `*.stories.ts`
// (the same signal Storybook/Overview.mdx use). A `.vue` with no story is
// treated as a sub-component and folded into its nearest documented sibling
// in the same category (the longest name-prefix match, e.g.
// `OverlayDropdownItem` → `OverlayDropdown`).
//
// The "use it for" prose is colocated with the component, not in a separate
// data file that could drift on its own: it's a `<!-- @description ... -->`
// comment on the first line of the `.vue` file, right above `<script setup>`.
// A documented component missing (or with an empty) description throws —
// there's no silent fallback, so an added/renamed component always forces a
// one-line addition before the build passes.
//
// Run from the package root: `node scripts/gen-components.mjs`
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const here = fileURLToPath(new URL('.', import.meta.url))
const base = `${here}../components`
const categoryOrder = ['Action', 'Display', 'Form', 'Overlay', 'Layout', 'Feedback']

const DESCRIPTION_RE = /^<!-- @description (.+) -->/

function readDescription(category, name) {
  const src = readFileSync(`${base}/${category}/${name}.vue`, 'utf8')
  const match = src.match(DESCRIPTION_RE)
  if (!match || !match[1].trim()) {
    throw new Error(
      `[gen-components] ${category}/${name}.vue has no leading `
      + `\`<!-- @description ... -->\` comment (must be the file's first line, `
      + `right above <script setup>) — add one before regenerating.`,
    )
  }
  return match[1].trim()
}

const byCategory = new Map()
const unknown = []

for (const category of categoryOrder) {
  const entries = readdirSync(`${base}/${category}`, { withFileTypes: true })
    .filter(e => e.isFile() && e.name.endsWith('.vue'))
    .map(e => e.name.replace(/\.vue$/, ''))
    .sort()

  const hasStory = (name) => {
    try {
      readFileSync(`${base}/${category}/${name}.stories.ts`)
      return true
    }
    catch {
      return false
    }
  }

  const documented = entries.filter(hasStory)
  const related = entries.filter(name => !hasStory(name))

  const relatedOf = new Map(documented.map(name => [name, []]))
  for (const name of related) {
    const parent = documented
      .filter(d => name.startsWith(d))
      .sort((a, b) => b.length - a.length)[0]
    if (parent)
      relatedOf.get(parent).push(name)
    else
      unknown.push(`${category}/${name} (no story, and no documented sibling prefix to fold into)`)
  }

  byCategory.set(category, documented.map(name => ({
    name,
    related: relatedOf.get(name),
    description: readDescription(category, name),
  })))
}

if (unknown.length) {
  process.exitCode = 1
  throw new Error(`[gen-components] couldn't place these components:\n  ${unknown.join('\n  ')}`)
}

function table(heading, category, components) {
  const rows = components.map(({ name, related, description }) => {
    const cell = related.length
      ? `\`${name}\` (+ ${related.map(r => `\`${r}\``).join(', ')})`
      : `\`${name}\``
    return `| ${cell} | ${description} |`
  })
  return [`${heading} ${category}`, '', '| Component | Use it for |', '|---|---|', ...rows].join('\n')
}

function render(heading) {
  const blocks = []
  for (const [category, components] of byCategory)
    blocks.push(table(heading, category, components))
  return blocks.join('\n\n')
}

function inject(file, heading) {
  const src = readFileSync(file, 'utf8')
  const re = /<!-- COMPONENTS:START -->[\s\S]*?<!-- COMPONENTS:END -->/
  if (!re.test(src)) {
    console.warn(`[gen-components] no markers in ${file}, skipped`)
    return
  }
  const next = src.replace(re, `<!-- COMPONENTS:START -->\n${render(heading)}\n<!-- COMPONENTS:END -->`)
  writeFileSync(file, next)
  console.log(`[gen-components] wrote ${file}`)
}

inject(`${here}../README.md`, '###')
inject(`${here}../../../skills/antfu-design/references/core-components.md`, '##')

const count = [...byCategory.values()].flat().length
console.log(`[gen-components] ${count} components across ${byCategory.size} categories`)
