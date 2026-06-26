import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Pane } from 'splitpanes'
import LayoutSplitPane from './LayoutSplitPane.vue'

const meta = {
  title: 'Layout/LayoutSplitPane',
  component: LayoutSplitPane,
  tags: ['autodocs'],
} satisfies Meta<typeof LayoutSplitPane>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => ({
    components: { LayoutSplitPane, Pane },
    template: `<div class="border border-base rounded-lg h-64 w-full overflow-hidden">
      <LayoutSplitPane>
        <Pane :size="40">
          <div class="text-sm color-muted h-full p-3">Left pane</div>
        </Pane>
        <Pane :size="60">
          <div class="text-sm color-muted h-full p-3">Right pane</div>
        </Pane>
      </LayoutSplitPane>
    </div>`,
  }),
}

export const Vertical: Story = {
  render: () => ({
    components: { LayoutSplitPane, Pane },
    template: `<div class="border border-base rounded-lg h-64 w-full overflow-hidden">
      <LayoutSplitPane horizontal>
        <Pane>
          <div class="text-sm color-muted h-full p-3">Top pane</div>
        </Pane>
        <Pane>
          <div class="text-sm color-muted h-full p-3">Bottom pane</div>
        </Pane>
      </LayoutSplitPane>
    </div>`,
  }),
}
