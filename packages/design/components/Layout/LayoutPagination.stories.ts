import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import LayoutPagination from './LayoutPagination.vue'

const meta = {
  title: 'Layout/LayoutPagination',
  component: LayoutPagination,
  tags: ['autodocs'],
  args: { total: 0 }, // required prop; each story supplies a real total via render
} satisfies Meta<typeof LayoutPagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { LayoutPagination },
    setup: () => ({ page: ref(4) }),
    template: `<LayoutPagination v-model:page="page" :total="200" :items-per-page="10" />`,
  }),
}
