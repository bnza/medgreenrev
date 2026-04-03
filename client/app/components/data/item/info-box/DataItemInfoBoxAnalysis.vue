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

const vocabularyAnalysisTypesStore = useVocabularyStore(
  '/api/vocabulary/analysis/types',
)
</script>

<template>
  <data-item-info-box
    v-if="isValidIri(iri)"
    :iri
    path="/api/data/analyses/{id}"
    :read-link
    data-testid="data-item-info-box-analysis"
  >
    <template #activator="props">
      <slot v-bind="{ props }" />
    </template>
    <template #default="{ item }">
      <v-container v-if="item">
        <data-item-info-box-row
          label="group"
          :text="
            vocabularyAnalysisTypesStore.getValue(item.type?.['@id'], 'group')
              .value
          "
        />
        <data-item-info-box-row
          label="type"
          :text="
            vocabularyAnalysisTypesStore.getValue(item.type?.['@id']).value
          "
        />
        <data-item-info-box-row label="year" :text="item.year" />
        <data-item-info-box-row label="identifier" :text="item.identifier" />
        <data-item-info-box-row label="responsible" :text="item.responsible" />
        <data-item-info-box-row label="summary" :text="item.summary" />
      </v-container>
    </template>
  </data-item-info-box>
</template>
