/**
 * Build a nested tree from a flat list of `/`-delimited paths, with
 * single-child-chain flattening (so `a/b/c` with no siblings renders as one
 * node `a/b/c` rather than three). Generalized from the inspectors' file trees.
 */

export interface TreeNode<T> {
  /** The display name for this segment (may be a flattened chain like `a/b`). */
  name: string
  /** Full path up to and including this node. */
  path: string
  /** The original item, present on leaf nodes. */
  item?: T
  children: TreeNode<T>[]
}

export interface ToTreeOptions {
  /** Separator between path segments. Default `/`. */
  separator?: string
  /** Collapse chains of single-child nodes into one. Default `true`. */
  flatten?: boolean
}

function flattenChain<T>(node: TreeNode<T>, separator: string): void {
  while (node.children.length === 1 && node.item == null) {
    const child = node.children[0]
    if (child == null)
      break
    node.name = `${node.name}${separator}${child.name}`
    node.path = child.path
    node.item = child.item
    node.children = child.children
  }
  for (const child of node.children)
    flattenChain(child, separator)
}

/**
 * Convert a flat list into a nested tree keyed by `getPath(item)`.
 *
 * Each item's path is split on `separator` into segments that become nested
 * {@link TreeNode}s, with the original item attached to the leaf. When `flatten`
 * is enabled, chains of single-child intermediate nodes are merged into one node
 * whose `name` joins the segments (so `a/b/c` with no siblings becomes a single
 * `a/b/c` node).
 *
 * @param items - The flat list of items to nest.
 * @param getPath - Maps an item to its `separator`-delimited path string.
 * @param options - Tree-building options.
 * @param options.separator - Segment separator. Defaults to `'/'`.
 * @param options.flatten - Whether to collapse single-child chains. Defaults to `true`.
 * @returns The top-level {@link TreeNode}s of the built tree.
 *
 * @example
 * const tree = toTree([{ p: 'a/b/c' }, { p: 'a/b/d' }], i => i.p)
 * tree.length // → 1
 * tree[0].name // → 'a/b' (shared single-child chain flattened)
 * tree[0].children.map(c => c.name).sort() // → ['c', 'd']
 */
export function toTree<T>(
  items: T[],
  getPath: (item: T) => string,
  options: ToTreeOptions = {},
): TreeNode<T>[] {
  const { separator = '/', flatten = true } = options
  const root: TreeNode<T> = { name: '', path: '', children: [] }

  for (const item of items) {
    const segments = getPath(item).split(separator).filter(Boolean)
    let current = root
    let acc = ''
    segments.forEach((segment, i) => {
      acc = acc ? `${acc}${separator}${segment}` : segment
      let next = current.children.find(c => c.name === segment && c.item == null)
      if (!next) {
        next = { name: segment, path: acc, children: [] }
        current.children.push(next)
      }
      if (i === segments.length - 1)
        next.item = item
      current = next
    })
  }

  if (flatten) {
    for (const child of root.children)
      flattenChain(child, separator)
  }

  return root.children
}
