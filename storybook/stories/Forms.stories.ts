import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Kbd from '@antfu/design/components/Display/DisplayKbd.vue'
import Checkbox from '@antfu/design/components/Form/FormCheckbox.vue'
import RadioGroup from '@antfu/design/components/Form/FormRadioGroup.vue'
import SearchField from '@antfu/design/components/Form/FormSearchField.vue'
import Select from '@antfu/design/components/Form/FormSelect.vue'
import Switch from '@antfu/design/components/Form/FormSwitch.vue'
import TextInput from '@antfu/design/components/Form/FormTextInput.vue'
import { ref } from 'vue'

const meta = {
  title: 'Tier 2/Forms',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Inputs: Story = {
  render: () => ({
    components: { TextInput, SearchField },
    setup() {
      return { text: ref(''), search: ref('') }
    },
    template: `<div class="flex flex-col gap-3 w-72">
      <TextInput v-model="text" placeholder="Your name" icon="i-catppuccin:folder" clearable />
      <SearchField v-model="search" shortcut="mod+k" />
    </div>`,
  }),
}

export const Toggles: Story = {
  render: () => ({
    components: { Checkbox, Switch },
    setup() {
      return { a: ref(true), b: ref(false), c: ref(true) }
    },
    template: `<div class="flex flex-col gap-3">
      <Checkbox v-model="a" label="Enable telemetry" />
      <Checkbox v-model="b" label="Disabled option" disabled />
      <Switch v-model="c" label="Dark surfaces" />
    </div>`,
  }),
}

export const Radios: Story = {
  render: () => ({
    components: { RadioGroup },
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
    template: `<RadioGroup v-model="value" :options="options" />`,
  }),
}

export const Selects: Story = {
  render: () => ({
    components: { Select },
    setup() {
      return {
        value: ref('green'),
        options: [
          { value: 'green', label: 'antfu green' },
          { value: 'blue', label: 'GitHub blue' },
          { value: 'purple', label: 'Vite purple' },
        ],
      }
    },
    template: `<Select v-model="value" :options="options" placeholder="Pick a theme" />`,
  }),
}

export const Kbds: Story = {
  render: () => ({
    components: { Kbd },
    template: `<div class="flex items-center gap-3">
      <Kbd keys="mod+k" />
      <Kbd keys="shift+?" />
      <Kbd keys="g g" />
    </div>`,
  }),
}
