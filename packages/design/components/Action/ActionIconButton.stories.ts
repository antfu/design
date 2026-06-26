import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ActionIconButton from './ActionIconButton.vue'

const meta = {
  title: 'Action/ActionIconButton',
  component: ActionIconButton,
  tags: ['autodocs'],
  args: { icon: 'i-catppuccin:folder', tooltip: 'Open folder' },
} satisfies Meta<typeof ActionIconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { icon: 'i-catppuccin:folder', tooltip: 'Open folder' },
}

export const Active: Story = {
  args: { icon: 'i-catppuccin:settings', tooltip: 'Settings', active: true },
}

export const States: Story = {
  render: () => ({
    components: { ActionIconButton },
    template: `<div class="flex items-center gap-2">
      <ActionIconButton icon="i-catppuccin:folder" tooltip="Open folder" />
      <ActionIconButton icon="i-catppuccin:settings" tooltip="Settings" :active="true" />
      <ActionIconButton icon="i-catppuccin:trash" tooltip="Delete" :disabled="true" />
    </div>`,
  }),
}
