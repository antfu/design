import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LayoutSectionBlock from './LayoutSectionBlock.vue'

const meta = {
  title: 'Layout/LayoutSectionBlock',
  component: LayoutSectionBlock,
  tags: ['autodocs'],
  args: { title: 'Section', icon: 'i-catppuccin:folder' },
} satisfies Meta<typeof LayoutSectionBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
  render: () => ({
    components: { LayoutSectionBlock },
    template: `<div class="w-80">
      <LayoutSectionBlock title="Open by default" icon="i-catppuccin:folder">
        <p class="text-sm color-muted">Collapsible content.</p>
      </LayoutSectionBlock>
    </div>`,
  }),
}

export const Collapsed: Story = {
  render: () => ({
    components: { LayoutSectionBlock },
    template: `<div class="w-80 flex flex-col gap-2">
      <LayoutSectionBlock title="Open by default" icon="i-catppuccin:folder">
        <p class="text-sm color-muted">Collapsible content.</p>
      </LayoutSectionBlock>
      <LayoutSectionBlock title="Collapsed" :open="false">
        <p class="text-sm color-muted">Hidden until expanded.</p>
      </LayoutSectionBlock>
    </div>`,
  }),
}
