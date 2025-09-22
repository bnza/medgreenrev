<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'
import type { GetItemResponseMap } from '~~/types'

const path = '/api/data/analyses/zoo/bones/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(
  useResourceUiStore('/api/data/analyses/zoo/bones/{id}'),
)
</script>

<template>
  <data-item-page :path title="Animal bone analysis" identifier-prop="id">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-analysis-zoo-bone :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="element">element</v-tab>
        <v-tab value="media">media</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="element" data-testid="tab-document">
          <data-item-page-zoo-bone
            v-if="item.subject"
            :iri="item.subject['@id']"
          />
          <loading-component v-else />
        </v-tabs-window-item>
        <v-tabs-window-item value="media" data-testid="tab-media">
          <data-media-object-join-container
            path="/api/data/analyses/{parentId}/media_objects"
            post-path="/api/data/media_object_analyses"
            delete-path="/api/data/media_object_analyses/{id}"
            :parent-iri="item.analysis?.['@id']!"
            :can-update="false"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
