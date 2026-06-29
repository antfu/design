import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import ActionToggleGroup from './ActionToggleGroup.vue'

const meta = {
  title: 'Action/ActionToggleGroup',
  component: ActionToggleGroup,
  tags: ['autodocs'],
  args: { options: [] }, // required prop; each story supplies real options via render
} satisfies Meta<typeof ActionToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const SegmentControl: Story = {
  render: () => ({
    components: { ActionToggleGroup },
    setup: () => ({ view: ref('grid'), options: [
      { value: 'grid', label: 'Grid' },
      { value: 'list', label: 'List' },
      { value: 'tree', label: 'Tree' },
    ] }),
    template: `<ActionToggleGroup v-model="view" :options="options" />`,
  }),
}

export const IconOnly: Story = {
  render: () => ({
    components: { ActionToggleGroup },
    setup: () => ({ align: ref('left'), options: [
      { value: 'left', label: 'Left', icon: 'i-ph:text-align-left' },
      { value: 'center', label: 'Center', icon: 'i-ph:text-align-center' },
      { value: 'right', label: 'Right', icon: 'i-ph:text-align-right' },
    ] }),
    template: `<ActionToggleGroup v-model="align" :options="options" icon-only />`,
  }),
}
