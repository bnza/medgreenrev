<script setup lang="ts">
import type { Iri } from '~~/types'

definePageMeta({
  public: true,
})

const { id } = useRoute().params
</script>

<template>
  <data-collection-page-individual
    path="/api/data/archaeological_sites/{parentId}/individuals"
    filter-path="/api/data/individuals"
    :parent="{
      key: 'archaeologicalSite',
      item: {
        '@type': 'archaeologicalSite',
        '@id': `/api/data/archaeological_sites/${id}` as Iri,
      },
    }"
  />
</template>
