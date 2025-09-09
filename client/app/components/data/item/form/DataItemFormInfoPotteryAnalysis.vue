<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

defineProps<{
  item: GetItemResponseMap['/api/data/analyses/potteries/{id}']
}>()
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="6" class="px-2">
        <v-text-field :model-value="item.pottery?.inventory" label="pottery" />
      </v-col>
      <v-col cols="6" class="px-2">
        <data-autocomplete-hierarchical-vocabulary
          path="/api/vocabulary/analysis/types"
          :model-value="item.type ?? undefined"
          label="type"
          item-title="value"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="px-2">
        <v-text-field :model-value="item.document?.mimeType" label="document" />
      </v-col>
      <v-col cols="6" class="px-2">
        <v-text-field :model-value="item.rawData?.mimeType" label="raw data" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="px-2">
        <v-textarea :model-value="item.summary" label="summary" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
