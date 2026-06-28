import { clamp, toArray } from '@antfu/utils'
import { describe, expect, it } from 'vitest'
import { getHashColorFromString, getHsla, getPluginColor, stripPluginPrefix } from '../utils/color'
import { checkContrast, contrastRatio, meetsContrast, parseColor, relativeLuminance } from '../utils/contrast'
import { formatBytes, formatDuration, formatTimeAgo, getAgeColor, getBytesColor, mapSeverity } from '../utils/format'
import { bindingDisplay, chordToken, parseBinding, parseChord } from '../utils/keybinding'
import { isNumeric, nth, pluralize, stringifyUnquoted } from '../utils/misc'
import { getModuleNameFromPath, getPnpmPackageInfoFromPath, isPackageName, parsePnpmSegment, relativeModulePath } from '../utils/path'
import { compareSemver, compareSemverRange, parseSemverRange } from '../utils/semver'
import { toTree } from '../utils/tree'

describe('color', () => {
  it('is deterministic', () => {
    expect(getHashColorFromString('Vite')).toBe(getHashColorFromString('Vite'))
    expect(getHashColorFromString('Vite')).not.toBe(getHashColorFromString('DevTools'))
  })
  it('getHsla light/dark', () => {
    expect(getHsla(180)).toBe('hsla(180, 65%, 40%, 1)')
    expect(getHsla(180, 0.5)).toBe('hsla(180, 65%, 40%, 0.5)')
    expect(getHsla(180, 1, true)).toBe('hsla(180, 50%, 60%, 1)')
  })
  it('plugin color uses brand hues + strips prefixes', () => {
    expect(stripPluginPrefix('vite-plugin-inspect')).toBe('inspect')
    expect(stripPluginPrefix('@antfu/eslint-config')).toBe('eslint-config')
    expect(getPluginColor('vue')).toBe(getHsla(153))
    expect(getPluginColor('react')).toBe(getHsla(193))
    // a vite-plugin-* name colors by its meaningful suffix
    expect(getPluginColor('vite-plugin-vue')).toBe(getHsla(153))
  })
})

describe('format', () => {
  it('formatBytes', () => {
    expect(formatBytes(0)).toEqual(['0', 'B'])
    expect(formatBytes(512)).toEqual(['512', 'B'])
    expect(formatBytes(1024)).toEqual(['1', 'KB'])
    expect(formatBytes(1536)).toEqual(['1.5', 'KB'])
    expect(formatBytes(1_000_000, { base: 1000 })).toEqual(['1', 'MB'])
  })
  it('formatDuration', () => {
    expect(formatDuration(null)).toEqual(['', '-'])
    expect(formatDuration(0.5)).toEqual(['<1', 'ms'])
    expect(formatDuration(250)).toEqual(['250', 'ms'])
    expect(formatDuration(1500)).toEqual(['1.5', 's'])
    expect(formatDuration(90_000)).toEqual(['1.5', 'min'])
  })
  it('formatTimeAgo (deterministic with explicit now)', () => {
    const now = 1_000_000_000_000
    expect(formatTimeAgo(now, now)).toBe('just now')
    expect(formatTimeAgo(now - 3 * 86_400_000, now)).toBe('3 d ago')
    expect(formatTimeAgo(now + 2 * 3_600_000, now)).toBe('in 2 h')
  })
  it('severity mapping', () => {
    expect(getBytesColor(10 * 1024)).toBe('color-scale-neutral')
    expect(getBytesColor(50 * 1024 * 1024)).toBe('color-scale-critical')
    expect(getAgeColor(10 * 86_400_000)).toBe('color-scale-neutral')
    expect(mapSeverity(999, [[10, 'color-scale-low']])).toBe('color-scale-low')
  })
})

describe('contrast (WCAG)', () => {
  it('parses colors', () => {
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255 })
    expect(parseColor('#000000')).toEqual({ r: 0, g: 0, b: 0 })
    expect(parseColor('white')).toEqual({ r: 255, g: 255, b: 255 })
  })
  it('black on white is 21:1', () => {
    expect(Math.round(contrastRatio('#000', '#fff'))).toBe(21)
  })
  it('luminance bounds', () => {
    expect(relativeLuminance('#000')).toBeCloseTo(0, 5)
    expect(relativeLuminance('#fff')).toBeCloseTo(1, 5)
  })
  it('aA thresholds', () => {
    expect(meetsContrast(4.5)).toBe(true)
    expect(meetsContrast(4.49)).toBe(false)
    expect(checkContrast('#525252', '#fff').AA).toBe(true)
  })
})

