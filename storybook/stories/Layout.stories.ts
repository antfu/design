import type { Meta, StoryObj } from '@storybook/vue3-vite'
import StatusPill from '@antfu/design/components/Display/DisplayStatusPill.vue'
import EmptyState from '@antfu/design/components/Feedback/FeedbackEmptyState.vue'
import Tip from '@antfu/design/components/Feedback/FeedbackTip.vue'
import Card from '@antfu/design/components/Layout/LayoutCard.vue'
import SectionBlock from '@antfu/design/components/Layout/LayoutSectionBlock.vue'
import Tabs from '@antfu/design/components/Layout/LayoutTabs.vue'
import { ref } from 'vue'

const meta = {
  title: 'Tier 3/Layout & Feedback',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Cards: Story = {
  render: () => ({
    components: { Card },
    template: `<Card class="w-64"><div class="font-medium">Card title</div><p class="text-sm color-muted mt-1">A bordered, token-driven surface.</p></Card>`,
  }),
}

export const Sections: Story = {
  render: () => ({
    components: { SectionBlock },
    template: `<div class="w-80 flex flex-col gap-2">
      <SectionBlock title="Open by default" icon="i-catppuccin:folder">
        <p class="text-sm color-muted">Collapsible content.</p>
      </SectionBlock>
      <SectionBlock title="Collapsed" :open="false">
        <p class="text-sm color-muted">Hidden until expanded.</p>
      </SectionBlock>
    </div>`,
  }),
}

export const TabsUnderline: Story = {
  render: () => ({
    components: { Tabs },
    setup() {
      return { tab: ref('overview'), tabs: [
        { value: 'overview', label: 'Overview', count: 12 },
        { value: 'deps', label: 'Dependencies', count: 48 },
        { value: 'settings', label: 'Settings' },
      ] }
    },
    template: `<Tabs v-model="tab" :tabs="tabs" class="w-96" />`,
  }),
}

export const TabsSegment: Story = {
  render: () => ({
    components: { Tabs },
    setup() {
      return { tab: ref('list'), tabs: [{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }] }
    },
    template: `<Tabs v-model="tab" :tabs="tabs" variant="segment" />`,
  }),
}

export const Feedback: Story = {
  render: () => ({
    components: { Tip, StatusPill, EmptyState },
    template: `<div class="flex flex-col gap-4 w-96">
      <Tip type="info">An informational note.</Tip>
      <Tip type="warning">Careful with this setting.</Tip>
      <div class="flex gap-4">
        <StatusPill status="success" label="Online" />
        <StatusPill status="high" label="Degraded" pulse />
        <StatusPill status="critical" label="Down" />
      </div>
      <EmptyState title="No results" icon="i-catppuccin:folder">
        <template #hint>Try a different search term.</template>
      </EmptyState>
    </div>`,
  }),
}
