<script setup lang="ts">
import { vTooltip } from 'floating-vue'
import { computed } from 'vue'
import { getFileIcon } from '../../utils/icon'
import { parseReadablePath } from '../../utils/path'

const props = withDefaults(
  defineProps<{
    path: string
    /** Project root, trimmed from the display path. */
    root?: string
    /** Show a leading file icon. */
    icon?: boolean
    /** Link target. */
    href?: string
  }>(),
  { root: '', icon: true },
)

const parsed = computed(() => parseReadablePath(props.path, props.root))

const segments = computed(() => {
  const p = parsed.value.path
  const idx = p.lastIndexOf('/')
  return idx === -1
    ? { dir: '', base: p }
    : { dir: p.slice(0, idx + 1), base: p.slice(idx + 1) }
})
</script>

<template>
  <component
    :is="href ? 'a' : 'span'"
    v-tooltip="path"
    :href="href"
    class="text-sm font-mono inline-flex gap-1 max-w-full min-w-0 items-center"
    :class="{ 'hover:color-active transition': href }"
  >
    <span v-if="icon" :class="getFileIcon(segments.base)" class="op-fade shrink-0" aria-hidden="true" />
    <span class="truncate">
      <span class="op-mute">{{ segments.dir }}</span><span class="color-base">{{ segments.base }}</span>
    </span>
    <span v-if="parsed.moduleName" class="text-xs op-mute shrink-0">({{ parsed.moduleName }})</span>
  </component>
</template>
