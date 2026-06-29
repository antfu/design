<script setup lang="ts">
import { MenubarContent, MenubarItem, MenubarMenu, MenubarPortal, MenubarRoot, MenubarSeparator, MenubarTrigger } from 'reka-ui'
import DisplayKbd from '../Display/DisplayKbd.vue'

export interface MenubarItemEntry {
  value: string
  label?: string
  icon?: string
  shortcut?: string
  disabled?: boolean
  variant?: 'default' | 'danger'
  /** Render a divider above this entry. */
  separator?: boolean
}
export interface MenubarMenuEntry {
  value: string
  label: string
  items: MenubarItemEntry[]
}

defineProps<{ menus: MenubarMenuEntry[] }>()
const emit = defineEmits<{ select: [menu: string, item: string] }>()
</script>

<template>
  <MenubarRoot class="p-1 border border-base rounded-lg bg-base flex gap-1 w-max">
    <MenubarMenu v-for="menu in menus" :key="menu.value" :value="menu.value">
      <MenubarTrigger class="text-sm px-2 py-1 outline-none rounded-md select-none data-[highlighted]:bg-active data-[state=open]:bg-active focus-visible:ring-2 focus-visible:ring-primary-500/40">
        {{ menu.label }}
      </MenubarTrigger>
      <MenubarPortal>
        <MenubarContent
          :side-offset="6"
          align="start"
          class="p-1 outline-none border border-base rounded-lg bg-base min-w-44 shadow-lg z-dropdown"
          data-af-animate
        >
          <template v-for="item in menu.items" :key="item.value">
            <MenubarSeparator v-if="item.separator" class="mx--1 my-1 border-t border-base" />
            <MenubarItem
              :disabled="item.disabled"
              class="text-sm px-2 py-1.5 outline-none rounded-md flex gap-2 cursor-pointer select-none transition items-center data-[highlighted]:bg-active data-[disabled]:op50 data-[disabled]:pointer-events-none"
              :class="item.variant === 'danger' ? 'text-red-600 dark:text-red-400 data-[highlighted]:bg-red-500/10' : 'color-base'"
              @select="emit('select', menu.value, item.value)"
            >
              <span v-if="item.icon" :class="item.icon" class="op-fade" aria-hidden="true" />
              <span class="flex-1">{{ item.label ?? item.value }}</span>
              <DisplayKbd v-if="item.shortcut" :keys="item.shortcut" class="op-fade" />
            </MenubarItem>
          </template>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  </MenubarRoot>
</template>
