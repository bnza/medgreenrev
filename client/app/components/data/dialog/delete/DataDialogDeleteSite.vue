<script lang="ts" setup>
defineEmits<{
  refresh: []
}>()
</script>
<template>
  <data-dialog-delete path="/api/data/sites/{id}" @refresh="$emit('refresh')">
    <template #default="{ item }">
      <lazy-data-item-form-info-site :item :read-link="false" />
    </template>
  </data-dialog-delete>
</template>
