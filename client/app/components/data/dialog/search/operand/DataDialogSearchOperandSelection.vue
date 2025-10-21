<script setup lang="ts">
import type { ListGetCollectionPath } from '~~/types'
import { useRegle } from '@regle/core'
import { required } from '@regle/rules'

const props = withDefaults(
  defineProps<{ path: ListGetCollectionPath; readonly?: boolean }>(),
  {
    readonly: false,
  },
)

const variant = computed(() => (props.readonly ? 'solo-filled' : 'underlined'))

const operands = defineModel<any[]>({
  required: true,
})

const operand = computed({
  get() {
    return operands.value[0]
  },
  set(value) {
    operands.value = [value]
  },
})

const valid = defineModel<boolean>('valid', {
  required: true,
})

const { r$ } = useRegle(
  {
    operands,
  },
  {
    operands: {
      required,
    },
  },
)

watch(
  () => r$.$invalid,
  (value) => {
    valid.value = !value
  },
  { immediate: true },
)
</script>

<template>
  <v-col cols="4">
    <data-selection-list
      v-model="operand"
      :path
      :readonly
      :variant
      :combobox="false"
      label="value"
      flat
    />
  </v-col>
</template>
