<script setup lang="ts">
import { ComboboxAnchor, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxPortal, ComboboxRoot, ComboboxViewport } from 'reka-ui'

export interface ComboboxOption {
  value: string
  label?: string
  disabled?: boolean
}

withDefaults(
  defineProps<{
    /** Selectable options. `label` falls back to `value`; `disabled` blocks selection. */
    options: ComboboxOption[]
    /** Placeholder shown in the search input while empty. */
    placeholder?: string
    /** Disable the whole combobox. */
    disabled?: boolean
  }>(),
  {},
)

/** The selected option's `value`. */
const model = defineModel<string>()

// reka-ui filters items by their `textValue` against the typed query, so we
// surface the visible label as the search text — this keeps filtering correct
// even when the `#option` slot customises rendering.
function optionLabel(option: ComboboxOption) {
  return option.label ?? option.value
}
</script>

<template>
  <ComboboxRoot v-model="model" :disabled="disabled">
    <ComboboxAnchor
      class="text-sm px-2 border border-base rounded bg-base inline-flex gap-2 h-9 min-w-40 transition items-center data-[disabled]:op50 data-[disabled]:pointer-events-none focus-within:ring-2 focus-within:ring-primary-500/40"
    >
      <svg width="1em" height="1em" viewBox="0 0 24 24" class="op-fade shrink-0" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21l-4.3-4.3" />
        </g>
      </svg>
      <ComboboxInput
        :placeholder="placeholder ?? 'Search…'"
        class="color-base outline-none bg-transparent flex-1 min-w-0 placeholder:op-mute"
      />
    </ComboboxAnchor>
    <ComboboxPortal>
      <ComboboxContent
        position="popper"
        :side-offset="6"
        class="p-1 border border-base rounded-lg bg-base min-w-[--reka-combobox-trigger-width] shadow-lg z-dropdown"
        data-af-animate
      >
        <ComboboxViewport>
          <ComboboxItem
            v-for="opt in options"
            :key="opt.value"
            :value="opt.value"
            :text-value="optionLabel(opt)"
            :disabled="opt.disabled"
            class="text-sm color-base px-2 py-1.5 outline-none rounded-md flex gap-2 cursor-pointer select-none transition items-center data-[highlighted]:bg-active data-[disabled]:op50 data-[disabled]:pointer-events-none"
          >
            <span class="flex-1">
              <slot name="option" :option="opt">{{ optionLabel(opt) }}</slot>
            </span>
            <ComboboxItemIndicator class="color-active inline-flex shrink-0 items-center">
              <svg width="0.85em" height="0.85em" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5" />
              </svg>
            </ComboboxItemIndicator>
          </ComboboxItem>
          <ComboboxEmpty class="text-sm px-2 py-1.5 text-center op-fade">
            <slot name="empty">
              No results
            </slot>
          </ComboboxEmpty>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
