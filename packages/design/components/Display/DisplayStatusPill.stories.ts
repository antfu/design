import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayStatusPill from './DisplayStatusPill.vue'

const meta = {
  title: 'Display/DisplayStatusPill',
  component: DisplayStatusPill,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['neutral', 'low', 'medium', 'high', 'critical', 'success', 'error', 'warning', 'info'],
    },
  },
  args: { status: 'success', label: 'Online' },
} satisfies Meta<typeof DisplayStatusPill>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = { args: { status: 'success', label: 'Online' } }
export const Pulsing: Story = { args: { status: 'high', label: 'Degraded', pulse: true } }

export const Statuses: Story = {
  render: () => ({
    components: { DisplayStatusPill },
    template: `<div class="flex flex-wrap gap-4">
      <DisplayStatusPill status="success" label="Online" />
      <DisplayStatusPill status="high" label="Degraded" pulse />
      <DisplayStatusPill status="critical" label="Down" />
      <DisplayStatusPill status="info" label="Info" />
      <DisplayStatusPill status="neutral" label="Idle" />
    </div>`,
  }),
}
