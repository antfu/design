<!-- @description page-number navigation. -->
<script setup lang="ts">
import { PaginationEllipsis, PaginationList, PaginationListItem, PaginationNext, PaginationPrev, PaginationRoot } from 'reka-ui'

withDefaults(
  defineProps<{
    total: number
    itemsPerPage?: number
    siblingCount?: number
  }>(),
  { itemsPerPage: 10, siblingCount: 1 },
)

const page = defineModel<number>('page', { default: 1 })
</script>

<template>
  <PaginationRoot
    v-model:page="page"
    :total="total"
    :items-per-page="itemsPerPage"
    :sibling-count="siblingCount"
    :show-edges="true"
  >
    <PaginationList v-slot="{ items }" class="flex gap-1 items-center">
      <PaginationPrev class="btn-icon-compact" aria-label="Previous page">
        <span class="i-ph:caret-left" aria-hidden="true" />
      </PaginationPrev>
      <template v-for="(item, i) in items" :key="i">
        <PaginationListItem
          v-if="item.type === 'page'"
          :value="item.value"
          class="text-sm font-mono px2 rounded h-6 min-w-6 transition tabular-nums data-[selected]:btn-action-active hover:bg-active"
        >
          {{ item.value }}
        </PaginationListItem>
        <PaginationEllipsis v-else class="text-sm color-faint px1">
          &#8230;
        </PaginationEllipsis>
      </template>
      <PaginationNext class="btn-icon-compact" aria-label="Next page">
        <span class="i-ph:caret-right" aria-hidden="true" />
      </PaginationNext>
    </PaginationList>
  </PaginationRoot>
</template>
