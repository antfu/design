import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import FormNumberInput from './FormNumberInput.vue'

const meta = {
  title: 'Form/FormNumberInput',
  component: FormNumberInput,
  tags: ['autodocs'],
  args: { step: 1, controls: true },
} satisfies Meta<typeof FormNumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { FormNumberInput },
    setup() {
      return { args, value: ref<number | undefined>(3) }
    },
    template: `<div class="w-40"><FormNumberInput v-bind="args" v-model="value" placeholder="0" /></div>`,
  }),
}

export const MinMax: Story = {
  render: args => ({
    components: { FormNumberInput },
    setup() {
      return { args, value: ref<number | undefined>(5) }
    },
    template: `<div class="w-40"><FormNumberInput v-bind="args" v-model="value" :min="0" :max="10" /></div>`,
  }),
}

export const States: Story = {
  render: () => ({
    components: { FormNumberInput },
    setup() {
      return { a: ref<number | undefined>(2), b: ref<number | undefined>(8), c: ref<number | undefined>(42) }
    },
    template: `<div class="flex flex-col gap-3 w-40">
      <FormNumberInput v-model="a" :min="0" :max="10" :step="2" />
      <FormNumberInput v-model="b" :controls="false" placeholder="No controls" />
      <FormNumberInput v-model="c" invalid />
    </div>`,
  }),
}
