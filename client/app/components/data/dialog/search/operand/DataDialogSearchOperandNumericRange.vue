<script setup lang="ts">
import { useRegle } from '@regle/core'
import { required } from '@regle/rules'

const props = withDefaults(
  defineProps<{
    readonly?: boolean
  }>(),
  {
    readonly: false,
  },
)

const variant = computed(() => (props.readonly ? 'solo-filled' : 'underlined'))

const operands = defineModel<any[]>({
  required: true,
})
const operand0 = computed({
  get() {
    return operands.value[0]
  },
  set(value) {
    operands.value[0] = value
  },
})
const operand1 = computed({
  get() {
    return operands.value[1]
  },
  set(value) {
    operands.value[1] = value
  },
})

const valid = defineModel<boolean>('valid', {
  required: true,
})

const { r$ } = useRegle(
  {
    operand0,
    operand1,
  },
  {
    operand0: {
      required,
      lessThanOrEqual: lessThanOrEqual(
        'Min value must be greater than or equal to max value.',
      )(() => operand1.value),
    },
    operand1: {
      required,
      greaterOrEqualThan: greaterThanOrEqual(
        'Max value must be less than or equal to min value.',
      )(() => operand0.value),
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
  <v-col cols="2">
    <v-text-field
      v-model="operand0"
      type="number"
      data-testid="search-operand0-single-range"
      label="min"
      :error-messages="r$.operand0.$errors"
      :readonly
      :variant
      flat
    />
  </v-col>
  <v-col cols="2">
    <v-text-field
      v-model="operand1"
      type="number"
      data-testid="search-operand1-single-range"
      label="max"
      :error-messages="r$.operand1.$errors"
      :readonly
      :variant
      flat
    />
  </v-col>
</template>
