<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'
withDefaults(
  defineProps<{
    item: GetItemResponseMap['/api/data/analyses/sample_botany_taxonomies/{id}']
    readLink?: boolean
  }>(),
  {
    readLink: true,
  },
)
const vocabularyBotanyTaxonomy = useVocabularyStore(
  '/api/vocabulary/botany/taxonomies',
)
</script>
<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="6" class="px-2">
        <data-autocomplete-analysis
          :model-value="item.analysis?.analysis"
          disabled
        />
      </v-col>
      <v-col cols="6" class="px-2">
        <data-autocomplete-sample
          :model-value="item.analysis?.subject"
          path="/api/data/samples"
          item-title="code"
          label="sample"
          :granted-only="true"
          disabled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1" class="px-2">
        <v-checkbox :model-value="item.type" label="type" />
      </v-col>
      <v-col cols="1" class="px-2">
        <v-checkbox :model-value="item.cf" label="cf" />
      </v-col>
      <v-col cols="6">
        <v-text-field
          :model-value="vocabularyBotanyTaxonomy.getValue(item.taxonomy)"
          disabled
          label="taxonomy"
        />
      </v-col>
      <v-col cols="1" class="px-2">
        <v-checkbox :model-value="item.sp" label="sp" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
