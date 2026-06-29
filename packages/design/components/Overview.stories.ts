import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import ActionButton from './Action/ActionButton.vue'
import ActionDarkToggle from './Action/ActionDarkToggle.vue'
import ActionIconButton from './Action/ActionIconButton.vue'
import ActionToggle from './Action/ActionToggle.vue'
import ActionToggleGroup from './Action/ActionToggleGroup.vue'
import DisplayAvatar from './Display/DisplayAvatar.vue'
import DisplayBadge from './Display/DisplayBadge.vue'
import DisplayBytes from './Display/DisplayBytes.vue'
import DisplayDonut from './Display/DisplayDonut.vue'
import DisplayDuration from './Display/DisplayDuration.vue'
import DisplayKbd from './Display/DisplayKbd.vue'
import DisplayLabel from './Display/DisplayLabel.vue'
import DisplayNumber from './Display/DisplayNumber.vue'
import DisplayProgressBar from './Display/DisplayProgressBar.vue'
import DisplayStatusPill from './Display/DisplayStatusPill.vue'
import DisplayVersion from './Display/DisplayVersion.vue'
import FeedbackEmptyState from './Feedback/FeedbackEmptyState.vue'
import FeedbackLoading from './Feedback/FeedbackLoading.vue'
import FeedbackSkeleton from './Feedback/FeedbackSkeleton.vue'
import FeedbackSpinner from './Feedback/FeedbackSpinner.vue'
import FeedbackTip from './Feedback/FeedbackTip.vue'
import FormCheckbox from './Form/FormCheckbox.vue'
import FormNumberInput from './Form/FormNumberInput.vue'
import FormRadioGroup from './Form/FormRadioGroup.vue'
import FormSearchField from './Form/FormSearchField.vue'
import FormSelect from './Form/FormSelect.vue'
import FormSlider from './Form/FormSlider.vue'
import FormSwitch from './Form/FormSwitch.vue'
import FormTextInput from './Form/FormTextInput.vue'
import LayoutAccordion from './Layout/LayoutAccordion.vue'
import LayoutBreadcrumb from './Layout/LayoutBreadcrumb.vue'
import LayoutCard from './Layout/LayoutCard.vue'
import LayoutMenubar from './Layout/LayoutMenubar.vue'
import LayoutPagination from './Layout/LayoutPagination.vue'
import LayoutScrollArea from './Layout/LayoutScrollArea.vue'
import LayoutSeparator from './Layout/LayoutSeparator.vue'
import LayoutTabs from './Layout/LayoutTabs.vue'
import OverlayConfirm from './Overlay/OverlayConfirm.vue'
import OverlayContextMenu from './Overlay/OverlayContextMenu.vue'
import OverlayContextMenuItem from './Overlay/OverlayContextMenuItem.vue'
import OverlayDropdown from './Overlay/OverlayDropdown.vue'
import OverlayDropdownItem from './Overlay/OverlayDropdownItem.vue'
import OverlayHoverCard from './Overlay/OverlayHoverCard.vue'
import OverlayModal from './Overlay/OverlayModal.vue'
import OverlayTooltip from './Overlay/OverlayTooltip.vue'

const Sec = {
  props: ['t'],
  template: `<section><h3 class="text-micro color-faint tracking-wide font-medium mb-3 uppercase">{{ t }}</h3><div class="flex flex-wrap gap-4 items-center"><slot /></div></section>`,
}

const components = {
  Sec,
  ActionButton,
  ActionIconButton,
  ActionDarkToggle,
  ActionToggle,
  ActionToggleGroup,
  DisplayBadge,
  DisplayNumber,
  DisplayBytes,
  DisplayDuration,
  DisplayVersion,
  DisplayKbd,
  DisplayLabel,
  DisplayStatusPill,
  DisplayAvatar,
  DisplayDonut,
  DisplayProgressBar,
  FormTextInput,
  FormSearchField,
  FormNumberInput,
  FormSelect,
  FormSlider,
  FormCheckbox,
  FormSwitch,
  FormRadioGroup,
  FeedbackSpinner,
  FeedbackLoading,
  FeedbackSkeleton,
  FeedbackTip,
  FeedbackEmptyState,
  LayoutCard,
  LayoutSeparator,
  LayoutAccordion,
  LayoutTabs,
  LayoutBreadcrumb,
  LayoutPagination,
  LayoutScrollArea,
  LayoutMenubar,
  OverlayTooltip,
  OverlayDropdown,
  OverlayDropdownItem,
  OverlayContextMenu,
  OverlayContextMenuItem,
  OverlayModal,
  OverlayConfirm,
  OverlayHoverCard,
}

