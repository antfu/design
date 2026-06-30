<script setup lang="ts">
import type { FileIconRule } from '../../utils/icon'
import { computed } from 'vue'
import { getFileType, getFolderIcon } from '../../utils/icon'

const props = defineProps<{
  /** File path or module id (or folder name when `directory`). */
  path: string
  /** Override the default (catppuccin) file rule list — e.g. `vscodeFileIconRules`. */
  rules?: FileIconRule[]
  /** Render a folder icon instead of a file icon. */
  directory?: boolean
  /** For directories: show the open-folder glyph. */
  open?: boolean
  /** Named-folder lookup for directories. */
  folderRules?: Record<string, string>
  /**
   * Invert the icon's luminance (keeping hue) so a set designed for dark
   * backgrounds (e.g. catppuccin) stays legible on a light surface. The package
   * is stateless, so drive this from your own scheme: `:invert="scheme === 'light'"`.
   */
  invert?: boolean
}>()

const type = computed(() => {
  if (props.directory) {
    const name = props.path.replace(/\/+$/, '').split('/').pop() || 'folder'
    return { name, icon: getFolderIcon(name, props.open, props.folderRules) }
  }
  return getFileType(props.path, props.rules)
})
</script>

<template>
  <span
    :class="type.icon"
    :style="invert ? { filter: 'invert(1) hue-rotate(180deg)' } : undefined"
    :title="type.name"
    aria-hidden="true"
  />
</template>
