<!-- @description a vertical nav list from `items`, active-item highlighting via `v-model`. -->
<script setup lang="ts">
export interface NavItem {
  value: string
  label?: string
  /** Leading icon class (e.g. `i-catppuccin:folder`). */
  icon?: string
  /** Render the row as a link instead of a button. */
  href?: string
  /** Optional trailing count/label chip. */
  badge?: string | number
  disabled?: boolean
}

defineProps<{
  items: NavItem[]
}>()

/** Currently active item `value`. */
const model = defineModel<string>()
</script>

<template>
  <nav class="p-2 flex flex-col gap-0.5">
    <slot name="header" />
    <component
      :is="item.href ? 'a' : 'button'"
      v-for="item in items"
      :key="item.value"
      :href="item.href"
      :type="item.href ? undefined : 'button'"
      :aria-current="item.value === model ? 'page' : undefined"
      class="text-sm px-2 py-1.5 text-left outline-none rounded-md flex gap-2 w-full transition items-center focus-visible:ring-2 focus-visible:ring-primary-500/40"
      :class="[
        item.value === model ? 'bg-active color-active font-medium' : 'color-muted hover:bg-hover hover:color-base',
        item.disabled ? 'op50 pointer-events-none' : '',
      ]"
      @click="!item.href && (model = item.value)"
    >
      <span v-if="item.icon" :class="item.icon" aria-hidden="true" />
      <span class="flex-1 truncate">{{ item.label ?? item.value }}</span>
      <span
        v-if="item.badge != null"
        class="text-micro px-1.5 rounded-full bg-active"
      >{{ item.badge }}</span>
    </component>
    <slot name="footer" />
  </nav>
</template>