describe('path', () => {
  it('module names', () => {
    expect(getModuleNameFromPath('/x/node_modules/@scope/name/dist/i.js')).toBe('@scope/name')
    expect(getModuleNameFromPath('/x/node_modules/foo/index.js')).toBe('foo')
    expect(getModuleNameFromPath('/x/src/a.ts')).toBeUndefined()
  })
  it('pnpm decoding', () => {
    expect(getPnpmPackageInfoFromPath('/x/node_modules/.pnpm/foo@1.2.3/node_modules/foo/i.js'))
      .toEqual({ name: 'foo', version: '1.2.3' })
    expect(parsePnpmSegment('@scope+name@1.2.3_react@18'))
      .toEqual({ name: '@scope/name', version: '1.2.3' })
  })
  it('isPackageName', () => {
    expect(isPackageName('foo')).toBe(true)
    expect(isPackageName('@scope/name')).toBe(true)
    expect(isPackageName('./foo')).toBe(false)
    expect(isPackageName('/abs/path')).toBe(false)
  })
  it('relativeModulePath', () => {
    expect(relativeModulePath('/root/src/a.ts', '/root')).toBe('./src/a.ts')
  })
})

describe('semver', () => {
  it('compareSemver', () => {
    expect(compareSemver('1.2.3', '1.2.4')).toBe(-1)
    expect(compareSemver('2.0.0', '1.9.9')).toBe(1)
    expect(compareSemver('1.0.0', '1.0.0-beta')).toBe(1)
    expect(compareSemver('1.0.0', '1.0.0')).toBe(0)
  })
  it('parseSemverRange', () => {
    const r = parseSemverRange('^1.2.0 || ^2.0.0')
    expect(r.valid).toBe(true)
    expect(r.lowest).toBe('1.2.0')
    expect(r.highest).toBe('2.0.0')
    expect(r.parts).toHaveLength(2)
  })
  it('compareSemverRange', () => {
    expect(compareSemverRange('^2.0.0', '^1.0.0')).toBeLessThan(0)
  })
})

describe('tree', () => {
  it('builds + flattens single-child chains', () => {
    const tree = toTree(
      [{ p: 'a/b/c' }, { p: 'a/b/d' }],
      i => i.p,
    )
    expect(tree).toHaveLength(1)
    expect(tree[0]!.name).toBe('a/b')
    expect(tree[0]!.children.map(c => c.name).sort()).toEqual(['c', 'd'])
  })
})

describe('keybinding', () => {
  it('parses chords', () => {
    const chord = parseChord('mod+shift+k')
    expect(chord.key).toBe('k')
    expect(chord.modifiers).toContain('shift')
    expect(chord.modifiers).toContain(chord.modifiers.includes('meta') ? 'meta' : 'ctrl')
  })
  it('chordToken stable order', () => {
    expect(chordToken(parseChord('shift+ctrl+a'))).toBe('ctrl+shift+a')
  })
  it('binding sequence', () => {
    expect(parseBinding('g g')).toHaveLength(2)
    expect(bindingDisplay('ctrl+k').length).toBeGreaterThan(0)
  })
})

describe('misc', () => {
  it('helpers', () => {
    expect(clamp(5, 0, 3)).toBe(3)
    expect(toArray(1)).toEqual([1])
    expect(toArray([1, 2])).toEqual([1, 2])
    expect(toArray(null)).toEqual([])
    expect(isNumeric('42')).toBe(true)
    expect(isNumeric('x')).toBe(false)
    expect(nth(1)).toBe('1st')
    expect(nth(22)).toBe('22nd')
    expect(pluralize(1, 'item')).toBe('item')
    expect(pluralize(2, 'item')).toBe('items')
    expect(stringifyUnquoted({ 'foo': 1, 'a-b': 2 })).toContain('foo:')
  })
})
