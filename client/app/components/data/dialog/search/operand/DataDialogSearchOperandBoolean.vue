<script setup lang="ts">
import { useRegle } from '@regle/core'
import { required } from '@regle/rules'

withDefaults(
  defineProps<{
    readonly?: boolean
  }>(),
  {
    readonly: false,
  },
)

const operands = defineModel<any[]>({
  required: true,
})
const operand = computed({
  get() {
    return operands.value[0]
  },
  set(value) {
    operands.value = [Boolean(value)]
  },
})
const label = computed(() =>
  'undefined' === typeof operand.value ? 'no value' : String(operand.value),
)
const valid = defineModel<boolean>('valid', {
  required: true,
})

const { r$ } = useRegle(
  {
    operand,
  },
  {
    operand: { required },
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
    <v-checkbox
      v-model="r$.$value.operand"
      :indeterminate="'undefined' === typeof operand"
      :label
      :error-messages="r$.operand.$errors"
      :readonly="readonly"
      flat
    />
  </v-col>
</template>
