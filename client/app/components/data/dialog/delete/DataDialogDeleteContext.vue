<script setup lang="ts">
defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete
    path="/api/data/contexts/{id}"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-context :item :read-link="false" />
    </template>
  </data-dialog-delete>
</template>
