<script setup lang="ts">
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
</script>

<template>
  <v-text-field
    v-model="operand0"
    type="number"
    data-testid="search-operand0-single-range"
    label="value"
  />
  <v-text-field
    v-model="operand1"
    type="number"
    data-testid="search-operand1-single-range"
    label="value"
  />
</template>
