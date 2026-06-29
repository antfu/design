<script setup lang="ts">
import { Separator } from 'reka-ui'

withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    /** Optional centered label; only meaningful when horizontal. */
    label?: string
  }>(),
  { orientation: 'horizontal' },
)
</script>

<template>
  <div
    v-if="label || $slots.default"
    class="text-micro color-faint tracking-wide font-medium my-2 flex gap-2 select-none uppercase items-center"
  >
    <span class="border-t border-base flex-1" />
    <slot>{{ label }}</slot>
    <span class="border-t border-base flex-1" />
  </div>
  <Separator
    v-else
    :orientation="orientation"
    class="bg-#8882 shrink-0"
    :class="orientation === 'vertical' ? 'mx-2 w-px self-stretch' : 'my-2 h-px w-full'"
  />
</template>
