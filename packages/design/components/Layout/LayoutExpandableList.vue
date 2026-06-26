<script setup lang="ts" generic="T">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    items: T[]
    /** How many to show before collapsing. */
    max?: number
  }>(),
  { max: 5 },
)

const expanded = ref(false)
const visible = computed(() => (expanded.value ? props.items : props.items.slice(0, props.max)))
const hidden = computed(() => Math.max(0, props.items.length - props.max))
</script>

<template>
  <div>
    <div class="relative">
      <template v-for="(item, i) in visible" :key="i">
        <slot :item="item" :index="i" />
      </template>
      <div
        v-if="!expanded && hidden > 0"
        class="h-8 pointer-events-none inset-x-0 bottom-0 absolute bg-gradient-more"
      />
    </div>
    <button
      v-if="hidden > 0"
      type="button"
      class="text-sm color-active mt-1 outline-none rounded hover:underline focus-visible:ring-2 focus-visible:ring-primary-500/40"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'Show less' : `Show ${hidden} more` }}
    </button>
  </div>
</template>
