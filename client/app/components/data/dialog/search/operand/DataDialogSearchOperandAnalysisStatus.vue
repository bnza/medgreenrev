<script setup lang="ts">
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

const model = ref<number>()

watch(model, (value) => {
  if (value) {
    operands.value = [value.toString()]
  }
})
</script>

<template>
  <data-selection-analysis-status
    v-model="model"
    :readonly
    :variant
    :clearable="!readonly"
  />
</template>
