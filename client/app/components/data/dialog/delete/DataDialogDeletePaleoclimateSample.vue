<script lang="ts" setup>
defineEmits<{
  refresh: []
}>()
</script>
<template>
  <data-dialog-delete
    path="/api/data/paleoclimate_samples/{id}"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-paleoclimate-sample :item :read-link="false" />
    </template>
  </data-dialog-delete>
</template>
