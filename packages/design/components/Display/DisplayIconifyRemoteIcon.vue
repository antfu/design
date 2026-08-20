<!-- @description renders an Iconify icon by name without a bundled icon set, fetching from the Iconify API. -->
<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { getIconifySvg } from '../../utils/iconify'

const props = withDefaults(
  defineProps<{
    /**
     * Either an Iconify `collection:icon` pair (e.g. `catppuccin:vue`, with an
     * optional `i-` prefix), fetched live from api.iconify.design — or a plain
     * image URL / `data:` / `builtin:` URI, rendered as an `<img>` instead.
     */
    icon: string
    /**
     * Any CSS length. Defaults to `1em`, so the icon tracks the surrounding
     * font size like a `i-ph:*` icon class does. Pass `100%` to fill a sized
     * parent instead.
     */
    size?: string
  }>(),
  { size: '1em' },
)

const isUrlIcon = computed(() => props.icon.includes('/') || props.icon.startsWith('data:') || props.icon.startsWith('builtin:'))
const iconifyParsed = computed(() => {
  if (isUrlIcon.value)
    return undefined
  const match = props.icon.match(/^(?:i-)?([\w-]+):([\w-]+)$/)
  if (!match)
    return undefined
  return {
    collection: match[1]!,
    icon: match[2]!,
  }
})

const iconifyLoaded = ref<string | undefined>(undefined)
watchEffect(async () => {
  if (!iconifyParsed.value) {
    iconifyLoaded.value = undefined
    return
  }
  try {
    iconifyLoaded.value = await getIconifySvg(iconifyParsed.value.collection, iconifyParsed.value.icon)
  }
  catch {
    // A failed icon fetch (offline / flaky CDN) should degrade to a blank icon,
    // not throw out of the async effect and crash the surrounding panel.
    iconifyLoaded.value = undefined
  }
})
</script>

<!--
  Both branches carry an explicit box. The fetched markup is requested at
  `width=100%` (see `utils/iconify`), so without one the `<svg>` resolves its
  percentage against a shrink-to-fit parent — circular, and it renders at the
  browser's default replaced-element size instead of as an icon. Inline styles
  rather than utilities so `size` always wins over whatever `class` a caller
  passes, with no source-order lottery.
-->
<template>
  <div
    v-if="iconifyParsed"
    class="shrink-0 inline-block [&>svg]:h-full [&>svg]:w-full"
    :style="{ width: size, height: size }"
    v-html="iconifyLoaded"
  />
  <img
    v-else :src="icon"
    class="shrink-0 inline-block object-contain"
    :style="{ width: size, height: size }"
    draggable="false"
  >
</template>
