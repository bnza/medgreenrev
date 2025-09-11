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

const vocabularyContextTypesStore = useVocabularyStore(
  '/api/vocabulary/context/types',
)
</script>

<template>
  <data-item-info-box
    v-if="isValidIri(iri)"
    :iri
    path="/api/data/contexts/{id}"
    title="Context"
    data-testid="data-item-info-box-pottery"
    :app-path="readLink ? '/data/contexts' : undefined"
  >
    <template #activator="props">
      <slot v-bind="{ props }" />
    </template>
    <template #default="{ item }">
      <v-container v-if="item">
        <data-item-info-box-row label="site" :text="item.site?.name" />
        <data-item-info-box-row label="name" :text="item.name" />
        <data-item-info-box-row
          label="group"
          :text="
            vocabularyContextTypesStore.getValue(item.type?.['@id'], 'group')
              .value
          "
        />
        <data-item-info-box-row
          label="type"
          :text="vocabularyContextTypesStore.getValue(item.type?.['@id']).value"
        />
        <data-item-info-box-row label="description" :text="item.description" />
      </v-container>
    </template>
  </data-item-info-box>
</template>
