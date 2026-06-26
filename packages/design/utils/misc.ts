/**
 * Small design-system-specific helpers. Generic helpers (`clamp`, `toArray`, …)
 * come from `@antfu/utils` — re-exported from `./index` rather than reimplemented
 * here — so we ship only what's specific to this library.
 */

/**
 * Whether a value represents a finite number.
 *
 * Finite numbers pass; numeric strings (after trimming, non-empty) pass; `NaN`,
 * `Infinity`, empty/blank strings, and non-string/non-number values fail.
 *
 * @param value - The value to test.
 * @returns `true` if `value` is a finite number or a numeric string.
 *
 * @example
 * isNumeric('42') // → true
 * isNumeric('x') // → false
 */
export function isNumeric(value: unknown): boolean {
  if (typeof value === 'number')
    return Number.isFinite(value)
  if (typeof value !== 'string' || value.trim() === '')
    return false
  return !Number.isNaN(Number(value))
}

/**
 * Format a number with its English ordinal suffix.
 *
 * Handles the 11–13 special cases (which take `th`) correctly.
 *
 * @param n - The number to format.
 * @returns The number followed by its ordinal suffix, e.g. `'1st'`.
 *
 * @example
 * nth(1) // → '1st'
 * nth(22) // → '22nd'
 * nth(23) // → '23rd'
 */
export function nth(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`
}

/**
 * Pick the singular or plural form based on a count.
 *
 * Returns `singular` only when `count` is exactly `1`; any other count (including
 * `0`) uses the plural form.
 *
 * @param count - The count that decides the form.
 * @param singular - The singular word.
 * @param plural - The plural word. Defaults to `singular` + `'s'`.
 * @returns The appropriate word for the count.
 *
 * @example
 * pluralize(1, 'item') // → 'item'
 * pluralize(2, 'item') // → 'items'
 */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural
}

/**
 * Parse JSON without throwing, falling back on error.
 *
 * Returns the parsed value on success; on a parse error returns `fallback`
 * (which is `undefined` when omitted).
 *
 * @param input - The JSON string to parse.
 * @param fallback - Value to return if parsing fails. Defaults to `undefined`.
 * @returns The parsed value, or `fallback` when parsing throws.
 *
 * @example
 * safeJsonParse('{"a":1}') // → { a: 1 }
 * safeJsonParse('oops', null) // → null
 */
export function safeJsonParse<T = unknown>(input: string, fallback?: T): T | undefined {
  try {
    return JSON.parse(input) as T
  }
  catch {
    return fallback
  }
}

/**
 * Stringify a value as JSON but with unquoted keys where valid — for compact
 * config display (`{ foo: 1, "a-b": 2 }`).
 *
 * Runs `JSON.stringify` then removes quotes from object keys that are valid
 * bare JS identifiers; keys needing quotes (e.g. those with hyphens) are left
 * quoted.
 *
 * @param value - The value to stringify.
 * @param indent - Indentation passed to `JSON.stringify`. Defaults to `2`.
 * @returns A JSON-like string with identifier keys unquoted.
 *
 * @example
 * stringifyUnquoted({ foo: 1, 'a-b': 2 })
 * // → '{\n  foo: 1,\n  "a-b": 2\n}' (contains `foo:`, keeps `"a-b"` quoted)
 */
export function stringifyUnquoted(value: unknown, indent = 2): string {
  const json = JSON.stringify(value, null, indent)
  return json.replace(/^(\s*)"([A-Z_$][\w$]*)":/gim, '$1$2:')
}

/**
 * Memoize a single-argument function. The optional `getKey` derives a cache key
 * (default identity), so reference-stable args dedupe correctly.
 *
 * Results are cached in a `Map` keyed by `getKey(arg)`; a cached result is
 * returned on subsequent calls without re-invoking `fn`. The cache lives for the
 * lifetime of the returned function and is never evicted.
 *
 * @param fn - The single-argument function to memoize.
 * @param getKey - Derives the cache key from the argument. Defaults to identity (`a => a`).
 * @returns A memoized wrapper with the same signature as `fn`.
 *
 * @example
 * let calls = 0
 * const double = makeCachedFunction((x: number) => { calls++; return x * 2 })
 * double(2) // → 4 (calls === 1)
 * double(2) // → 4 (cached; calls still 1)
 */
export function makeCachedFunction<A, R>(
  fn: (arg: A) => R,
  getKey: (arg: A) => unknown = a => a,
): (arg: A) => R {
  const cache = new Map<unknown, R>()
  return (arg: A): R => {
    const key = getKey(arg)
    if (cache.has(key))
      return cache.get(key)!
    const result = fn(arg)
    cache.set(key, result)
    return result
  }
}
