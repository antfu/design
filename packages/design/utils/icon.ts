/**
 * Map a file path / module id to an icon class. The rule list is configurable
 * — the default targets `@iconify-json/catppuccin`, but a caller can pass a
 * vscode-icons / octicon map instead. Backs the `FileIcon` component.
 */

export interface FileIconRule {
  match: RegExp
  name: string
  /** UnoCSS icon class, e.g. `i-catppuccin:typescript`. */
  icon: string
  description?: string
}

/**
 * Default file-icon rule list targeting `@iconify-json/catppuccin`.
 *
 * Each rule pairs a filename `RegExp` with a `name` and UnoCSS `icon` class; the
 * list is ordered so the first matching rule wins (e.g. `.d.ts` before `.ts`).
 * Pass a custom list to {@link getFileType}/{@link getFileIcon} to use a
 * different icon set.
 *
 * @example
 * defaultFileIconRules[0] // → { match: /\.vue$/, name: 'vue', icon: 'i-catppuccin:vue' }
 */
export const defaultFileIconRules: FileIconRule[] = [
  { match: /\.vue$/, name: 'vue', icon: 'i-catppuccin:vue' },
  { match: /\.tsx$/, name: 'tsx', icon: 'i-catppuccin:typescript-react' },
  { match: /\.jsx$/, name: 'jsx', icon: 'i-catppuccin:javascript-react' },
  { match: /\.d\.[cm]?ts$/, name: 'dts', icon: 'i-catppuccin:typescript-def' },
  { match: /\.[cm]?ts$/, name: 'ts', icon: 'i-catppuccin:typescript' },
  { match: /\.[cm]?js$/, name: 'js', icon: 'i-catppuccin:javascript' },
  { match: /\.json5?$/, name: 'json', icon: 'i-catppuccin:json' },
  { match: /\.ya?ml$/, name: 'yaml', icon: 'i-catppuccin:yaml' },
  { match: /\.toml$/, name: 'toml', icon: 'i-catppuccin:toml' },
  { match: /\.md$/, name: 'markdown', icon: 'i-catppuccin:markdown' },
  { match: /\.html?$/, name: 'html', icon: 'i-catppuccin:html' },
  { match: /\.(?:css|postcss)$/, name: 'css', icon: 'i-catppuccin:css' },
  { match: /\.s[ac]ss$/, name: 'sass', icon: 'i-catppuccin:sass' },
  { match: /\.svg$/, name: 'svg', icon: 'i-catppuccin:svg' },
  { match: /\.(?:png|jpe?g|gif|webp|avif|ico)$/, name: 'image', icon: 'i-catppuccin:image' },
  { match: /\.(?:woff2?|ttf|otf|eot)$/, name: 'font', icon: 'i-catppuccin:font' },
  { match: /\.wasm$/, name: 'wasm', icon: 'i-catppuccin:webassembly' },
  { match: /package\.json$/, name: 'npm', icon: 'i-catppuccin:npm' },
  { match: /\.(?:test|spec)\.[cm]?[jt]sx?$/, name: 'test', icon: 'i-catppuccin:typescript-test' },
]

const FALLBACK_ICON = 'i-catppuccin:file'

/**
 * Strip a trailing query and/or hash from a module id.
 *
 * Removes everything from the first `?` or `#` onward, so build-tool suffixes
 * like `?vue&type=script` or `?v=123` don't defeat extension matching.
 *
 * @param id - The module id to clean.
 * @returns The id with any query/hash removed.
 *
 * @example
 * stripModuleQuery('/src/App.vue?vue&type=script') // → '/src/App.vue'
 */
export function stripModuleQuery(id: string): string {
  return id.replace(/[?#].*$/, '')
}

/**
 * Resolve `{ name, icon }` for a path. Returns the fallback when nothing matches.
 *
 * Strips any query/hash, then returns the first matching rule's metadata; if no
 * rule matches, returns the generic file fallback (`i-catppuccin:file`).
 *
 * @param path - The file path or module id to classify.
 * @param rules - Rule list to match against. Defaults to {@link defaultFileIconRules}.
 * @returns The matched `{ name, icon, description? }`, or the file fallback.
 *
 * @example
 * getFileType('/src/App.vue') // → { name: 'vue', icon: 'i-catppuccin:vue' }
 * getFileType('/src/file.unknown') // → { name: 'file', icon: 'i-catppuccin:file' }
 */
export function getFileType(
  path: string,
  rules: FileIconRule[] = defaultFileIconRules,
): { name: string, icon: string, description?: string } {
  const clean = stripModuleQuery(path)
  for (const rule of rules) {
    if (rule.match.test(clean))
      return { name: rule.name, icon: rule.icon, description: rule.description }
  }
  return { name: 'file', icon: FALLBACK_ICON }
}

/**
 * Convenience: just the icon class for a path.
 *
 * Thin wrapper over {@link getFileType} that returns only the `icon` field.
 *
 * @param path - The file path or module id to classify.
 * @param rules - Rule list to match against. Defaults to {@link defaultFileIconRules}.
 * @returns The UnoCSS icon class, or the fallback `i-catppuccin:file`.
 *
 * @example
 * getFileIcon('/src/main.ts') // → 'i-catppuccin:typescript'
 */
export function getFileIcon(path: string, rules?: FileIconRule[]): string {
  return getFileType(path, rules).icon
}
