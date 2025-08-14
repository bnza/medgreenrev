<script setup lang="ts">
import { useRegle } from '@regle/core'
import { required } from '@regle/rules'

const props = withDefaults(defineProps<{ readonly?: boolean }>(), {
  readonly: false,
})

const variant = computed(() => (props.readonly ? 'solo-filled' : 'underlined'))

const operands = defineModel<any[]>({
  required: true,
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

const operand = computed({
  get() {
    return operands.value[0]
  },
  set(value) {
    operands.value = [value]
  },
})

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
    <data-autocomplete-stratigraphic-unit
      v-model="operand"
      item-title="code"
      path="/api/data/stratigraphic_units"
      :readonly
      :variant
      label="values"
      flat
    />
  </v-col>
</template>
