<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { GetItemResponseMap } from '~~/types'

const path = '/api/data/analyses/contexts/zoo/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(
  useResourceUiStore('/api/data/analyses/contexts/zoo/{id}'),
)
</script>

<template>
  <data-item-page
    :path
    title="Zooarchaoelogical context analysis"
    identifier-prop="id"
  >
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-context-zoo-pottery-analysis :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="taxonomies">taxonomies</v-tab>
        <v-tab value="document">document</v-tab>
        <v-tab value="rawData">raw data</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="taxonomies" data-testid="tab-taxonomies">
          <data-taxonomy-table :items="item.taxonomies" />
        </v-tabs-window-item>
        <v-tabs-window-item value="document" data-testid="tab-document">
          <data-item-form-info-media-object
            v-if="item.document"
            :item="item.document"
          />
          <resource-not-found
            v-else
            title="No media"
            error="No media found for this resource"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="rawData" data-testid="tab-raw-data">
          <data-item-form-info-media-object
            v-if="item.rawData"
            :item="item.rawData"
          />
          <resource-not-found
            v-else
            title="No media"
            error="No media found for this resource"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
