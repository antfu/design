<script setup lang="ts" generic="T extends string | number">
import { DropdownMenuRadioGroup } from 'reka-ui'

/** The selected value — use with `v-model`. */
const model = defineModel<T>()
</script>

<template>
  <DropdownMenuRadioGroup :model-value="model" @update:model-value="model = $event as T">
    <slot />
  </DropdownMenuRadioGroup>
</template>