const meta = {
  title: 'Overview/All Components',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  render: () => ({
    components,
    setup: () => ({
      view: ref('grid'),
      align: ref('left'),
      bold: ref(false),
      slider: ref(40),
      range: ref([20, 70]),
      check: ref(true),
      sw: ref(true),
      radio: ref('a'),
      sel: ref('vite'),
      page: ref(3),
      tab: ref('a'),
      viewOpts: [{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }],
      alignOpts: [{ value: 'left', icon: 'i-ph:text-align-left', label: 'Left' }, { value: 'center', icon: 'i-ph:text-align-center', label: 'Center' }, { value: 'right', icon: 'i-ph:text-align-right', label: 'Right' }],
      radioOpts: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }],
      selOpts: [{ value: 'vite', label: 'Vite' }, { value: 'nuxt', label: 'Nuxt' }],
      sections: [{ value: 'one', title: 'Section one', text: 'Collapsible content.' }, { value: 'two', title: 'Section two', text: 'More content.' }],
      crumbs: [{ label: 'Home', href: '#' }, { label: 'Components', href: '#' }, { label: 'Overview' }],
      tabs: [{ value: 'a', label: 'Overview' }, { value: 'b', label: 'Props', count: 8 }],
      menus: [{ value: 'file', label: 'File', items: [{ value: 'new', label: 'New', shortcut: 'mod+n' }, { value: 'open', label: 'Open' }] }, { value: 'edit', label: 'Edit', items: [{ value: 'undo', label: 'Undo' }] }],
    }),
    template: `<div class="p-8 bg-base color-base font-sans grid gap-10">
      <Sec t="Action"><ActionButton variant="primary">Primary</ActionButton><ActionButton icon="i-ph:gear">Action</ActionButton><ActionButton variant="text">Text</ActionButton><ActionButton loading>Loading</ActionButton><ActionIconButton icon="i-ph:heart" tooltip="Like" /><ActionDarkToggle /><ActionToggle v-model="bold" icon="i-ph:text-b" label="Bold" /><ActionToggleGroup v-model="view" :options="viewOpts" /></Sec>
      <Sec t="Display"><DisplayBadge color="green">stable</DisplayBadge><DisplayBadge>antfu</DisplayBadge><DisplayNumber :value="1234567" /><DisplayBytes :bytes="524288" /><DisplayDuration :ms="1500" colorize /><DisplayVersion version="1.2.3" /><DisplayKbd keys="mod+k" /><DisplayLabel text="bug" color="#e11d48" /><DisplayStatusPill status="success" label="Online" pulse /><DisplayAvatar name="Anthony Fu" :size="28" /><DisplayDonut :value="0.6" /><div class="w-32"><DisplayProgressBar :value="0.6" /></div></Sec>
      <Sec t="Form"><FormTextInput placeholder="Text" /><FormSearchField shortcut="mod+k" /><FormNumberInput :model-value="3" /><FormSelect v-model="sel" :options="selOpts" /><div class="w-40"><FormSlider v-model="slider" show-value /></div><div class="w-40"><FormSlider v-model="range" show-value /></div><FormCheckbox v-model="check" label="Accept" /><FormSwitch v-model="sw" label="On" /><FormRadioGroup v-model="radio" :options="radioOpts" orientation="horizontal" /></Sec>
      <Sec t="Feedback"><FeedbackSpinner /><FeedbackLoading text="Loading" /><FeedbackSkeleton :lines="2" width="120px" /><FeedbackTip type="warning">Heads up</FeedbackTip><FeedbackEmptyState title="Nothing here" /></Sec>
      <Sec t="Layout"><LayoutCard class="p-3 text-sm">Card</LayoutCard><div class="w-60"><LayoutSeparator label="or" /></div><LayoutAccordion :items="sections" class="w-60" /><LayoutTabs v-model="tab" :tabs="tabs" /><LayoutBreadcrumb :items="crumbs" /><LayoutPagination v-model:page="page" :total="120" /><div class="border border-base rounded h-24 w-40"><LayoutScrollArea><ul class="text-sm"><li v-for="n in 20" :key="n" class="px2 py1">Row {{ n }}</li></ul></LayoutScrollArea></div><LayoutMenubar :menus="menus" /></Sec>
      <Sec t="Overlay"><OverlayTooltip content="A tooltip"><ActionButton>Hover</ActionButton></OverlayTooltip><OverlayDropdown><template #trigger><ActionButton icon="i-ph:caret-down">Menu</ActionButton></template><OverlayDropdownItem icon="i-ph:pencil">Edit</OverlayDropdownItem></OverlayDropdown><OverlayContextMenu><template #trigger><div class="text-sm px3 py2 border border-base border-dashed rounded color-faint">Right-click</div></template><OverlayContextMenuItem icon="i-ph:copy">Copy</OverlayContextMenuItem></OverlayContextMenu><OverlayModal title="Modal"><template #trigger><ActionButton>Modal</ActionButton></template><p class="text-sm">Body</p></OverlayModal><OverlayConfirm title="Delete?" variant="danger" confirm-label="Delete"><template #trigger><ActionButton icon="i-ph:trash">Confirm</ActionButton></template></OverlayConfirm><OverlayHoverCard><template #trigger><a class="color-active underline">@antfu</a></template>Anthony Fu</OverlayHoverCard></Sec>
    </div>`,
  }),
}
