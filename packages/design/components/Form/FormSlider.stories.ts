import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import FormSlider from './FormSlider.vue'

const meta = {
  title: 'Form/FormSlider',
  component: FormSlider,
  tags: ['autodocs'],
} satisfies Meta<typeof FormSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { FormSlider },
    setup: () => ({ value: ref(40) }),
    template: `<FormSlider v-model="value" show-value class="w-64" />`,
  }),
}

export const Range: Story = {
  render: () => ({
    components: { FormSlider },
    setup: () => ({ value: ref([20, 70]) }),
    template: `<FormSlider v-model="value" show-value class="w-64" />`,
  }),
}
