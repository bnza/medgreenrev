<script setup lang="ts">
defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete
    path="/api/data/analyses/zoo/bones/{id}"
    title="Animal bone analysis"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-zoo-bone-analysis :item />
    </template>
  </data-dialog-delete>
</template>
