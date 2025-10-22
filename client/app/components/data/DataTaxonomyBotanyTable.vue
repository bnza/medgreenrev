<script setup lang="ts">
import type {
  GetCollectionMemberResponseMap,
  ReadonlyHeaders,
  Iri,
} from '~~/types'

// Accept either full taxonomy members from the vocabulary collection
// or lightweight references containing only an '@id'.
// The component only uses '@id' to resolve full records from the store.

type TaxonomyRef = { '@id': Iri }

type TaxonomyItem =
  | GetCollectionMemberResponseMap['/api/vocabulary/botany/taxonomies']
  | TaxonomyRef

const props = defineProps<{
  items?: TaxonomyItem[]
}>()

const vocabularyBotanyTaxonomy = useVocabularyStore(
  '/api/vocabulary/botany/taxonomies',
)

const tableItems = computed(() =>
  props.items?.map((item) => vocabularyBotanyTaxonomy.get(item['@id']).value),
)

const headers: ReadonlyHeaders[] = [
  {
    key: 'value',
    value: 'value',
    title: 'taxonomy',
    minWidth: '200',
  },
  {
    key: 'class',
    value: 'class',
    title: 'class',
    minWidth: '100',
  },
  {
    key: 'family',
    value: 'family',
    title: 'family',
    minWidth: '100',
  },
  {
    key: 'vernacularName',
    value: 'vernacularName',
    title: 'vernacular name',
    minWidth: '200',
  },
]
</script>

<template>
  <v-data-table v-if="items" :items="tableItems" :headers />
  <resource-not-found
    v-else
    title="Taxonomies"
    error="No associated taxonomies"
    :back="false"
  />
</template>
