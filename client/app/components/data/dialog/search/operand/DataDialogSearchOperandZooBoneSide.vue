<script setup lang="ts">
import { useRegle } from '@regle/core'
import { minLength, required, withMessage } from '@regle/rules'

const operands = defineModel<string[]>({ required: true })

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
      notEmpty: withMessage(
        minLength(1),
        'At least one value must be selected.',
      ),
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
  <data-selection-zoo-bone-side
    v-model="operands"
    :readonly
    :variant
    :clearable="!readonly"
    multiple
  />
</template>
