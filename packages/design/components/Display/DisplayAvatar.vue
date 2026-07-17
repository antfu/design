<!-- @description an image avatar that falls back to hash-colored initials from `name` when `src` is absent/fails. -->
<script setup lang="ts">
import { computed } from 'vue'
import { useColorScheme } from '../../composables/colorScheme'
import { getHashColorFromString } from '../../utils/color'
import DisplaySafeImage from './DisplaySafeImage.vue'

const props = withDefaults(
  defineProps<{
    /** Image source. Falls back to initials when absent or failed. */
    src?: string
    /** Name driving the initials and the hash-tinted fallback color. */
    name?: string
    /** Size in pixels (width and height). */
    size?: number
    /** Use rounded-corner square instead of a circle. */
    square?: boolean
    /**
     * The app's current color scheme — tunes the fallback hash color for
     * contrast. Falls back to {@link provideColorScheme} context, then `'light'`.
     */
    colorScheme?: 'light' | 'dark'
  }>(),
  { size: 32 },
)

const scheme = useColorScheme(() => props.colorScheme)
const dark = computed(() => scheme.value === 'dark')

const initials = computed(() =>
  (props.name ?? '')
    .split(/[\s/-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]!.toUpperCase())
    .join(''),
)

const fallbackStyle = computed(() => ({
  background: getHashColorFromString(props.name ?? '', 0.18, dark.value),
  color: getHashColorFromString(props.name ?? '', 1, dark.value),
}))
</script>

<template>
  <span
    class="text-xs font-medium inline-flex shrink-0 select-none items-center justify-center overflow-hidden"
    :class="square ? 'rounded-md' : 'rounded-full'"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <DisplaySafeImage :src="src" :alt="name">
      <template #fallback>
        <span class="inline-flex h-full w-full items-center justify-center" :style="fallbackStyle">
          {{ initials }}
        </span>
      </template>
    </DisplaySafeImage>
  </span>
</template>
