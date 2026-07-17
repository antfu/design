import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import FormSegmentedControl from './FormSegmentedControl.vue'

const meta = {
  title: 'Form/FormSegmentedControl',
  component: FormSegmentedControl,
  tags: ['autodocs'],
  args: { options: [] }, // required prop; each story supplies real options via render
} satisfies Meta<typeof FormSegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { FormSegmentedControl },
    setup() {
      return {
        value: ref('list'),
        options: [
          { value: 'grid' },
          { value: 'list' },
          { value: 'tree' },
        ],
      }
    },
    template: `<FormSegmentedControl v-model="value" :options="options" />`,
  }),
}

export const NullableTriState: Story = {
  render: () => ({
    components: { FormSegmentedControl },
    setup() {
      return {
        // A three-way filter where `null` means "no preference".
        value: ref<string | null>(null),
        options: [
          { value: null, label: 'Any' },
          { value: 'true', label: 'Yes' },
          { value: 'false', label: 'No' },
        ],
      }
    },
    template: `<FormSegmentedControl v-model="value" :options="options" />`,
  }),
}

export const DisabledOption: Story = {
  render: () => ({
    components: { FormSegmentedControl },
    setup() {
      return {
        value: ref(10),
        options: [
          { value: 10 },
          { value: 25 },
          { value: 50, disabled: true },
          { value: 100 },
        ],
      }
    },
    template: `<FormSegmentedControl v-model="value" :options="options" />`,
  }),
}
