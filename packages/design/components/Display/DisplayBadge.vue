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

const seedBorder = computed<string | undefined>(() => {
  const { color, text } = props
  if (typeof color === 'number')
    return getHsla(color, 0.2, dark.value)
  if (typeof color === 'string' && isCssColor(color))
    return color
  if (color === true && text)
    return getHashColorFromString(text, 0.2, dark.value)
  return undefined
})

const isPaletteColor = computed(() =>
  typeof props.color === 'string' && !isCssColor(props.color),
)

// Padding scales off whatever `font-size` is in effect on the badge itself —
// inherited from context by default, or set directly (e.g. a `text-sm`
// class) to resize the badge. No `size` prop: the font size *is* the size.
const style = computed(() => {
  const base = { padding: '0.25em 0.5em' }
  if (!seedColor.value)
    return base
  return props.variant === 'solid'
    ? { ...base, color: '#fff', background: seedBg.value, border: `1px solid ${seedBg.value}` }
    : !isPaletteColor.value
        ? { ...base, color: seedColor.value, background: seedBg.value, border: `1px solid ${seedBorder.value}` }
        : { ...base, color: seedColor.value, background: seedBg.value }
})

const paletteClass = computed(() =>
  isPaletteColor.value
    ? `badge-color-${props.color}`
    : props.color === false
      ? 'bg-#8881 color-muted'
      : '',
)
</script>

<template>
  <component
    :is="as || 'span'"
    class="leading-none font-medium rounded-md inline-flex gap-1 items-center"
    :class="paletteClass"
    :style="style"
  >
    <span v-if="icon" :class="icon" aria-hidden="true" />
    <slot>{{ text }}</slot>
  </component>
</template>
