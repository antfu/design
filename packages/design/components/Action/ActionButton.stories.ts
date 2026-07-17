import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ActionButton from './ActionButton.vue'

const meta = {
  title: 'Action/ActionButton',
  component: ActionButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['action', 'primary', 'text'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: { variant: 'action', size: 'md' },
} satisfies Meta<typeof ActionButton>

export default meta
type Story = StoryObj<typeof meta>

export const Action: Story = {
  render: (args: Record<string, unknown>) => ({
    components: { ActionButton },
    setup() {
      return { args }
    },
    template: `<ActionButton v-bind="args">Action</ActionButton>`,
  }),
}

export const Primary: Story = {
  render: () => ({
    components: { ActionButton },
    template: `<ActionButton variant="primary">Primary</ActionButton>`,
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { ActionButton },
    template: `<div class="flex items-center gap-3">
      <ActionButton>Action</ActionButton>
      <ActionButton variant="primary">Primary</ActionButton>
      <ActionButton variant="text">Text</ActionButton>
      <ActionButton :loading="true">Loading</ActionButton>
      <ActionButton :disabled="true">Disabled</ActionButton>
    </div>`,
  }),
}

export const AsLink: Story = {
  render: () => ({
    components: { ActionButton },
    template: `<ActionButton as="a" href="https://opencode.ai" target="_blank" rel="noopener noreferrer">Open docs</ActionButton>`,
  }),
}

export const WithIconAndSizes: Story = {
  render: () => ({
    components: { ActionButton },
    template: `<div class="flex items-center gap-3">
      <ActionButton icon="i-ph:folder" size="sm">Small</ActionButton>
      <ActionButton icon="i-ph:folder" size="md">Medium</ActionButton>
    </div>`,
  }),
}
