<!-- @description a native-feeling select bound with `v-model`. -->
<script setup lang="ts">
import { SelectContent, SelectIcon, SelectItem, SelectItemIndicator, SelectItemText, SelectPortal, SelectRoot, SelectTrigger, SelectValue, SelectViewport } from 'reka-ui'

export interface SelectOption {
  value: string
  label?: string
  disabled?: boolean
}

defineProps<{
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
}>()

const model = defineModel<string>()
</script>

<template>
  <SelectRoot v-model="model" :disabled="disabled">
    <SelectTrigger
      class="text-sm px-2.5 outline-none border border-base rounded bg-base inline-flex gap-2 h-9 min-w-40 transition items-center justify-between data-[disabled]:op50 data-[disabled]:pointer-events-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
    >
      <SelectValue :placeholder="placeholder ?? 'Select…'" />
      <SelectIcon class="op-fade">
        <span class="i-ph:caret-down" aria-hidden="true" />
      </SelectIcon>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        position="popper"
        :side-offset="6"
        class="border border-base rounded-lg bg-base min-w-[--reka-select-trigger-width] shadow-lg z-dropdown overflow-hidden"
      >
        <SelectViewport class="p-1">
          <SelectItem
            v-for="opt in options"
            :key="opt.value"
            :value="opt.value"
            :disabled="opt.disabled"
            class="text-sm color-base py-1.5 pl-7 pr-2 outline-none rounded-md flex gap-2 cursor-pointer select-none transition items-center relative data-[highlighted]:bg-hover data-[disabled]:op50 data-[disabled]:pointer-events-none"
          >
            <SelectItemIndicator class="color-active inline-flex items-center left-1.5 absolute">
              <span class="i-ph:check-bold" aria-hidden="true" />
            </SelectItemIndicator>
            <SelectItemText>{{ opt.label ?? opt.value }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
