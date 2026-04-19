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

const vocabularyIndividualAge = useVocabularyStore(
  '/api/vocabulary/individual/age',
)
const vocabularyIndividualSex = useVocabularyStore(
  '/api/vocabulary/individual/sex',
)
</script>

<template>
  <data-item-info-box
    v-if="isValidIri(iri)"
    :iri
    path="/api/data/individuals/{id}"
    :read-link
    data-testid="data-item-info-box-individual"
  >
    <template #activator="props">
      <slot v-bind="{ props }" />
    </template>
    <template #default="{ item }">
      <v-container v-if="item">
        <data-item-info-box-row
          label="site"
          :text="item.stratigraphicUnit?.site?.name"
        />
        <data-item-info-box-row
          label="SU"
          :text="item.stratigraphicUnit?.code"
        />
        <data-item-info-box-row label="identifier" :text="item.identifier" />
        <data-item-info-box-row
          label="sex"
          :text="vocabularyIndividualSex.getValue(item.sex).value"
        />
        <data-item-info-box-row
          label="age"
          :text="vocabularyIndividualAge.getValue(item.age).value"
        />
        <data-item-info-box-row label="notes" :text="item.notes" />
      </v-container>
    </template>
  </data-item-info-box>
</template>
