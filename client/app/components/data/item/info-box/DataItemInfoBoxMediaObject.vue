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

const vocabularyMediaObjectTypesStore = useVocabularyStore(
  '/api/vocabulary/media_object/types',
)
</script>

<template>
  <data-item-info-box
    v-if="isValidIri(iri)"
    :iri
    path="/api/data/media_objects/{id}"
    :read-link
    data-testid="data-item-info-box-media-object"
    :width="600"
  >
    <template #activator="props">
      <slot v-bind="{ props }" />
    </template>
    <template #default="{ item }">
      <v-container v-if="item">
        <v-row>
          <v-col cols="8">
            <data-item-info-box-row
              label="filename"
              :text="item.originalFilename"
            />
            <data-item-info-box-row label="mime type" :text="item.mimeType" />
            <data-item-info-box-row
              label="group"
              :text="
                vocabularyMediaObjectTypesStore.getValue(item.type, 'group')
                  .value
              "
            />
            <data-item-info-box-row
              label="type"
              :text="vocabularyMediaObjectTypesStore.getValue(item.type).value"
            />
            <data-item-info-box-row
              label="description"
              :text="item.description"
            />
          </v-col>
          <v-col cols="4">
            <data-media-object-image :item />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </data-item-info-box>
</template>
