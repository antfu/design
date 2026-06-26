import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Donut from '@antfu/design/components/Display/DisplayDonut.vue'
import FileIcon from '@antfu/design/components/Display/DisplayFileIcon.vue'
import FilePath from '@antfu/design/components/Display/DisplayFilePath.vue'
import Label from '@antfu/design/components/Display/DisplayLabel.vue'
import PackageName from '@antfu/design/components/Display/DisplayPackageName.vue'
import ProportionBar from '@antfu/design/components/Display/DisplayProportionBar.vue'
import Version from '@antfu/design/components/Display/DisplayVersion.vue'
import ExpandableList from '@antfu/design/components/Layout/LayoutExpandableList.vue'

const meta = {
  title: 'Tier 3/Data Viz & Files',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Donuts: Story = {
  render: () => ({
    components: { Donut },
    template: `<div class="flex items-center gap-4">
      <Donut :value="0.25" />
      <Donut :value="0.6" :size="48" />
      <Donut :value="0.9" :size="64" :thickness="6" />
    </div>`,
  }),
}

export const Proportions: Story = {
  render: () => ({
    components: { ProportionBar },
    setup() {
      return { segments: [
        { value: 60, label: 'JavaScript', color: '#f1e05a' },
        { value: 30, label: 'TypeScript', color: '#3178c6' },
        { value: 10, label: 'CSS', color: '#563d7c' },
      ] }
    },
    template: `<div class="w-80"><ProportionBar :segments="segments" :height="12" /></div>`,
  }),
}

export const Files: Story = {
  render: () => ({
    components: { FilePath, FileIcon },
    template: `<div class="flex flex-col gap-2">
      <div class="flex items-center gap-2"><FileIcon path="a.vue" /><FileIcon path="b.ts" /><FileIcon path="c.json" /><FileIcon path="d.css" /></div>
      <FilePath path="/project/src/components/Badge.vue" root="/project" />
      <FilePath path="/project/node_modules/.pnpm/vue@3.5.0/node_modules/vue/dist/vue.mjs" />
    </div>`,
  }),
}

export const Packages: Story = {
  render: () => ({
    components: { PackageName, Version, Label },
    template: `<div class="flex flex-col gap-2">
      <div class="flex gap-3"><PackageName name="@antfu/design" /><PackageName name="unocss" /></div>
      <div class="flex gap-3"><Version version="1.2.3" /><Version version="v0.1.0" :prefix="false" /></div>
      <div class="flex gap-2">
        <Label text="bug" color="#d73a4a" />
        <Label text="enhancement" color="#a2eeef" />
        <Label text="docs" color="#0075ca" />
      </div>
    </div>`,
  }),
}

export const Expandable: Story = {
  render: () => ({
    components: { ExpandableList },
    setup() {
      return { items: Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`) }
    },
    template: `<div class="w-64">
      <ExpandableList :items="items" :max="4">
        <template #default="{ item }"><div class="py-1 text-sm border-b border-base">{{ item }}</div></template>
      </ExpandableList>
    </div>`,
  }),
}
