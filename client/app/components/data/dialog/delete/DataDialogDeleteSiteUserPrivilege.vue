<script lang="ts" setup>
defineEmits<{
  refresh: []
}>()
</script>
<template>
  <data-dialog-delete
    path="/api/admin/site_user_privileges/{id}"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-site-user-privilege :item :read-link="false" />
    </template>
  </data-dialog-delete>
</template>
