<!-- @description a custom-scrollbar scroll container. -->
<script setup lang="ts">
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui'

withDefaults(
  defineProps<{
    orientation?: 'vertical' | 'horizontal' | 'both'
    /** Scrollbar visibility behaviour. */
    type?: 'auto' | 'always' | 'scroll' | 'hover'
  }>(),
  { orientation: 'vertical', type: 'hover' },
)
</script>

<template>
  <ScrollAreaRoot :type="type" class="h-full w-full overflow-hidden">
    <ScrollAreaViewport class="h-full w-full">
      <slot />
    </ScrollAreaViewport>
    <ScrollAreaScrollbar
      v-if="orientation !== 'horizontal'"
      orientation="vertical"
      class="p-0.5 flex w-2 select-none transition-colors touch-none data-[state=visible]:bg-#8881"
    >
      <ScrollAreaThumb class="rounded-full bg-#8885 flex-1 relative hover:bg-#8888" />
    </ScrollAreaScrollbar>
    <ScrollAreaScrollbar
      v-if="orientation !== 'vertical'"
      orientation="horizontal"
      class="p-0.5 flex flex-col h-2 select-none transition-colors touch-none data-[state=visible]:bg-#8881"
    >
      <ScrollAreaThumb class="rounded-full bg-#8885 flex-1 relative hover:bg-#8888" />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
