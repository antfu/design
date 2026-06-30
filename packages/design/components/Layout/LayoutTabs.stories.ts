import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import LayoutTabs from './LayoutTabs.vue'

const meta = {
  title: 'Layout/LayoutTabs',
  component: LayoutTabs,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['underline', 'segment'] },
  },
  args: { tabs: [] }, // required prop; each story supplies real tabs via render
} satisfies Meta<typeof LayoutTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Underline: Story = {
  render: () => ({
    components: { LayoutTabs },
    setup() {
      return {
        tab: ref('overview'),
        tabs: [
          { value: 'overview', label: 'Overview', count: 12 },
          { value: 'deps', label: 'Dependencies', count: 48 },
          { value: 'settings', label: 'Settings' },
        ],
      }
    },
    template: `<LayoutTabs v-model="tab" :tabs="tabs" class="w-96" />`,
  }),
}

export const Segment: Story = {
  render: () => ({
    components: { LayoutTabs },
    setup() {
      return { tab: ref('list'), tabs: [{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }] }
    },
    template: `<LayoutTabs v-model="tab" :tabs="tabs" variant="segment" />`,
  }),
}

export const Panels: Story = {
  render: () => ({
    components: { LayoutTabs },
    setup() {
      return {
        tab: ref('overview'),
        tabs: [
          { value: 'overview', label: 'Overview' },
          { value: 'deps', label: 'Dependencies' },
          { value: 'settings', label: 'Settings' },
        ],
      }
    },
    // Per-tab content via named slots keyed by `tab.value`; lazy by default.
    template: `<LayoutTabs v-model="tab" :tabs="tabs" class="w-96">
      <template #overview><div class="color-muted">Project overview.</div></template>
      <template #deps><div class="color-muted">48 dependencies.</div></template>
      <template #settings><div class="color-muted">Settings panel.</div></template>
    </LayoutTabs>`,
  }),
}
