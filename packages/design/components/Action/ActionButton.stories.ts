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

// All three variants share one box (`btn-action`/`btn-primary`/`btn-text` carry
// the same padding and border box), so a mixed row lines up — `items-start`
// here rather than `items-center` so any height disagreement is visible.
export const MixedRow: Story = {
  render: () => ({
    components: { ActionButton },
    template: `<div class="flex items-start gap-3">
      <ActionButton icon="i-ph:arrows-clockwise">Refresh</ActionButton>
      <ActionButton variant="primary" icon="i-ph:check">Commit</ActionButton>
      <ActionButton variant="text" icon="i-ph:plus">Stage all</ActionButton>
    </div>`,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { ActionButton },
    template: `<div class="flex items-start gap-3">
      <ActionButton :disabled="true">Action</ActionButton>
      <ActionButton variant="primary" :disabled="true">Primary</ActionButton>
      <ActionButton variant="text" :disabled="true">Text</ActionButton>
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
