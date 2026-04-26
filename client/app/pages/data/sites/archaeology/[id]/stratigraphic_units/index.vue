<script setup lang="ts">
import type { Iri } from '~~/types'

definePageMeta({
  public: true,
})

const { id } = useRoute().params
</script>

<template>
  <data-collection-page-stratigraphic-unit
    path="/api/data/archaeological_sites/{parentId}/stratigraphic_units"
    filter-path="/api/data/stratigraphic_units"
    :parent="{
      key: 'archaeologicalSite',
      item: {
        '@type': 'archaeologicalSite',
        '@id': `/api/data/archaeological_sites/${id}` as Iri,
      },
    }"
  />
</template>
