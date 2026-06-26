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
  <span :class="type.icon" :title="type.name" aria-hidden="true" />
</template>
