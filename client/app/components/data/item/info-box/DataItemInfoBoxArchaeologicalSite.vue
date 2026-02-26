<script setup lang="ts">
import DataItemInfoBoxContentArchaeologicalSite from '~/components/data/item/info-box/content/DataItemInfoBoxContentArchaeologicalSite.vue'

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
    path="/api/data/archaeological_sites/{id}"
    :read-link
    data-testid="data-item-info-box-archaeological-site"
  >
    <template #activator="props">
      <slot v-bind="{ props }" />
    </template>
    <template #default="{ item }">
      <data-item-info-box-content-archaeological-site :item />
    </template>
  </data-item-info-box>
</template>
