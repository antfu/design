import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import FormRadioGroup from './FormRadioGroup.vue'

const meta = {
  title: 'Form/FormRadioGroup',
  component: FormRadioGroup,
  tags: ['autodocs'],
  args: { options: [] }, // required prop; each story supplies real options via render
} satisfies Meta<typeof FormRadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { FormRadioGroup },
    setup() {
      return {
        value: ref('wind4'),
        options: [
          { value: 'wind4', label: 'Wind 4' },
          { value: 'wind3', label: 'Wind 3' },
          { value: 'mini', label: 'Mini' },
        ],
      }
    },
    template: `<FormRadioGroup v-model="value" :options="options" />`,
  }),
}

export const Horizontal: Story = {
  render: () => ({
    components: { FormRadioGroup },
    setup() {
      return {
        value: ref('a'),
        options: [
          { value: 'a', label: 'Option A' },
          { value: 'b', label: 'Option B' },
          { value: 'c', label: 'Disabled', disabled: true },
        ],
      }
    },
    template: `<FormRadioGroup v-model="value" :options="options" orientation="horizontal" />`,
  }),
}
