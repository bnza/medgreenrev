<script lang="ts" setup>
defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete
    path="/api/data/sample_stratigraphic_units/{id}"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-sample-stratigraphic-unit :item />
    </template>
  </data-dialog-delete>
</template>
