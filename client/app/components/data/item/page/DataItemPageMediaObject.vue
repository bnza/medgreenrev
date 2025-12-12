<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { GetItemResponseMap } from '~~/types'

const path = '/api/data/media_objects/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(useResourceUiStore('/api/data/media_objects/{id}'))
</script>

<template>
  <data-item-page :path identifier-prop="originalFilename">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-media-object :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="data" data-testid="tab-window-data">
          <resource-not-found
            title="No details"
            error="No details for this resource"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
