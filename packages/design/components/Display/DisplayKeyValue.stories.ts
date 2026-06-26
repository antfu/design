import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DisplayKeyValue from './DisplayKeyValue.vue'

const meta = {
  title: 'Display/DisplayKeyValue',
  component: DisplayKeyValue,
  tags: ['autodocs'],
  args: { label: 'Version', value: '1.4.0' },
} satisfies Meta<typeof DisplayKeyValue>

export default meta
type Story = StoryObj<typeof meta>

export const Inline: Story = { args: { label: 'Version', value: '1.4.0' } }
export const Stacked: Story = { args: { label: 'Total size', value: '204 kB', orientation: 'stacked' } }

export const DetailRows: Story = {
  render: () => ({
    components: { DisplayKeyValue },
    template: `<div class="w-72 flex flex-col gap-1">
      <DisplayKeyValue label="Name" value="@antfu/design" />
      <DisplayKeyValue label="Version" value="1.4.0" />
      <DisplayKeyValue label="License" value="MIT" :mono="false" />
      <DisplayKeyValue label="Downloads" value="1,204,558" />
    </div>`,
  }),
}

export const StatStrip: Story = {
  render: () => ({
    components: { DisplayKeyValue },
    template: `<div class="flex gap-6">
      <DisplayKeyValue label="Files" value="128" orientation="stacked" />
      <DisplayKeyValue label="Size" value="204 kB" orientation="stacked" />
      <DisplayKeyValue label="Modules" value="42" orientation="stacked" />
    </div>`,
  }),
}

export const WithBadge: Story = {
  render: () => ({
    components: { DisplayKeyValue },
    template: `<div class="w-72 flex flex-col gap-3">
      <DisplayKeyValue label="Status" value="passing">
        <template #badge>
          <span class="badge-color-green">ok</span>
        </template>
      </DisplayKeyValue>
      <DisplayKeyValue label="Coverage" value="98%" orientation="stacked">
        <template #badge>
          <span class="badge-color-blue">+2%</span>
        </template>
      </DisplayKeyValue>
    </div>`,
  }),
}
