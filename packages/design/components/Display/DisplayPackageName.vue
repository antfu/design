<script setup lang="ts">
import { computed } from 'vue'
import { getHashColorFromString } from '../../utils/color'

const props = withDefaults(
  defineProps<{
    name: string
    /** The app's current color scheme. */
    colorScheme?: 'light' | 'dark'
  }>(),
  { colorScheme: 'light' },
)

const parts = computed(() => {
  const n = props.name
  if (n.startsWith('@')) {
    const slash = n.indexOf('/')
    if (slash !== -1)
      return { scope: n.slice(0, slash + 1), rest: n.slice(slash + 1) }
  }
  return { scope: '', rest: n }
})

const scopeColor = computed(() =>
  parts.value.scope
    ? getHashColorFromString(parts.value.scope, 1, props.colorScheme === 'dark')
    : undefined,
)
</script>

<template>
  <span class="text-sm font-mono">
    <span v-if="parts.scope" :style="{ color: scopeColor }">{{ parts.scope }}</span><span class="color-base">{{ parts.rest }}</span>
  </span>
</template>
