<!-- @description a linked path trail from `items`; the last crumb renders as plain text. -->
<script setup lang="ts">
export interface Crumb {
  label: string
  /** Link target; the last crumb is rendered as plain text regardless. */
  href?: string
  /** Optional leading icon class. */
  icon?: string
}

withDefaults(
  defineProps<{
    items: Crumb[]
    /** Text rendered between crumbs; overridden by the `#separator` slot. */
    separator?: string
  }>(),
  { separator: '/' },
)

defineSlots<{
  separator?: () => any
}>()
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol class="text-sm flex flex-wrap min-w-0 items-center">
      <li
        v-for="(item, i) in items"
        :key="i"
        class="flex min-w-0 items-center"
      >
        <span v-if="i > 0" class="mx-1 op-mute shrink-0" aria-hidden="true">
          <slot name="separator">{{ separator }}</slot>
        </span>
        <a
          v-if="item.href && i < items.length - 1"
          :href="item.href"
          class="color-muted outline-none rounded inline-flex gap-1 min-w-0 transition items-center hover:color-active focus-visible:ring-2 focus-visible:ring-primary-500/40"
        >
          <span v-if="item.icon" :class="item.icon" class="shrink-0" aria-hidden="true" />
          <span class="truncate">{{ item.label }}</span>
        </a>
        <span
          v-else
          class="color-base inline-flex gap-1 min-w-0 items-center"
          :aria-current="i === items.length - 1 ? 'page' : undefined"
        >
          <span v-if="item.icon" :class="item.icon" class="shrink-0" aria-hidden="true" />
          <span class="truncate">{{ item.label }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>
