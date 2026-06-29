import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import ActionToggle from './ActionToggle.vue'

const meta = {
  title: 'Action/ActionToggle',
  component: ActionToggle,
  tags: ['autodocs'],
} satisfies Meta<typeof ActionToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { ActionToggle },
    setup: () => ({ on: ref(false) }),
    template: `<ActionToggle v-model="on" icon="i-ph:text-b-bold" label="Bold" />`,
  }),
}
