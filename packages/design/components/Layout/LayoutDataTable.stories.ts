import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import LayoutDataTable from './LayoutDataTable.vue'

// `component` is omitted: this is a generic SFC, which doesn't fit Storybook's
// `Meta<typeof Component>` typing. The render below uses it directly.
const meta = {
  title: 'Layout/LayoutDataTable',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'type', label: 'Type' },
  { key: 'size', label: 'Size', align: 'right' as const, sortable: true, width: '6rem' },
  { key: 'time', label: 'Modified', align: 'right' as const, sortable: true, width: '8rem' },
]

const rows = [
  { name: 'index.ts', type: 'file', size: 1240, time: '2026-06-20' },
  { name: 'components', type: 'dir', size: 8, time: '2026-06-25' },
  { name: 'README.md', type: 'file', size: 3072, time: '2026-06-18' },
  { name: 'package.json', type: 'file', size: 856, time: '2026-06-26' },
  { name: 'utils', type: 'dir', size: 12, time: '2026-06-22' },
]

export const Default: Story = {
  render: () => ({
    components: { LayoutDataTable },
    setup() {
      return { columns, rows, sortBy: ref<string | undefined>('name') }
    },
    template: `<div class="border border-base rounded-lg max-w-2xl overflow-hidden">
      <LayoutDataTable v-model:sortBy="sortBy" :columns="columns" :rows="rows" />
    </div>`,
  }),
}

export const CustomCells: Story = {
  render: () => ({
    components: { LayoutDataTable },
    setup() {
      return { columns, rows }
    },
    template: `<div class="border border-base rounded-lg max-w-2xl overflow-hidden">
      <LayoutDataTable :columns="columns" :rows="rows" :sticky-header="false">
        <template #cell="{ column, value }">
          <span v-if="column.key === 'name'" class="font-mono">{{ value }}</span>
          <span v-else-if="column.key === 'type'" class="badge-muted">{{ value }}</span>
          <span v-else-if="column.key === 'size'" class="tabular-nums">{{ value }} B</span>
          <span v-else class="color-muted tabular-nums">{{ value }}</span>
        </template>
      </LayoutDataTable>
    </div>`,
  }),
}

export const StickyHeader: Story = {
  render: () => ({
    components: { LayoutDataTable },
    setup() {
      const many = Array.from({ length: 30 }, (_, i) => ({
        name: `file-${i + 1}.ts`,
        type: i % 3 === 0 ? 'dir' : 'file',
        size: (i + 1) * 128,
        time: `2026-06-${String((i % 28) + 1).padStart(2, '0')}`,
      }))
      return { columns, rows: many, sortBy: ref<string | undefined>('size'), sortDir: ref<'asc' | 'desc'>('desc') }
    },
    template: `<div class="border border-base rounded-lg max-w-2xl h-64 overflow-auto">
      <LayoutDataTable v-model:sortBy="sortBy" v-model:sortDir="sortDir" :columns="columns" :rows="rows" />
    </div>`,
  }),
}
