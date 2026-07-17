<!-- @description an on/off switch bound with `v-model`. -->
<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

defineProps<{
  label?: string
  disabled?: boolean
}>()

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label
    class="text-sm inline-flex gap-2 cursor-pointer select-none items-center"
    :class="{ 'op50 pointer-events-none': disabled }"
  >
    <SwitchRoot
      v-model="model"
      :disabled="disabled"
      class="outline-none rounded-full bg-active h-5 w-9 transition relative data-[state=checked]:bg-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/40"
    >
      <SwitchThumb class="rounded-full bg-white h-4 w-4 block shadow translate-x-0.5 transition-transform data-[state=checked]:translate-x-4" />
    </SwitchRoot>
    <span v-if="label || $slots.default"><slot>{{ label }}</slot></span>
  </label>
</template>
