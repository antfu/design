<script setup lang="ts" generic="T">
import type { TreeNode } from '../../utils/tree'
import { computed, ref } from 'vue'
import { getFileIcon, getFolderIcon } from '../../utils/icon'
import { toTree } from '../../utils/tree'

defineOptions({ name: 'DisplayTree' })

const props = withDefaults(
  defineProps<{
    /** Flat list of items to nest into a tree (top-level usage). */
    items?: T[]
    /** Maps an item to its `separator`-delimited path. */
    getPath?: (item: T) => string
    /** Pre-built nodes (used internally for recursion; pass `items`+`getPath` instead). */
    nodes?: TreeNode<T>[]
    /** Segment separator passed to `toTree`. Defaults to `/`. */
    separator?: string
    /** Collapse single-child chains into one node. */
    flatten?: boolean
    /** Whether branches start expanded. */
    defaultExpanded?: boolean
    /** Show a `getFileIcon` glyph on leaf nodes. */
    fileIcons?: boolean
  }>(),
  { flatten: true, defaultExpanded: true, fileIcons: false },
)

defineSlots<{
  /** Fully customize any node's label. */
  default?: (props: { node: TreeNode<T> }) => any
  /** Customize a leaf node's label (falls back to `default`, then `node.name`). */
  leaf?: (props: { node: TreeNode<T> }) => any
}>()

const tree = computed<TreeNode<T>[]>(() =>
  props.nodes
  ?? (props.items && props.getPath
    ? toTree(props.items, props.getPath, { separator: props.separator, flatten: props.flatten })
    : []),
)

// Per-node expansion state, defaulting to `defaultExpanded`.
const openState = ref<Record<string, boolean>>({})
function isOpen(path: string): boolean {
  return openState.value[path] ?? props.defaultExpanded
}
function toggle(path: string): void {
  openState.value[path] = !isOpen(path)
}
</script>

<template>
  <ul class="text-sm">
    <li v-for="node in tree" :key="node.path">
      <button
        v-if="node.children.length"
        type="button"
        class="px-1 py-0.5 text-left outline-none rounded flex gap-1 w-full transition items-center hover:bg-active focus-visible:ring-2 focus-visible:ring-primary-500/40"
        :aria-expanded="isOpen(node.path)"
        @click="toggle(node.path)"
      >
        <span
          class="i-ph:caret-right op-fade shrink-0 transition-transform"
          :class="{ 'rotate-90': isOpen(node.path) }"
          aria-hidden="true"
        />
        <span v-if="fileIcons" :class="getFolderIcon(node.name.split('/').pop(), isOpen(node.path))" class="op-fade shrink-0" aria-hidden="true" />
        <span class="truncate"><slot :node="node">{{ node.name }}</slot></span>
      </button>

      <div v-else class="px-1 py-0.5 pl-5 rounded flex gap-1 items-center hover:bg-active">
        <span v-if="fileIcons" :class="getFileIcon(node.path)" class="op-fade shrink-0" aria-hidden="true" />
        <span class="truncate">
          <slot name="leaf" :node="node">
            <slot :node="node">{{ node.name }}</slot>
          </slot>
        </span>
      </div>

      <DisplayTree
        v-if="node.children.length && isOpen(node.path)"
        :nodes="node.children"
        :separator="separator"
        :flatten="flatten"
        :default-expanded="defaultExpanded"
        :file-icons="fileIcons"
        class="ml-1.5 pl-4 border-l border-base"
      >
        <template v-if="$slots.default" #default="{ node: n }">
          <slot :node="n" />
        </template>
        <template v-if="$slots.leaf" #leaf="{ node: n }">
          <slot name="leaf" :node="n" />
        </template>
      </DisplayTree>
    </li>
  </ul>
</template>
