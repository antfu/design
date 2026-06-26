/**
 * Module-id / file-path parsing. Generalized from the byte-for-byte duplicate
 * that lives in both nuxt-devtools and vite-devtools, including the `.pnpm`
 * decoding used to render readable package paths.
 */

/**
 * Normalize Windows backslashes to forward slashes.
 *
 * @param path - The file path or module id to normalize.
 * @returns The path with every `\` replaced by `/`.
 *
 * @example
 * normalizeModulePath('C:\\x\\y') // → 'C:/x/y'
 */
export function normalizeModulePath(path: string): string {
  return path.replace(/\\/g, '/')
}

/**
 * Whether a path passes through a `node_modules` directory.
 *
 * Normalizes separators first, so Windows paths are handled.
 *
 * @param path - The file path or module id to test.
 * @returns `true` if a `node_modules` segment is present.
 *
 * @example
 * isNodeModulePath('/x/node_modules/foo/index.js') // → true
 * isNodeModulePath('/x/src/a.ts') // → false
 */
export function isNodeModulePath(path: string): boolean {
  return /\bnode_modules\b/.test(normalizeModulePath(path))
}

/**
 * Whether an id looks like a bare package specifier (not a relative/absolute path).
 *
 * Rejects empty strings, ids starting with `.` or `/`, protocol-prefixed ids
 * (`foo:`), and Windows drive paths; otherwise requires a valid (optionally
 * scoped) npm package name shape.
 *
 * @param id - The module id to test.
 * @returns `true` if `id` is a bare package specifier.
 *
 * @example
 * isPackageName('foo') // → true
 * isPackageName('@scope/name') // → true
 * isPackageName('./foo') // → false
 * isPackageName('/abs/path') // → false
 */
export function isPackageName(id: string): boolean {
  if (!id || id.startsWith('.') || id.startsWith('/') || /^[a-z]+:/i.test(id) || /^[a-z]:[\\/]/i.test(id))
    return false
  return /^(?:@[\w.-]+\/)?[\w.-]+(?:\/[\w.-]+)*$/.test(id)
}

export interface PnpmPackageInfo {
  name: string
  version: string
}

/**
 * Decode a `.pnpm` directory segment like `foo@1.2.3`, `@scope+name@1.2.3` or
 * `foo@1.2.3_peer@4` into `{ name, version }`.
 *
 * Strips any `_peer@...` suffix, splits name from version at the last `@`, and
 * decodes pnpm's `@scope+name` scope encoding back to `@scope/name`. Returns
 * `undefined` when no version `@` is present.
 *
 * @param segment - The raw `.pnpm` segment to decode.
 * @returns A {@link PnpmPackageInfo}, or `undefined` if the segment has no version.
 *
 * @example
 * parsePnpmSegment('@scope+name@1.2.3_react@18') // → { name: '@scope/name', version: '1.2.3' }
 * parsePnpmSegment('foo@1.2.3') // → { name: 'foo', version: '1.2.3' }
 */
export function parsePnpmSegment(segment: string): PnpmPackageInfo | undefined {
  // Strip peer-dependency suffix (`_react@18...`).
  const base = segment.split('_')[0]
  const at = base.lastIndexOf('@')
  if (at <= 0)
    return undefined
  const rawName = base.slice(0, at)
  const version = base.slice(at + 1)
  // pnpm encodes scopes as `@scope+name` (sometimes without the leading `@`).
  let name = rawName
  if (rawName.includes('+')) {
    name = rawName.replace('+', '/')
    if (!name.startsWith('@'))
      name = `@${name}`
  }
  return { name, version }
}

/**
 * Extract `{ name, version }` from a path that traverses a `.pnpm` store.
 *
 * Finds the segment immediately after `.pnpm/` and decodes it via
 * {@link parsePnpmSegment}. Returns `undefined` when the path has no `.pnpm`
 * directory.
 *
 * @param path - The file path to inspect.
 * @returns A {@link PnpmPackageInfo}, or `undefined` if not a `.pnpm` path.
 *
 * @example
 * getPnpmPackageInfoFromPath('/x/node_modules/.pnpm/foo@1.2.3/node_modules/foo/i.js')
 * // → { name: 'foo', version: '1.2.3' }
 */
export function getPnpmPackageInfoFromPath(path: string): PnpmPackageInfo | undefined {
  const match = normalizeModulePath(path).match(/\.pnpm\/([^/]+)/)
  if (!match)
    return undefined
  return parsePnpmSegment(match[1])
}

/**
 * Get the package name from a `node_modules` path (`.../node_modules/@scope/name/dist/x` → `@scope/name`).
 *
 * Prefers a `.pnpm`-decoded name when present; otherwise reads the segment(s)
 * after the last `node_modules/`, keeping the `@scope/name` pair for scoped
 * packages. Returns `undefined` when the path is not inside `node_modules`.
 *
 * @param path - The file path to inspect.
 * @returns The package name, or `undefined` if none can be resolved.
 *
 * @example
 * getModuleNameFromPath('/x/node_modules/@scope/name/dist/i.js') // → '@scope/name'
 * getModuleNameFromPath('/x/node_modules/foo/index.js') // → 'foo'
 * getModuleNameFromPath('/x/src/a.ts') // → undefined
 */
