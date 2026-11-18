import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { AgentControlSnapshot, AgentStepResult } from '../../composables/agent'
import { defineComponent, nextTick, onMounted, ref, shallowRef } from 'vue'
import { createAgent, getChangeSource, provideAgent } from '../../composables/agent'
import ActionButton from '../Action/ActionButton.vue'
import FormField from '../Form/FormField.vue'
import FormNumberInput from '../Form/FormNumberInput.vue'
import FormSegmentedControl from '../Form/FormSegmentedControl.vue'
import FormSelect from '../Form/FormSelect.vue'
import FormSwitch from '../Form/FormSwitch.vue'
import FormTextInput from '../Form/FormTextInput.vue'

// An agent fills in a settings form through the bridge: no screenshots, no
// clicks. The right pane is exactly what `agent.snapshot()` hands the model.

const sampleSteps = [
  { ref: 'Project name', action: 'setValue', args: ['Atlas'] },
  { ref: 'Region', action: 'setValue', args: ['eu'] },
  { ref: 'Replicas', action: 'increment' },
  { ref: 'Visibility', action: 'setValue', args: ['public'] },
  { ref: 'Notifications', action: 'toggle' },
]

const Demo = defineComponent({
  components: { ActionButton, FormField, FormNumberInput, FormSegmentedControl, FormSelect, FormSwitch, FormTextInput },
  setup() {
    const agent = createAgent({
      // Example guard: the agent may never turn the project private.
      allow: step => !(step.ref === 'Visibility' && step.args?.[0] === 'private'),
    })
    provideAgent(agent)

    const name = ref('Apollo')
    const region = ref('us')
    const replicas = ref(2)
    const visibility = ref('internal')
    const notify = ref(false)
    const lastSource = ref('—')
    const snapshot = shallowRef<AgentControlSnapshot[]>([])
    const results = shallowRef<AgentStepResult[]>([])

    const refresh = (): void => {
      snapshot.value = agent.snapshot()
    }
    const track = (): void => {
      lastSource.value = getChangeSource()
    }
    onMounted(() => nextTick(refresh))

    async function run(steps = sampleSteps): Promise<void> {
      const out = await agent.act({ steps })
      results.value = out.results
      snapshot.value = out.snapshot
    }

    return {
      name,
      region,
      replicas,
      visibility,
      notify,
      lastSource,
      snapshot,
      results,
      refresh,
      track,
      run,
      regions: [{ value: 'us', label: 'US East' }, { value: 'eu', label: 'EU West' }, { value: 'ap', label: 'Asia Pacific', disabled: true }],
      visibilities: [{ value: 'private' }, { value: 'internal' }, { value: 'public' }],
      forbidden: [{ ref: 'Visibility', action: 'setValue', args: ['private'] }],
    }
  },
  template: `<div class="grid grid-cols-2 gap-4 w-200 font-sans color-base">
    <div class="p-4 border border-base rounded-lg bg-base flex flex-col gap-3">
      <FormField label="Project name"><FormTextInput v-model="name" @update:model-value="track" /></FormField>
      <FormField label="Region"><FormSelect v-model="region" :options="regions" @update:model-value="track" /></FormField>
      <FormField label="Replicas"><FormNumberInput v-model="replicas" :min="1" :max="5" @update:model-value="track" /></FormField>
      <FormField label="Visibility"><FormSegmentedControl v-model="visibility" :options="visibilities" @update:model-value="track" /></FormField>
      <FormSwitch v-model="notify" label="Notifications" @update:model-value="track" />
      <p class="text-sm color-muted">Last change by: <span class="font-mono color-base">{{ lastSource }}</span></p>
      <div class="flex gap-2 flex-wrap">
        <ActionButton icon="i-ph:robot" @click="run()">Run agent steps</ActionButton>
        <ActionButton variant="text" icon="i-ph:prohibit" @click="run(forbidden)">Try a forbidden step</ActionButton>
        <ActionButton variant="text" icon="i-ph:arrows-clockwise" @click="refresh">Refresh snapshot</ActionButton>
      </div>
    </div>
    <div class="p-4 border border-base rounded-lg bg-sunken flex flex-col gap-3 min-w-0">
      <p class="text-sm font-medium">agent.snapshot()</p>
      <pre class="text-xs font-mono color-muted overflow-auto max-h-80">{{ JSON.stringify(snapshot, null, 2) }}</pre>
      <template v-if="results.length">
        <p class="text-sm font-medium">act() results</p>
        <ul class="text-xs font-mono flex flex-col gap-1">
          <li v-for="(r, i) in results" :key="i" class="flex gap-2 items-center">
            <span :class="r.ok ? 'i-ph:check-circle text-green-600 dark:text-green-400' : 'i-ph:x-circle text-red-600 dark:text-red-400'" aria-hidden="true" />
            <span>{{ r.step.ref }} · {{ r.step.action }}</span>
            <span v-if="r.error" class="color-faint">{{ r.error }}</span>
          </li>
        </ul>
      </template>
    </div>
  </div>`,
})

const meta = {
  title: 'Utilities/AgentBridge',
  component: Demo,
  tags: ['autodocs'],
} satisfies Meta<typeof Demo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
