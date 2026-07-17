<!-- @description truncates, dims directories, decodes `.pnpm`, icon, link. -->
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
    /** Trailing line number (rendered `:line`). */
    line?: number
    /** Trailing column number (rendered `:line:col`, needs `line`). */
    column?: number
    /** Dim the directory portion of the path. */
    dim?: boolean
    /** Style as interactive (cursor + hover) for `@click` usage even without `href`. */
    clickable?: boolean
    /** Prefix substituted for a `.pnpm` store chunk (passed to the path parser). */
    pnpmCollapse?: string
  }>(),
  { root: '', icon: true, dim: true },
)

const parsed = computed(() => parseReadablePath(props.path, props.root, { pnpmCollapse: props.pnpmCollapse }))

/** Split the display path into directory / base / query(+hash) for distinct styling. */
const segments = computed(() => {
  const full = parsed.value.path
  const q = full.search(/[?#]/)
  const clean = q === -1 ? full : full.slice(0, q)
  const query = q === -1 ? '' : full.slice(q)
  const idx = clean.lastIndexOf('/')
  const dir = idx === -1 ? '' : clean.slice(0, idx + 1)
  const base = idx === -1 ? clean : clean.slice(idx + 1)
  return { dir, base, query }
})

const interactive = computed(() => props.href != null || props.clickable)
</script>

<template>
  <component
    :is="href ? 'a' : 'span'"
    v-tooltip="path"
    :href="href"
    class="text-sm font-mono inline-flex gap-1 max-w-full min-w-0 items-center"
    :class="{ 'hover:color-active transition': interactive, 'cursor-pointer': clickable && !href }"
  >
    <span v-if="icon" :class="getFileIcon(segments.base)" class="op-fade shrink-0" aria-hidden="true" />
    <span class="truncate">
      <span v-if="segments.dir" :class="dim ? 'op-mute' : 'color-base'">{{ segments.dir }}</span><span class="color-base">{{ segments.base }}</span><span v-if="segments.query" class="op-mute italic">{{ segments.query }}</span><span v-if="line != null" class="op-mute">:{{ line }}<template v-if="column != null">:{{ column }}</template></span>
    </span>
    <span v-if="parsed.moduleName" class="text-xs op-mute shrink-0">({{ parsed.moduleName }})</span>
  </component>
</template>
