<script setup lang="ts">
import type { Iri } from '~~/types'

definePageMeta({
  public: true,
})

const { id } = useRoute().params
</script>

<template>
  <data-collection-page-sampling-stratigraphic-unit
    path="/api/data/sampling_sites/{parentId}/stratigraphic_units"
    filter-path="/api/data/sampling_stratigraphic_units"
    :parent="{
      key: 'samplingSite',
      item: {
        '@type': 'samplingSite',
        '@id': `/api/data/sampling_sites/${id}` as Iri,
      },
    }"
  />
</template>
