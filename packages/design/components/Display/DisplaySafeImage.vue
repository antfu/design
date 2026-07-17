<!-- @description an `<img>` that swaps to the `#fallback` slot on a missing/failed `src`, with an optional `preload` to avoid a flash. -->
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Image source. When absent or failed, the `#fallback` slot is shown instead. */
    src?: string
    /** Alternative text, forwarded to the `<img>`. */
    alt?: string
    /** `object-fit`. Unset by default so the caller's own classes win. */
    fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    /** Preload the image and keep the fallback until it loads. Off = render immediately. */
    preload?: boolean
  }>(),
  {},
)

const errored = ref(false)
const ready = ref(!props.preload)

watch(() => props.src, (src) => {
  errored.value = false
  if (!props.preload || !src) {
    ready.value = !props.preload
    return
  }
  ready.value = false
  const img = new Image()
  img.onload = () => (ready.value = true)
  img.onerror = () => (errored.value = true)
  img.src = src
}, { immediate: true })
</script>

<template>
  <img
    v-if="src && !errored && ready"
    :src="src"
    :alt="alt"
    class="block"
    :class="fit && `object-${fit}`"
    @error="errored = true"
  >
  <slot v-else name="fallback" />
</template>
