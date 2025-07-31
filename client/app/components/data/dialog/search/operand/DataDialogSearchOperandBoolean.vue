<script setup lang="ts">
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
</script>

<template>
  <v-checkbox
    v-model="operand"
    :indeterminate="'undefined' === typeof operand"
    :label
  />
</template>
