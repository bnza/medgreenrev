<script setup lang="ts">
defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete
    path="/api/data/sediment_cores/{id}"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-sediment-core :item :read-link="false" />
    </template>
  </data-dialog-delete>
</template>
