/**
 * Lightweight, dependency-free semver helpers. Enough to parse, normalize and
 * compare versions and `||`-joined ranges for display — unifying the version
 * parsing duplicated across the source projects without pulling in `semver`.
 */

export interface ParsedSemver {
  valid: boolean
  raw: string
  highest?: string
  lowest?: string
  parts?: string[]
  bare?: string[]
}

const SEMVER_RE = /^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:-([\w.-]+))?/

function parseVersion(version: string): [number, number, number, string] | null {
  const m = version.trim().match(SEMVER_RE)
  if (!m)
    return null
  return [Number(m[1] ?? 0), Number(m[2] ?? 0), Number(m[3] ?? 0), m[4] ?? '']
}

/**
 * Compare two versions: `-1` / `0` / `1`. A release outranks its prerelease.
 *
 * Compares major/minor/patch numerically, then breaks ties so that a version
 * without a prerelease tag sorts above one with (e.g. `1.0.0` > `1.0.0-beta`).
 * Unparseable inputs compare as equal (`0`). Suitable as an `Array#sort`
 * comparator.
 *
 * @param a - The first version string (a leading `v` is allowed).
 * @param b - The second version string (a leading `v` is allowed).
 * @returns `-1` if `a < b`, `1` if `a > b`, `0` if equal.
 *
 * @example
 * compareSemver('1.2.3', '1.2.4') // → -1
 * compareSemver('2.0.0', '1.9.9') // → 1
 * compareSemver('1.0.0', '1.0.0-beta') // → 1
 * compareSemver('1.0.0', '1.0.0') // → 0
 */
export function compareSemver(a: string, b: string): number {
  if (a === b)
    return 0
  const pa = parseVersion(a)
  const pb = parseVersion(b)
  if (!pa || !pb)
    return 0
  const core = [[pa[0], pb[0]], [pa[1], pb[1]], [pa[2], pb[2]]] as const
  for (const [x, y] of core) {
    if (x !== y)
      return x < y ? -1 : 1
  }
  // Equal core: a version without prerelease is greater than one with.
  if (pa[3] === pb[3])
    return 0
  if (!pa[3])
    return 1
  if (!pb[3])
    return -1
  return pa[3] < pb[3] ? -1 : 1
}

const rangeCache = new Map<string, ParsedSemver>()

/**
 * Parse a (possibly `||`-joined) range into a normalized, sorted summary.
 *
 * Splits on `||`, strips range operators and `.x`/`.*` wildcards, pads each part
 * to a full `x.y.z`, sorts the results, and reports the `lowest`/`highest`
 * bounds. Results are memoized by input string. A range with no parseable parts
 * yields `{ valid: false }`.
 *
 * @param range - The version range string to parse.
 * @returns A {@link ParsedSemver} summary; `valid` is `false` when nothing parses.
 *
 * @example
 * const r = parseSemverRange('^1.2.0 || ^2.0.0')
 * r.valid // → true
 * r.lowest // → '1.2.0'
 * r.highest // → '2.0.0'
 * r.parts // → ['^1.2.0', '^2.0.0'] (length 2)
 */
export function parseSemverRange(range: string): ParsedSemver {
  const cached = rangeCache.get(range)
  if (cached)
    return cached

  const result: ParsedSemver = { valid: false, raw: range }
  rangeCache.set(range, result)

  const parts = range
    .split(/\|\|/g)
    .map(i => i.replace(/\s+/g, ''))
    .filter(Boolean)

  if (!parts.length)
    return result

  const bare = parts
    .map(i => i.replace(/^[\^~>=<]+/, '').replace(/\.[*x]$/i, '').trim())
    .map((i) => {
      const seg = i.split('.')
      if (seg.length === 1)
        return `${i}.0.0`
      if (seg.length === 2)
        return `${i}.0`
      return i
    })
    .filter(i => parseVersion(i) != null)
    .sort(compareSemver)

  if (!bare.length)
    return result

  result.valid = true
  result.parts = parts
  result.bare = bare
  result.lowest = bare[0]
  result.highest = bare[bare.length - 1]
  return result
}

/**
 * Compare two ranges by their lowest bound, then by breadth.
 *
 * Orders so that ranges with a higher lower bound sort first (descending);
 * ties are broken by the number of `||`-joined parts. Useful for sorting
 * dependency ranges newest-first.
 *
 * @param a - The first range string. Defaults to `'*'`.
 * @param b - The second range string. Defaults to `'*'`.
 * @returns A negative number if `a` sorts before `b`, positive if after, `0` if equal.
 *
 * @example
 * compareSemverRange('^2.0.0', '^1.0.0') // → -1 (less than 0; the higher range sorts first)
 */
export function compareSemverRange(a = '*', b = '*'): number {
  if (a === b)
    return 0
  const pa = parseSemverRange(a)
  const pb = parseSemverRange(b)
  const cmp = compareSemver(pb.lowest || '0.0.0', pa.lowest || '0.0.0')
  if (cmp !== 0)
    return cmp
  return (pb.parts?.length || 0) - (pa.parts?.length || 0)
}
