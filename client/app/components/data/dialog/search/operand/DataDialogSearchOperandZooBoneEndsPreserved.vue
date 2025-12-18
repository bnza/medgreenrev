<script setup lang="ts">
import { required } from '@regle/rules'

const operands = defineModel<number[]>({ required: true })

const operand = computed({
  get() {
    return operands.value[0]
  },
  set(value) {
    operands.value = [value ?? 0]
  },
})

const valid = defineModel<boolean>('valid', {
  required: true,
})

const props = withDefaults(defineProps<{ readonly?: boolean }>(), {
  readonly: false,
})

const variant = computed(() => (props.readonly ? 'solo-filled' : 'underlined'))

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
  <data-selection-zoo-bone-ends-preserved
    v-model="operand"
    :readonly
    :variant
    :clearable="!readonly"
  />
</template>
