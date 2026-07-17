<script setup lang="ts">
import ActionButton from '@antfu/design/components/Action/ActionButton.vue'
import ActionIconButton from '@antfu/design/components/Action/ActionIconButton.vue'
import DisplayBadge from '@antfu/design/components/Display/DisplayBadge.vue'
import DisplayBytes from '@antfu/design/components/Display/DisplayBytes.vue'
import DisplayDuration from '@antfu/design/components/Display/DisplayDuration.vue'
import DisplayNumber from '@antfu/design/components/Display/DisplayNumber.vue'
import DisplayStatusPill from '@antfu/design/components/Display/DisplayStatusPill.vue'
import FeedbackEmptyState from '@antfu/design/components/Feedback/FeedbackEmptyState.vue'
import FormCheckbox from '@antfu/design/components/Form/FormCheckbox.vue'
import LayoutCard from '@antfu/design/components/Layout/LayoutCard.vue'
import LayoutTabs from '@antfu/design/components/Layout/LayoutTabs.vue'
import { computed, ref, watchEffect } from 'vue'

// The app owns the color scheme — the design package does not.
// There is no dark-toggle component; compose ActionIconButton with your own
// state (VueUse's `useDark` in a real app; a plain ref here to stay dep-light).
const colorScheme = ref<'light' | 'dark'>('light')
const isDark = computed(() => colorScheme.value === 'dark')
function toggleDark(): void {
  colorScheme.value = isDark.value ? 'light' : 'dark'
}
watchEffect(() => {
  document.documentElement.classList.toggle('dark', colorScheme.value === 'dark')
})

const checked = ref(true)
const tab = ref('overview')
const tabs = [
  { value: 'overview', label: 'Overview', count: 12 },
  { value: 'deps', label: 'Dependencies', count: 48 },
]
</script>

<template>
  <div class="color-base font-sans p-8 bg-base min-h-screen">
    <header class="mb-8 flex items-center justify-between">
      <h1 class="text-xl font-semibold">
        <span class="color-active">@antfu/design</span> playground
      </h1>
      <ActionIconButton
        :icon="isDark ? 'i-ph:sun-duotone' : 'i-ph:moon-duotone'"
        :tooltip="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleDark"
      />
    </header>

    <div class="gap-4 grid max-w-2xl" style="grid-template-columns: repeat(2, 1fr)">
      <LayoutCard>
        <div class="text-sm color-muted mb-2">
          Badges
        </div>
        <div class="flex flex-wrap gap-2">
          <DisplayBadge text="vue" :color-scheme="colorScheme" />
          <DisplayBadge text="unocss" :color-scheme="colorScheme" />
          <DisplayBadge text="esm" color="green" />
          <DisplayBadge text="solid" variant="solid" :color-scheme="colorScheme" />
        </div>
      </LayoutCard>

      <LayoutCard>
        <div class="text-sm color-muted mb-2">
          Buttons
        </div>
        <div class="flex gap-2 items-center">
          <ActionButton variant="primary">
            Save
          </ActionButton>
          <ActionButton>Cancel</ActionButton>
          <ActionButton :loading="true">
            Loading
          </ActionButton>
        </div>
      </LayoutCard>

      <LayoutCard>
        <div class="text-sm color-muted mb-2">
          Displays
        </div>
        <div class="flex flex-col gap-1">
          <DisplayNumber :value="1234567" />
          <DisplayBytes :bytes="2097152" colorize />
          <DisplayDuration :ms="1500" colorize />
        </div>
      </LayoutCard>

      <LayoutCard>
        <div class="text-sm color-muted mb-2">
          State
        </div>
        <div class="flex flex-col gap-2">
          <FormCheckbox v-model="checked" label="Enable telemetry" />
          <DisplayStatusPill status="success" label="Online" />
        </div>
      </LayoutCard>

      <LayoutCard class="col-span-2">
        <LayoutTabs v-model="tab" :tabs="tabs" />
        <div class="text-sm color-muted pt-3">
          Active tab: {{ tab }}
        </div>
      </LayoutCard>

      <LayoutCard class="col-span-2">
        <FeedbackEmptyState title="No results" icon="i-ph:folder">
          <template #hint>
            Try a different search term.
          </template>
        </FeedbackEmptyState>
      </LayoutCard>
    </div>
  </div>
</template>
