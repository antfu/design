<script setup lang="ts">
import type { SplitpanesResizedPayload } from 'splitpanes'
import { useLocalStorage } from '@vueuse/core'
import { Splitpanes } from 'splitpanes'
import { ref } from 'vue'
// Base layout + theming ship together in `@antfu/design/styles/splitpanes.css`.

const props = withDefaults(
  defineProps<{
    horizontal?: boolean
    /** Persist pane sizes under this localStorage key (via VueUse). */
    storageKey?: string
  }>(),
  {},
)

const sizes = props.storageKey
  ? useLocalStorage<number[]>(props.storageKey, [])
  : ref<number[]>([])

function onResized(payload: SplitpanesResizedPayload): void {
  sizes.value = payload.panes.map(p => p.size)
}
</script>

<template>
  <Splitpanes :horizontal="horizontal" @resized="onResized">
    <slot :sizes="sizes" />
  </Splitpanes>
</template>
