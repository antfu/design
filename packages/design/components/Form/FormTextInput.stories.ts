import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import FormTextInput from './FormTextInput.vue'

const meta = {
  title: 'Form/FormTextInput',
  component: FormTextInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof FormTextInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { FormTextInput },
    setup() {
      return { text: ref('') }
    },
    template: `<div class="w-72"><FormTextInput v-model="text" placeholder="Your name" icon="i-catppuccin:folder" clearable /></div>`,
  }),
}

export const States: Story = {
  render: () => ({
    components: { FormTextInput },
    setup() {
      return { a: ref('Hello'), b: ref(''), c: ref('Locked') }
    },
    template: `<div class="flex flex-col gap-3 w-72">
      <FormTextInput v-model="a" placeholder="Default" clearable />
      <FormTextInput v-model="b" placeholder="Small" size="sm" />
      <FormTextInput v-model="c" placeholder="Disabled" disabled />
    </div>`,
  }),
}
