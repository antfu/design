<script setup lang="ts">
import type { FileIconRule } from '../../utils/icon'
import { computed } from 'vue'
import { getFileType } from '../../utils/icon'

const props = defineProps<{
  /** File path or module id. */
  path: string
  /** Override the default (catppuccin) rule list. */
  rules?: FileIconRule[]
}>()

const type = computed(() => getFileType(props.path, props.rules))
</script>

<template>
  <span :class="type.icon" :title="type.name" aria-hidden="true" />
</template>
