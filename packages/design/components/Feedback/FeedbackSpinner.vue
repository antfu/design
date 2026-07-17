<!-- @description a spinner glyph. -->
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Diameter; a number is treated as px. */
    size?: string | number
  }>(),
  { size: '1em' },
)

const dim = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>

<template>
  <span
    class="border-2 border-current border-t-transparent rounded-full inline-block animate-spin"
    :style="{ width: dim, height: dim }"
    role="status"
    aria-label="Loading"
  />
</template>
