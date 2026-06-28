<script setup lang="ts">
import { computed } from 'vue'
import { useColorScheme } from '../../composables/colorScheme'
import { getHashColorFromString, getPluginColor, stripPluginPrefix } from '../../utils/color'

const props = withDefaults(
  defineProps<{
    name: string
    /** The app's current color scheme. Falls back to context, then `'light'`. */
    colorScheme?: 'light' | 'dark'
    /** Strip plugin prefixes (`vite-plugin-`, `unplugin-`, `vite:`, …) from the displayed name. */
    strip?: boolean
    /** Color the scope by ecosystem brand hue (vs a plain string hash). */
    brand?: boolean
    /** Extra brand hues merged over the defaults (see `getPluginColor`). */
    brandHues?: Record<string, number>
  }>(),
  { brand: true },
)

const scheme = useColorScheme(() => props.colorScheme)
const dark = computed(() => scheme.value === 'dark')

const display = computed(() => (props.strip ? stripPluginPrefix(props.name) : props.name))

const parts = computed(() => {
  const n = display.value
  if (n.startsWith('@')) {
    const slash = n.indexOf('/')
    if (slash !== -1)
      return { scope: n.slice(0, slash + 1), rest: n.slice(slash + 1) }
  }
  return { scope: '', rest: n }
})

const scopeColor = computed(() => {
  if (!parts.value.scope)
    return undefined
  return props.brand
    ? getPluginColor(props.name, 1, dark.value, props.brandHues)
    : getHashColorFromString(parts.value.scope, 1, dark.value)
})
</script>

<template>
  <span class="text-sm font-mono">
    <span v-if="parts.scope" :style="{ color: scopeColor }">{{ parts.scope }}</span><span class="color-base">{{ parts.rest }}</span>
  </span>
</template>