export function getModuleNameFromPath(path: string): string | undefined {
  const normalized = normalizeModulePath(path)
  const pnpm = getPnpmPackageInfoFromPath(normalized)
  if (pnpm)
    return pnpm.name
  const idx = normalized.lastIndexOf('node_modules/')
  if (idx === -1)
    return undefined
  const rest = normalized.slice(idx + 'node_modules/'.length)
  const segments = rest.split('/')
  return segments[0].startsWith('@') ? `${segments[0]}/${segments[1]}` : segments[0]
}

/**
 * Collapse a `.pnpm/<pkg>@ver/node_modules/<pkg>` chunk to `~`, leaving the tail.
 *
 * Replaces everything up to and including the inner `node_modules/` of a `.pnpm`
 * store path with the `replacement` prefix, yielding a short, readable path.
 *
 * @param path - The file path to collapse.
 * @param replacement - The prefix to substitute for the store chunk. Defaults to `'~/'`.
 * @returns The path with the `.pnpm` store prefix replaced.
 *
 * @example
 * collapsePnpmPath('/x/node_modules/.pnpm/foo@1.2.3/node_modules/foo/index.js')
 * // → '~/foo/index.js'
 */
export function collapsePnpmPath(path: string, replacement = '~/'): string {
  return normalizeModulePath(path).replace(/.*\.pnpm\/[^/]+\/node_modules\//, replacement)
}

export interface RelativeModulePathOptions {
  /** Prefix substituted for a `.pnpm` store chunk. Defaults to `'~/'`. */
  pnpmCollapse?: string
  /** Beyond this many `../` levels, return the absolute path instead. Defaults to `3`. */
  maxUp?: number
}

/**
 * Make a module id readable relative to a project root: trims the root prefix,
 * decodes `.pnpm` to `~`, and keeps absolute past 3 levels of `../`.
 *
 * `.pnpm` paths are collapsed via {@link collapsePnpmPath}; if the id lives under
 * `root`, the root prefix is stripped and a `./` prefix added; otherwise a
 * `../`-relative path is synthesized, falling back to the absolute path once it
 * would need more than `maxUp` (default 3) `../` hops.
 *
 * @param id - The module id or file path to make relative.
 * @param root - The project root to make the path relative to.
 * @param options - See {@link RelativeModulePathOptions}.
 * @returns A readable, root-relative path.
 *
 * @example
 * relativeModulePath('/root/src/a.ts', '/root') // → './src/a.ts'
 * relativeModulePath('/root/pkg/b.ts', '/root/app') // → '../pkg/b.ts'
 */
export function relativeModulePath(id: string, root: string, options: RelativeModulePathOptions = {}): string {
  const { pnpmCollapse = '~/', maxUp = 3 } = options
  const path = normalizeModulePath(id)
  const normRoot = normalizeModulePath(root).replace(/\/$/, '')
  if (path.includes('.pnpm/'))
    return collapsePnpmPath(path, pnpmCollapse)
  if (!normRoot)
    return path
  if (path === normRoot)
    return '.'
  if (path.startsWith(`${normRoot}/`)) {
    const rest = path.slice(normRoot.length + 1)
    return rest.startsWith('.') ? rest : `./${rest}`
  }
  // Outside the root: synthesize `../`, but bail to absolute past `maxUp` hops.
  const rootParts = normRoot.split('/')
  const pathParts = path.split('/')
  let common = 0
  while (common < rootParts.length && common < pathParts.length && rootParts[common] === pathParts[common])
    common++
  const up = rootParts.length - common
  if (up > maxUp || common === 0)
    return path
  return `${'../'.repeat(up)}${pathParts.slice(common).join('/')}`
}

export interface ReadablePath {
  /** Display path. */
  path: string
  /** Resolved package name when the path lives in `node_modules`. */
  moduleName?: string
}

/**
 * Build a display path plus resolved package name for a module id.
 *
 * Combines {@link relativeModulePath} for the display path with
 * {@link getModuleNameFromPath} (only for `node_modules` paths) for the package
 * name.
 *
 * @param path - The module id or file path.
 * @param root - The project root used to relativize the display path.
 * @param options - Forwarded to {@link relativeModulePath}.
 * @returns A {@link ReadablePath} with `path` and, for dependencies, `moduleName`.
 *
 * @example
 * parseReadablePath('/x/node_modules/foo/index.js', '/x')
 * // → { path: './node_modules/foo/index.js', moduleName: 'foo' }
 */
export function parseReadablePath(path: string, root: string, options?: RelativeModulePathOptions): ReadablePath {
  const moduleName = isNodeModulePath(path) ? getModuleNameFromPath(path) : undefined
  return {
    path: relativeModulePath(path, root, options),
    moduleName,
  }
}
