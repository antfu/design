<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Image source. When absent or failed, the `#fallback` slot is shown instead. */
    src?: string
    /** Alternative text, forwarded to the `<img>`. */
    alt?: string
  }>(),
  {},
)

const errored = ref(false)

watch(() => props.src, () => {
  errored.value = false
})
</script>

<template>
  <img
    v-if="src && !errored"
    :src="src"
    :alt="alt"
    class="h-full w-full block object-cover"
    @error="errored = true"
  >
  <slot v-else name="fallback" />
</template>
