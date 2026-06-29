import type { Meta, StoryObj } from '@storybook/vue3-vite'

// scroll-fade is a CSS utility, not a component, so each story renders the class
// on a plain scroller. See the preset's `unocss/scroll-fade.ts` (ported from
// shadcn/ui). The fade is scroll-aware: it tracks position with no JS.
const meta = {
  title: 'Utilities/ScrollFade',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

const items = Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`)
const tags = ['Design', 'Engineering', 'Marketing', 'Product', 'Research', 'Sales', 'Support', 'Operations', 'Finance', 'Legal']

export const Vertical: Story = {
  render: () => ({
    setup: () => ({ items }),
    template: `<div class="w-64 rounded-2xl border border-base overflow-hidden">
      <ul class="scroll-fade no-scrollbar max-h-56 overflow-y-auto p-2 text-sm">
        <li v-for="i in items" :key="i" class="px-2 py-1.5">{{ i }}</li>
      </ul>
    </div>`,
  }),
}

export const Horizontal: Story = {
  render: () => ({
    setup: () => ({ tags }),
    template: `<div class="w-80 rounded-2xl border border-base overflow-hidden">
      <div class="scroll-fade-x no-scrollbar flex gap-2 overflow-x-auto p-3">
        <span v-for="t in tags" :key="t" class="badge whitespace-nowrap">{{ t }}</span>
      </div>
    </div>`,
  }),
}

export const SingleEdge: Story = {
  name: 'Single edge (bottom only)',
  render: () => ({
    setup: () => ({ items }),
    template: `<div class="w-64 rounded-2xl border border-base overflow-hidden">
      <ul class="scroll-fade-b no-scrollbar max-h-56 overflow-y-auto p-2 text-sm">
        <li v-for="i in items" :key="i" class="px-2 py-1.5">{{ i }}</li>
      </ul>
    </div>`,
  }),
}

export const FadeSize: Story = {
  render: () => ({
    setup: () => ({ items }),
    template: `<div class="flex gap-6">
      <ul class="scroll-fade scroll-fade-4 no-scrollbar w-44 max-h-56 overflow-y-auto p-2 text-sm border border-base rounded-xl">
        <li v-for="i in items" :key="i" class="px-2 py-1">{{ i }}</li>
      </ul>
      <ul class="scroll-fade scroll-fade-24 no-scrollbar w-44 max-h-56 overflow-y-auto p-2 text-sm border border-base rounded-xl">
        <li v-for="i in items" :key="i" class="px-2 py-1">{{ i }}</li>
      </ul>
    </div>`,
  }),
}

export const Disabled: Story = {
  name: 'Disabled (md:scroll-fade-none)',
  render: () => ({
    setup: () => ({ items }),
    template: `<ul class="scroll-fade md:scroll-fade-none no-scrollbar w-64 max-h-56 overflow-y-auto p-2 text-sm border border-base rounded-xl">
      <li v-for="i in items" :key="i" class="px-2 py-1.5">{{ i }}</li>
    </ul>`,
  }),
}
