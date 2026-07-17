<!-- @description a bordered content surface. -->
<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: string
    padding?: boolean
    /** Subtle drop shadow. */
    elevated?: boolean
  }>(),
  { padding: true },
)
</script>

<template>
  <component
    :is="as || 'div'"
    class="border border-base rounded-xl bg-base"
    :class="[{ 'p-4': padding }, { 'shadow-sm': elevated }]"
  >
    <slot />
  </component>
</template>
