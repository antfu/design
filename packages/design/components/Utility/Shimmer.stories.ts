import type { Meta, StoryObj } from '@storybook/vue3-vite'

// shimmer is a CSS utility, not a component. It sweeps over `currentColor`, so
// it adapts to any text color and brightens in dark mode. See the preset's
// `unocss/shimmer.ts` (ported from shadcn/ui).
const meta = {
  title: 'Utilities/Shimmer',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => ({
    template: `<p class="shimmer color-muted text-sm">Generating response…</p>`,
  }),
}

export const Color: Story = {
  render: () => ({
    template: `<div class="flex flex-col gap-2 text-sm">
      <p class="shimmer shimmer-color-blue-500/60">Generating response…</p>
      <p class="shimmer shimmer-color-[#378ADD]">Generating response…</p>
    </div>`,
  }),
}

export const Duration: Story = {
  render: () => ({
    template: `<div class="flex flex-col gap-2 text-sm color-muted">
      <p class="shimmer">shimmer</p>
      <p class="shimmer shimmer-duration-1000">shimmer-duration-1000</p>
    </div>`,
  }),
}

export const SpreadAndAngle: Story = {
  name: 'Spread & angle',
  render: () => ({
    template: `<div class="flex flex-col gap-2 text-sm color-muted">
      <p class="shimmer shimmer-spread-24">shimmer-spread-24</p>
      <p class="shimmer shimmer-angle-45">shimmer-angle-45</p>
    </div>`,
  }),
}

export const PlayOnce: Story = {
  render: () => ({
    template: `<p class="shimmer shimmer-once shimmer-duration-1100 color-muted text-sm">Plays one sweep</p>`,
  }),
}

export const Disabled: Story = {
  name: 'Disabled (md:shimmer-none)',
  render: () => ({
    template: `<p class="shimmer md:shimmer-none color-muted text-sm">shimmer · md:shimmer-none</p>`,
  }),
}
