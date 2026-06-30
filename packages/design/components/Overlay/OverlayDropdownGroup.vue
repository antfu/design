<script setup lang="ts">
import { DropdownMenuGroup, DropdownMenuLabel } from 'reka-ui'

defineProps<{
  /** Optional heading rendered above the grouped items. */
  label?: string
}>()
</script>

<template>
  <DropdownMenuGroup>
    <DropdownMenuLabel
      v-if="label"
      class="text-micro color-faint tracking-wide font-medium px-2 pb-1 pt-1.5 select-none uppercase"
    >
      {{ label }}
    </DropdownMenuLabel>
    <slot />
  </DropdownMenuGroup>
</template>
