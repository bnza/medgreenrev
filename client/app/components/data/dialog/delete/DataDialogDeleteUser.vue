<script lang="ts" setup>
defineEmits<{
  refresh: []
}>()
</script>
<template>
  <data-dialog-delete path="/api/admin/users/{id}" @refresh="$emit('refresh')">
    <template #default="{ item }">
      <lazy-data-item-form-info-user :item :read-link="false" />
    </template>
  </data-dialog-delete>
</template>
