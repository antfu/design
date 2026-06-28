<script setup lang="ts">
import { computed } from 'vue'
import { useColorScheme } from '../../composables/colorScheme'
import { getHashColorFromString, getHsla } from '../../utils/color'

const props = withDefaults(
  defineProps<{
    /** Text content (also the hash seed when `color` is `true`). */
    text?: string
    /**
     * - `true` (default): deterministic color hashed from `text`
     * - `false`: neutral / muted
     * - `number`: explicit hue (0–360)
     * - `'#...'` / `'hsl(...)'` / `'rgb(...)'`: explicit CSS color
     * - any other string: a palette name → `badge-color-<name>`
     */
    color?: boolean | number | string
    /** `subtle` = tinted background, `solid` = filled. */
    variant?: 'subtle' | 'solid'
    size?: 'sm' | 'md'
    /** Leading icon class (e.g. `i-ph:seal-check`). */
    icon?: string
    /** Render as another element/component. */
    as?: string
    /**
     * The app's current color scheme — tunes hash colors for contrast. Falls
     * back to {@link provideColorScheme} context, then `'light'`.
     */
    colorScheme?: 'light' | 'dark'
  }>(),
  {
    color: true,
    variant: 'subtle',
    size: 'md',
  },
)

function isCssColor(value: string): boolean {
  return /^#|^hsl|^rgb|^var\(/.test(value)
}

const scheme = useColorScheme(() => props.colorScheme)
const dark = computed(() => scheme.value === 'dark')

const seedColor = computed<string | undefined>(() => {
  const { color, text } = props
  if (typeof color === 'number')
    return getHsla(color, 1, dark.value)
  if (typeof color === 'string' && isCssColor(color))
    return color
  if (color === true && text)
    return getHashColorFromString(text, 1, dark.value)
  return undefined
})

const seedBg = computed<string | undefined>(() => {
  const { color, text } = props
  if (typeof color === 'number')
    return getHsla(color, props.variant === 'solid' ? 1 : 0.12, dark.value)
  if (typeof color === 'string' && isCssColor(color))
    return color
  if (color === true && text)
    return getHashColorFromString(text, props.variant === 'solid' ? 1 : 0.12, dark.value)
  return undefined
})

const style = computed(() => {
  if (!seedColor.value)
    return undefined
  return props.variant === 'solid'
    ? { color: '#fff', background: seedBg.value }
    : { color: seedColor.value, background: seedBg.value }
})

const paletteClass = computed(() =>
  typeof props.color === 'string' && !isCssColor(props.color)
    ? `badge-color-${props.color}`
    : props.color === false
      ? 'badge-muted'
      : '',
)

const sizeClass = computed(() =>
  props.size === 'sm' ? 'text-micro px-1.5 py-0.25' : 'text-xs px-2 py-0.5',
)
</script>

<template>
  <component
    :is="as || 'span'"
    class="badge"
    :class="[sizeClass, paletteClass]"
    :style="style"
  >
    <span v-if="icon" :class="icon" aria-hidden="true" />
    <slot>{{ text }}</slot>
  </component>
</template>
