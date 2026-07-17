<!-- @description a sortable, generic data table from `columns` + `rows`, optional `stickyHeader`. -->
<script setup lang="ts" generic="T">
import { computed } from 'vue'

export interface Column {
  /** Property key on the row used for value lookup and sorting. */
  key: string
  /** Header label; falls back to `key`. */
  label?: string
  /** Cell + header text alignment. */
  align?: 'left' | 'right' | 'center'
  /** Allow clicking the header to sort by this column. */
  sortable?: boolean
  /** Fixed column width (any CSS length). */
  width?: string
}

const props = withDefaults(
  defineProps<{
    columns: Column[]
    rows: T[]
    /** Stable key per row; defaults to the row index. */
    rowKey?: (row: T, index: number) => string | number
    /** Emit `sort` only and leave row ordering to the parent. */
    manualSort?: boolean
    /** Pin the header to the top while the body scrolls. */
    stickyHeader?: boolean
  }>(),
  { manualSort: false, stickyHeader: true },
)

const emit = defineEmits<{
  sort: [payload: { key: string, dir: 'asc' | 'desc' }]
}>()

defineSlots<{
  cell?: (props: { row: T, column: Column, value: unknown }) => any
  header?: (props: { column: Column }) => any
}>()

const sortBy = defineModel<string | undefined>('sortBy')
const sortDir = defineModel<'asc' | 'desc'>('sortDir', { default: 'asc' })

const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' }

function valueOf(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key]
}

const sortedRows = computed<T[]>(() => {
  const key = sortBy.value
  if (props.manualSort || !key)
    return props.rows
  const dir = sortDir.value === 'desc' ? -1 : 1
  return [...props.rows].sort((a, b) => {
    const av = valueOf(a, key)
    const bv = valueOf(b, key)
    if (av == null && bv == null)
      return 0
    if (av == null)
      return -1 * dir
    if (bv == null)
      return 1 * dir
    if (typeof av === 'number' && typeof bv === 'number')
      return (av - bv) * dir
    return String(av).localeCompare(String(bv)) * dir
  })
})

function toggleSort(col: Column): void {
  if (!col.sortable)
    return
  if (sortBy.value === col.key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  }
  else {
    sortBy.value = col.key
    sortDir.value = 'asc'
  }
  emit('sort', { key: col.key, dir: sortDir.value })
}

function rowKeyOf(row: T, index: number): string | number {
  return props.rowKey ? props.rowKey(row, index) : index
}
</script>

<template>
  <table class="text-sm w-full border-collapse">
    <thead :class="stickyHeader ? 'sticky top-0 z-nav bg-secondary' : ''">
      <tr>
        <th
          v-for="col in columns"
          :key="col.key"
          scope="col"
          class="color-muted font-medium px-3 py-2 border-b border-base"
          :class="alignClass[col.align ?? 'left']"
          :style="col.width ? { width: col.width } : undefined"
          :aria-sort="sortBy === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined"
        >
          <slot name="header" :column="col">
            <button
              v-if="col.sortable"
              type="button"
              class="outline-none rounded inline-flex gap-1 max-w-full items-center hover:color-base focus-visible:ring-2 focus-visible:ring-primary-500/40"
              :class="[alignClass[col.align ?? 'left'], col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : '']"
              @click="toggleSort(col)"
            >
              <span class="truncate">{{ col.label ?? col.key }}</span>
              <span
                class="i-ph:caret-up-fill text-xs shrink-0 transition"
                :class="sortBy === col.key ? 'color-active' : 'op-mute'"
                :style="sortBy === col.key && sortDir === 'desc' ? 'transform: rotate(180deg)' : undefined"
                aria-hidden="true"
              />
            </button>
            <span v-else class="max-w-full inline-block truncate">{{ col.label ?? col.key }}</span>
          </slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, i) in sortedRows"
        :key="rowKeyOf(row, i)"
        class="border-b border-mute hover:bg-active"
      >
        <td
          v-for="col in columns"
          :key="col.key"
          class="px-3 py-1.5"
          :class="alignClass[col.align ?? 'left']"
        >
          <slot name="cell" :row="row" :column="col" :value="valueOf(row, col.key)">
            {{ String(valueOf(row, col.key)) }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>
