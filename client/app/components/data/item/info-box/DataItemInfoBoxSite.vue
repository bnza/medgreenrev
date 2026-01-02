<script setup lang="ts">
withDefaults(
  defineProps<{
    iri: string
    readLink?: boolean
  }>(),
  {
    readLink: true,
  },
)
</script>

<template>
  <data-item-info-box
    v-if="isValidIri(iri)"
    :iri
    path="/api/data/sites/{id}"
    :read-link
    data-testid="data-item-info-box-site"
  >
    <template #activator="props">
      <slot v-bind="{ props }" />
    </template>
    <template #default="{ item }">
      <data-item-info-box-content-site :item />
    </template>
  </data-item-info-box>
</template>
