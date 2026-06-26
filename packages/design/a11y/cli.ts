#!/usr/bin/env node
import type { ColorMode, ContrastScanOptions } from './scan'
import process from 'node:process'
import { formatContrastReport, runContrastScan } from './scan'

const HELP = `antfu-design-a11y — color-contrast scan (light + dark)

Usage:
  antfu-design-a11y <url> [options]

Options:
  --mode <light|dark>    Scan a single mode (repeatable). Default: both.
  --exclude <selector>   Extra CSS selector to skip (repeatable).
  --key <storageKey>     localStorage key for color scheme. Default: antfu-design-color-scheme
  --headed               Run with a visible browser.
  -h, --help             Show this help.

Exits non-zero when any color-contrast violation is found.`

function parseArgs(argv: string[]): { options: ContrastScanOptions, help: boolean } {
  let url = ''
  const modes: ColorMode[] = []
  const exclude: string[] = []
  let colorSchemeStorageKey: string | undefined
  let headless = true
  let help = false

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '-h' || arg === '--help')
      help = true
    else if (arg === '--mode')
      modes.push(argv[++i] as ColorMode)
    else if (arg === '--exclude')
      exclude.push(argv[++i])
    else if (arg === '--key')
      colorSchemeStorageKey = argv[++i]
    else if (arg === '--headed')
      headless = false
    else if (!arg.startsWith('-') && !url)
      url = arg
  }

  return {
    help,
    options: {
      url,
      modes: modes.length ? modes : undefined,
      exclude: exclude.length ? [...['.shiki', '[data-a11y-skip]'], ...exclude] : undefined,
      colorSchemeStorageKey,
      headless,
    },
  }
}

async function main(): Promise<void> {
  const { options, help } = parseArgs(process.argv.slice(2))

  if (help || !options.url) {
    console.log(HELP)
    process.exit(help ? 0 : 1)
  }

  const result = await runContrastScan(options)

  console.log(formatContrastReport(result))
  process.exit(result.passed ? 0 : 1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
