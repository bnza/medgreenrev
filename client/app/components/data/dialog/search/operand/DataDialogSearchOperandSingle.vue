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
    <v-text-field
      v-model="r$.$value.operand"
      data-testid="search-operand-single"
      label="value"
      :error-messages="r$.operand.$errors"
      :readonly
      :variant
      flat
    />
  </v-col>
</template>
