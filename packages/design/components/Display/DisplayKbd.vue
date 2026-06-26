<script setup lang="ts">
import { computed } from 'vue'
import { bindingDisplay } from '../../utils/keybinding'

const props = defineProps<{
  /** A chord/binding string, e.g. `mod+k` or `g g`, rendered as platform glyphs. */
  keys?: string
}>()

const tokens = computed(() => (props.keys ? bindingDisplay(props.keys) : []))
</script>

<template>
  <span class="inline-flex gap-0.5 items-center">
    <template v-if="keys">
      <kbd
        v-for="(token, i) in tokens"
        :key="i"
        class="text-micro color-muted leading-none font-mono px-1 border border-base rounded bg-secondary inline-flex h-5 min-w-5 items-center justify-center"
      >{{ token }}</kbd>
    </template>
    <kbd
      v-else
      class="text-micro color-muted leading-none font-mono px-1.5 border border-base rounded bg-secondary inline-flex h-5 min-w-5 items-center justify-center"
    ><slot /></kbd>
  </span>
</template>
