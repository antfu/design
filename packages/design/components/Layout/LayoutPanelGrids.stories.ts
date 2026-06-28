import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LayoutPanelGrids from './LayoutPanelGrids.vue'

const meta = {
  title: 'Layout/LayoutPanelGrids',
  component: LayoutPanelGrids,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['dots', 'grid'] },
  },
  args: { variant: 'dots', size: 16 },
} satisfies Meta<typeof LayoutPanelGrids>

export default meta
type Story = StoryObj<typeof meta>

export const Dots: Story = {
  render: args => ({
    components: { LayoutPanelGrids },
    setup: () => ({ args }),
    template: `<LayoutPanelGrids v-bind="args" class="rounded-lg border border-base">
      <span class="text-sm color-muted">No data yet</span>
    </LayoutPanelGrids>`,
  }),
}

export const Grid: Story = { ...Dots, args: { variant: 'grid' } }
export const LargeCells: Story = { ...Dots, args: { variant: 'grid', size: 32 } }
