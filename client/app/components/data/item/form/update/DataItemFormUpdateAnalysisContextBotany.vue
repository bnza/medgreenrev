<script setup lang="ts">
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'

type Path = '/api/data/analyses/contexts/botany/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {})
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete
        :model-value="fetchedItem?.subject?.['@id']"
        path="/api/data/contexts"
        item-title="name"
        label="subject"
        granted-only
        disabled
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <data-autocomplete-analysis
        :model-value="fetchedItem?.analysis?.['@id']"
        disabled
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <data-selection-vocabulary
        v-model="r$.$value.taxonomies"
        multiple
        path="/api/vocabulary/botany/taxonomies"
        label="taxonomies"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <v-textarea v-model="r$.$value.summary" label="summary" />
    </v-col>
  </v-row>
</template>
