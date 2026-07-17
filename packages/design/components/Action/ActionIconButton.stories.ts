import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ActionIconButton from './ActionIconButton.vue'

const meta = {
  title: 'Action/ActionIconButton',
  component: ActionIconButton,
  tags: ['autodocs'],
  args: { icon: 'i-ph:folder', tooltip: 'Open folder' },
} satisfies Meta<typeof ActionIconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { icon: 'i-ph:folder', tooltip: 'Open folder' },
}

export const Active: Story = {
  args: { icon: 'i-ph:gear', tooltip: 'Settings', active: true },
}

export const States: Story = {
  render: () => ({
    components: { ActionIconButton },
    template: `<div class="flex items-center gap-2">
      <ActionIconButton icon="i-ph:folder" tooltip="Open folder" />
      <ActionIconButton icon="i-ph:gear" tooltip="Settings" :active="true" />
      <ActionIconButton icon="i-ph:trash" tooltip="Delete" :disabled="true" />
    </div>`,
  }),
}

export const Compact: Story = {
  args: { icon: 'i-ph:dots-three', tooltip: 'More', compact: true },
}

export const AsLink: Story = {
  render: () => ({
    components: { ActionIconButton },
    template: `<ActionIconButton as="a" href="https://opencode.ai" target="_blank" rel="noopener noreferrer" icon="i-ph:arrow-square-out" label="Open docs" tooltip="Open docs" />`,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { ActionIconButton },
    // No `size` prop — the button's own `font-size` is the size, just like
    // DisplayBadge. Resize it with any font-size class (or utility).
    template: `<div class="flex items-center gap-2">
      <ActionIconButton icon="i-ph:gear" tooltip="micro" class="text-micro" />
      <ActionIconButton icon="i-ph:gear" tooltip="mini" class="text-mini" />
      <ActionIconButton icon="i-ph:gear" tooltip="compact" class="text-compact" />
      <ActionIconButton icon="i-ph:gear" tooltip="sm" class="text-sm" />
      <ActionIconButton icon="i-ph:gear" tooltip="base" class="text-base" />
      <ActionIconButton icon="i-ph:gear" tooltip="lg" class="text-lg" />
      <ActionIconButton icon="i-ph:gear" tooltip="xl" class="text-xl" />
    </div>`,
  }),
}
