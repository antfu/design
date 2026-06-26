import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LayoutCard from './LayoutCard.vue'

const meta = {
  title: 'Layout/LayoutCard',
  component: LayoutCard,
  tags: ['autodocs'],
} satisfies Meta<typeof LayoutCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { LayoutCard },
    template: `<LayoutCard class="w-64">
      <div class="font-medium">Card title</div>
      <p class="text-sm color-muted mt-1">A bordered, token-driven surface.</p>
    </LayoutCard>`,
  }),
}

export const Elevated: Story = {
  render: () => ({
    components: { LayoutCard },
    template: `<LayoutCard class="w-64" elevated>
      <div class="font-medium">Elevated card</div>
      <p class="text-sm color-muted mt-1">With a subtle drop shadow.</p>
    </LayoutCard>`,
  }),
}
