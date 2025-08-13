<script lang="ts" setup>
defineEmits<{
  refresh: []
}>()
</script>
<template>
  <data-dialog-delete
    path="/api/data/stratigraphic_units/{id}"
    title="Stratigraphic Unit"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-stratigraphic-unit :item />
    </template>
  </data-dialog-delete>
</template>
