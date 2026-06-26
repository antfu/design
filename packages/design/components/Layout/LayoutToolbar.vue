<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Stick to the top of the scroll container with `z-nav`. */
    sticky?: boolean
    /** Translucent `bg-glass` surface; set `false` for an opaque `bg-base`. */
    glass?: boolean
  }>(),
  { sticky: true, glass: true },
)
</script>

<template>
  <div
    class="px-3 py-2 border-b border-base flex gap-3 items-center"
    :class="[sticky ? 'sticky top-0 z-nav' : '', glass ? 'bg-glass' : 'bg-base']"
  >
    <slot name="start">
      <slot />
    </slot>
    <div v-if="$slots.search" class="flex-1 min-w-0">
      <slot name="search" />
    </div>
    <div v-if="$slots.end" class="flex gap-1 items-center">
      <slot name="end" />
    </div>
  </div>
</template>
