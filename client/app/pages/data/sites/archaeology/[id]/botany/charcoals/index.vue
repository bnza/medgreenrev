<script setup lang="ts">
import type { Iri } from '~~/types'

definePageMeta({
  public: true,
})

const { id } = useRoute().params
</script>

<template>
  <data-collection-page-botany-charcoal
    path="/api/data/archaeological_sites/{parentId}/botany/charcoals"
    filter-path="/api/data/botany/charcoals"
    :parent="{
      key: 'archaeologicalSite',
      item: {
        '@type': 'archaeologicalSite',
        '@id': `/api/data/archaeological_sites/${id}` as Iri,
      },
    }"
  />
</template>
