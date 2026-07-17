<!-- @description formatted numbers (`Intl`), mono + tabular, `prefix`/`suffix`. -->
<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber } from '../../utils/format'

const props = withDefaults(
  defineProps<{
    value: number
    prefix?: string
    suffix?: string
    /** Forwarded to `Intl.NumberFormat`. */
    options?: Intl.NumberFormatOptions
    mono?: boolean
  }>(),
  { mono: true },
)

const formatted = computed(() => formatNumber(props.value, props.options))
</script>

<template>
  <span :class="{ 'font-mono tabular-nums': mono }">
    <span v-if="prefix" class="op-fade">{{ prefix }}</span>{{ formatted }}<span v-if="suffix" class="text-xs ml-0.5 op-fade">{{ suffix }}</span>
  </span>
</template>
