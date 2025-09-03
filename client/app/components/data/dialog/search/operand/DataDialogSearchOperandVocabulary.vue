<script setup lang="ts">
import type { VocabularyGetCollectionPath } from '~~/types'
import { useRegle } from '@regle/core'
import { required, minLength, withMessage } from '@regle/rules'

const props = withDefaults(
  defineProps<{ path: VocabularyGetCollectionPath; readonly?: boolean }>(),
  {
    readonly: false,
  },
)

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
      notEmpty: withMessage(
        minLength(1),
        'At least one vocabulary must be selected.',
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
  <v-col cols="4">
    <data-selection-vocabulary
      v-model="operands"
      :path="path"
      :readonly
      :variant
      multiple
      label="values"
      flat
    />
  </v-col>
</template>
