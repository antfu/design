<!-- @description `vX.Y.Z` prefix logic; passes specs/ranges (`workspace:*`, `^1.2`) through untouched. -->
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    version: string
    /**
     * Leading prefix for a bare version. `true` → `v`, `false` → none, or a
     * custom string (e.g. `'@'` for `@1.2`). Non-bare specs (`npm:`/`workspace:`
     * /`catalog:`, ranges like `^1.2`) are always passed through verbatim.
     */
    prefix?: boolean | string
  }>(),
  { prefix: true },
)

// A "bare" version is a plain dotted release (optionally `v`-prefixed). Specs
// (`workspace:*`, `npm:pkg@1`, `catalog:`, `link:`/`file:`) and ranges
// (`^`, `~`, `>=`, `||`, `*`) carry meaning, so prefixing them mangles them.
const isBare = computed(() => /^v?\d[\w.+-]*$/i.test(props.version.trim()))

const display = computed(() => {
  if (!isBare.value)
    return props.version
  const v = props.version.replace(/^v/i, '')
  const lead = props.prefix === true ? 'v' : props.prefix === false ? '' : props.prefix
  return `${lead}${v}`
})
</script>

<template>
  <span class="font-mono tabular-nums">{{ display }}</span>
</template>
