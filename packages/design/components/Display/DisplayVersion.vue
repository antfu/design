<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    version: string
    /** Render with a leading `v`. */
    prefix?: boolean
  }>(),
  { prefix: true },
)

const display = computed(() => {
  const v = props.version.replace(/^v/i, '')
  return props.prefix ? `v${v}` : v
})
</script>

<template>
  <span class="font-mono tabular-nums">{{ display }}</span>
</template>
