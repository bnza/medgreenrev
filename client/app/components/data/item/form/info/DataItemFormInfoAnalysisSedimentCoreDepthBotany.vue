<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'
withDefaults(
  defineProps<{
    item: GetItemResponseMap['/api/data/analyses/sediment_core_depths/botany/{id}']
    readLink?: boolean
  }>(),
  {
    readLink: true,
  },
)
</script>
<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="6">
        <data-autocomplete
          :model-value="item.subject?.['@id']"
          path="/api/data/sediment_core_depths"
          item-title="code"
          label="subject"
          disabled
        />
      </v-col>
      <v-col cols="6" class="px-2">
        <data-autocomplete-analysis
          :model-value="item.analysis?.['@id']"
          disabled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="px-2">
        <v-textarea :model-value="item.summary" label="summary" disabled />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
