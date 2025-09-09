<script setup lang="ts">
defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete
    path="/api/data/potteries/{id}"
    title="Potteries"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-pottery :item :read-link="false" />
    </template>
  </data-dialog-delete>
</template>
