import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { createApp, defineComponent, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useToast } from '../../composables/toast'
import ActionButton from '../Action/ActionButton.vue'
import FeedbackToasts from '../Feedback/FeedbackToasts.vue'
import FormCombobox from '../Form/FormCombobox.vue'
import FormSelect from '../Form/FormSelect.vue'
import LayoutMenubar from '../Layout/LayoutMenubar.vue'
import OverlayConfirm from '../Overlay/OverlayConfirm.vue'
import OverlayContextMenu from '../Overlay/OverlayContextMenu.vue'
import OverlayContextMenuItem from '../Overlay/OverlayContextMenuItem.vue'
import OverlayDrawer from '../Overlay/OverlayDrawer.vue'
import OverlayDropdown from '../Overlay/OverlayDropdown.vue'
import OverlayDropdownItem from '../Overlay/OverlayDropdownItem.vue'
import OverlayDropdownSub from '../Overlay/OverlayDropdownSub.vue'
import OverlayHoverCard from '../Overlay/OverlayHoverCard.vue'
import OverlayModal from '../Overlay/OverlayModal.vue'

// Every component that portals content (selects, menus, dialogs, toasts) must
// keep it inside the shadow root that holds the stylesheet. This mounts them
// all in one, the way a devtools overlay built with `defineCustomElement` would.

const options = ['TypeScript', 'Vue', 'UnoCSS', 'Vite'].map(value => ({ value }))
const menus = [
  { value: 'file', label: 'File', items: [{ value: 'new', label: 'New', shortcut: 'mod+n' }, { value: 'open', label: 'Open…', shortcut: 'mod+o' }] },
  { value: 'edit', label: 'Edit', items: [{ value: 'undo', label: 'Undo', shortcut: 'mod+z' }, { value: 'redo', label: 'Redo', shortcut: 'mod+shift+z' }] },
]

const Embedded = defineComponent({
  components: {
    ActionButton,
    FeedbackToasts,
    FormCombobox,
    FormSelect,
    LayoutMenubar,
    OverlayConfirm,
    OverlayContextMenu,
    OverlayContextMenuItem,
    OverlayDrawer,
    OverlayDropdown,
    OverlayDropdownItem,
    OverlayDropdownSub,
    OverlayHoverCard,
    OverlayModal,
  },
  setup() {
    const toast = useToast()
    return { options, menus, toast, selected: ref('Vue'), searched: ref<string>() }
  },
  template: `<div class="p-4 border border-base rounded-lg bg-base color-base flex flex-col gap-4 w-120 font-sans">
    <LayoutMenubar :menus="menus" @select="(m, i) => toast.info(m + ' › ' + i)" />
    <div class="flex gap-2 flex-wrap items-center">
      <FormSelect v-model="selected" :options="options" />
      <FormCombobox v-model="searched" :options="options" placeholder="Search…" />
    </div>
    <div class="flex gap-2 flex-wrap items-center">
      <OverlayDropdown>
        <template #trigger><ActionButton icon="i-ph:gear">Dropdown</ActionButton></template>
        <OverlayDropdownItem icon="i-ph:folder">Open</OverlayDropdownItem>
        <OverlayDropdownSub label="Share" icon="i-ph:share-network">
          <OverlayDropdownItem icon="i-ph:link">Copy link</OverlayDropdownItem>
          <OverlayDropdownItem icon="i-ph:envelope">Email</OverlayDropdownItem>
        </OverlayDropdownSub>
        <OverlayDropdownItem icon="i-ph:trash" variant="danger">Delete</OverlayDropdownItem>
      </OverlayDropdown>
      <OverlayHoverCard>
        <template #trigger><ActionButton variant="text" icon="i-ph:info">Hover card</ActionButton></template>
        Rendered inside the shadow root, so the glass surface and border tokens apply.
      </OverlayHoverCard>
      <OverlayModal title="Modal" description="Teleported into the shadow root.">
        <template #trigger><ActionButton>Modal</ActionButton></template>
        <p class="text-sm color-muted">Scheme, surface and border tokens all resolve here.</p>
      </OverlayModal>
      <OverlayDrawer title="Drawer">
        <template #trigger><ActionButton>Drawer</ActionButton></template>
        <p class="text-sm color-muted">Slides in over the host page, styled from the root's sheet.</p>
      </OverlayDrawer>
      <OverlayConfirm title="Delete project?" description="This cannot be undone." variant="danger" confirm-label="Delete" @confirm="toast.error('Deleted')">
        <template #trigger><ActionButton variant="text" icon="i-ph:trash">Confirm</ActionButton></template>
      </OverlayConfirm>
      <ActionButton variant="text" icon="i-ph:bell" @click="toast.success('Saved', { icon: 'i-ph:check-circle' })">Toast</ActionButton>
    </div>
    <OverlayContextMenu>
      <template #trigger>
        <div class="h-20 grid place-items-center border border-base rounded-lg border-dashed color-faint text-sm select-none">Right-click here</div>
      </template>
      <OverlayContextMenuItem icon="i-ph:copy" shortcut="mod+c">Copy</OverlayContextMenuItem>
      <OverlayContextMenuItem icon="i-ph:scissors" shortcut="mod+x">Cut</OverlayContextMenuItem>
      <OverlayContextMenuItem icon="i-ph:trash" variant="danger" shortcut="del">Delete</OverlayContextMenuItem>
    </OverlayContextMenu>
    <FeedbackToasts :items="toast.toasts.value" @dismiss="toast.dismiss" />
  </div>`,
})

// The raw CSS source, not CSSOM `cssText`: Chromium serializes shorthands
// holding `var()` (the icon `mask`) as empty, which would break every icon.
async function documentCss(): Promise<string> {
  const sources = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'), el =>
    el instanceof HTMLLinkElement ? fetch(el.href).then(r => r.text()) : el.textContent ?? '')
  return (await Promise.all(sources)).join('\n')
}

/** Mounts {@link Embedded} in a shadow root, with the document's sheets injected the way `defineCustomElement({ styles })` would. */
const ShadowHost = defineComponent({
  props: { dark: Boolean },
  setup(props) {
    const host = ref<HTMLElement>()
    const app = createApp(Embedded)

    // The scheme wrapper the README asks for: the class on an ancestor, the
    // surface utilities on its child.
    const wrapper = document.createElement('div')
    wrapper.style.display = 'contents'
    watch(() => props.dark, (dark) => {
      wrapper.className = dark ? 'dark' : 'light'
    }, { immediate: true })

    onMounted(async () => {
      const shadow = host.value!.attachShadow({ mode: 'open' })
      const style = document.createElement('style')
      style.textContent = await documentCss()
      shadow.append(style, wrapper)
      app.mount(wrapper)
    })
    onBeforeUnmount(() => app.unmount())
    return () => h('div', { ref: host })
  },
})

const meta = {
  title: 'Utilities/ShadowRoot',
  component: ShadowHost,
  tags: ['autodocs'],
} satisfies Meta<typeof ShadowHost>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (_, { globals }) => ({
    components: { ShadowHost },
    setup: () => ({ dark: globals.theme === 'dark' }),
    template: `<ShadowHost :dark="dark" />`,
  }),
}
