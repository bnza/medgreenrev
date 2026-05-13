<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

withDefaults(
  defineProps<{
    item: GetItemResponseMap['/api/data/history/animals/{id}']
    readLink?: boolean
  }>(),
  {
    readLink: true,
  },
)
const vocabularyZooTaxonomy = useVocabularyStore(
  '/api/vocabulary/zoo/taxonomies',
)
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.location?.value" label="location" />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="item.location?.region?.value"
          label="region"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8" xs="12" class="px-2">
        <v-text-field :model-value="item.language?.value" label="language" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8" xs="12" class="px-2">
        <v-text-field
          :model-value="item.animal"
          label="animal"
          hint="The term as it appears in the source"
          persistent-hint
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="
            vocabularyZooTaxonomy.getValue(item.taxonomy, 'englishName')
          "
          label="english name"
        />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="
            vocabularyZooTaxonomy.getValue(item.taxonomy, 'spanishName')
          "
          label="spanish name"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="item.chronologyLower"
          label="chronology (lower)"
        />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="item.chronologyUpper"
          label="chronology (upper)"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" class="px-2">
        <v-text-field :model-value="item.reference" label="reference" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" class="px-2">
        <v-textarea :model-value="item.notes" label="notes" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
