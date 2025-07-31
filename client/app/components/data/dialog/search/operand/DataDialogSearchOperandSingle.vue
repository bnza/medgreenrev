<script setup lang="ts">
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
</script>

<template>
  <v-text-field
    v-model="operand"
    data-testid="search-operand-single"
    label="value"
  />
</template>
