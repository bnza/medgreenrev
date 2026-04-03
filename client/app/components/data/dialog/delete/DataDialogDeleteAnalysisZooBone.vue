<script setup lang="ts">
defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete
    path="/api/data/analyses/zoo/bones/{id}"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-analysis-zoo-bone :item :read-link="false" />
    </template>
  </data-dialog-delete>
</template>
