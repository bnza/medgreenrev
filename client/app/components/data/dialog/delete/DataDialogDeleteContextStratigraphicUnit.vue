<script lang="ts" setup>
defineEmits<{
  refresh: []
}>()
</script>

<template>
  <data-dialog-delete
    path="/api/data/context_stratigraphic_units/{id}"
    @refresh="$emit('refresh')"
  >
    <template #default="{ item }">
      <lazy-data-item-form-info-context-stratigraphic-unit
        :item
        :read-link="false"
      />
    </template>
  </data-dialog-delete>
</template>
