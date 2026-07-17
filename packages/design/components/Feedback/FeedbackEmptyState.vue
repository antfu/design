<!-- @description an empty/zero-state placeholder — icon, title, description, `#action` slot. -->
<script setup lang="ts">
defineProps<{
  title?: string
  icon?: string
}>()
</script>

<template>
  <div class="px-6 py-10 text-center op-fade flex flex-col gap-2 items-center justify-center">
    <slot name="icon">
      <span v-if="icon" :class="icon" class="text-3xl op-mute" aria-hidden="true" />
    </slot>
    <div v-if="title || $slots.default" class="text-sm color-base font-medium">
      <slot>{{ title }}</slot>
    </div>
    <div v-if="$slots.hint" class="text-xs op-mute max-w-prose">
      <slot name="hint" />
    </div>
    <div v-if="$slots.actions" class="mt-2 flex gap-2 items-center">
      <slot name="actions" />
    </div>
  </div>
</template>
