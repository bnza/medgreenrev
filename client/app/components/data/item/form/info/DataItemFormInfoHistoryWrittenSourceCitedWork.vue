<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

defineProps<{
  item: GetItemResponseMap['/api/data/history/written_sources_cited_works/{id}']
}>()
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="12" xs="12" sm="9" class="px-2">
        <data-autocomplete-written-source
          :model-value="item.writtenSource['@id']"
          label="written source"
          readonly
        />
      </v-col>
      <v-col cols="12" xs="12" sm="3" class="px-2">
        <data-autocomplete
          path="/api/vocabulary/history/cited_works"
          :model-value="item.citedWork['@id']"
          label="cited work"
          item-title="value"
          readonly
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="6" class="px-2">
        <v-text-field
          :model-value="item.yearCompleted"
          label="year completed"
        />
      </v-col>
      <v-col cols="12" xs="12" sm="6" class="px-2">
        <v-text-field
          :model-value="item.yearCompletedUpper"
          label="year completed (upper)"
        />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
