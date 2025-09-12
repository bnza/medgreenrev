<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { GetItemResponseMap } from '~~/types'

const path = '/api/data/analyses/zoo/teeth/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(
  useResourceUiStore('/api/data/analyses/zoo/teeth/{id}'),
)
</script>

<template>
  <data-item-page :path title="Animal tooth analysis" identifier-prop="id">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-zoo-tooth-analysis :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="element">element</v-tab>
        <v-tab value="document">document</v-tab>
        <v-tab value="rawData">raw data</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="element" data-testid="tab-document">
          <data-item-page-zoo-tooth v-if="item.item" :iri="item.item['@id']" />
          <loading-component v-else />
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
