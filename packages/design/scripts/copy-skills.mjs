/**
 * Copy the repo-root `skills/` directory into the package so the published
 * tarball ships the skill (consumable via `skills-npm`), while the repo root
 * stays the single source of truth (consumable via the `skills` CLI).
 *
 * Runs automatically on `prepack`. Entries matching `npm-*` (skills installed
 * locally by `skills-npm`) are excluded.
 */
import { cpSync, existsSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const here = fileURLToPath(new URL('.', import.meta.url))
const source = join(here, '..', '..', '..', 'skills')
const target = join(here, '..', 'skills')

if (!existsSync(source)) {
  console.error(`[copy-skills] source not found: ${source}`)
  process.exit(1)
}

rmSync(target, { recursive: true, force: true })

for (const entry of readdirSync(source, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name.startsWith('npm-'))
    continue
  cpSync(join(source, entry.name), join(target, entry.name), { recursive: true })
  console.log(`[copy-skills] copied ${entry.name}`)
}
