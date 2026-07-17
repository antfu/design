import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LayoutBreadcrumb from './LayoutBreadcrumb.vue'

const meta = {
  title: 'Layout/LayoutBreadcrumb',
  component: LayoutBreadcrumb,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Projects', href: '#' },
      { label: 'design', href: '#' },
      { label: 'LayoutBreadcrumb.vue' },
    ],
  },
} satisfies Meta<typeof LayoutBreadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ChevronSeparator: Story = {
  render: args => ({
    components: { LayoutBreadcrumb },
    setup() {
      return { args }
    },
    template: `<LayoutBreadcrumb v-bind="args">
      <template #separator>
        <span class="i-ph:caret-right text-xs" aria-hidden="true" />
      </template>
    </LayoutBreadcrumb>`,
  }),
}

export const Truncated: Story = {
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'A very long intermediate section name that should truncate', href: '#' },
      { label: 'Another long current page title that is also quite verbose' },
    ],
  },
  render: args => ({
    components: { LayoutBreadcrumb },
    setup() {
      return { args }
    },
    template: `<div class="w-72"><LayoutBreadcrumb v-bind="args" /></div>`,
  }),
}
