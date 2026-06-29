import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import FormRangeSlider from './FormRangeSlider.vue'

const meta = {
  title: 'Form/FormRangeSlider',
  component: FormRangeSlider,
  tags: ['autodocs'],
} satisfies Meta<typeof FormRangeSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Range: Story = {
  render: () => ({
    components: { FormRangeSlider },
    setup: () => ({ value: ref([20, 70]) }),
    template: `<FormRangeSlider v-model="value" show-value class="w-72" />`,
  }),
}

export const Single: Story = {
  render: () => ({
    components: { FormRangeSlider },
    setup: () => ({ value: ref(40) }),
    template: `<FormRangeSlider v-model="value" show-value class="w-72" />`,
  }),
}

export const WithUnitAndDefault: Story = {
  render: () => ({
    components: { FormRangeSlider },
    setup: () => ({ value: ref(60) }),
    template: `<FormRangeSlider v-model="value" :default="50" unit="%" show-value class="w-72" />`,
  }),
}

export const Locked: Story = {
  render: () => ({
    components: { FormRangeSlider },
    setup: () => ({ value: ref([30, 80]) }),
    template: `<FormRangeSlider v-model="value" :expandable="false" show-value class="w-72" />`,
  }),
}
