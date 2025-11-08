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
  <data-item-page :path identifier-prop="id">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-analysis-zoo-tooth :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="subject">subject</v-tab>
        <v-tab
          v-if="item.analysis?.type?.group === 'absolute dating'"
          value="absolute-dating"
          >absolute dating</v-tab
        >
        <v-tab value="media">media</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="subject" data-testid="tab-document">
          <data-item-page-zoo-tooth
            v-if="item.subject"
            :iri="item.subject['@id']"
          />
          <loading-component v-else />
        </v-tabs-window-item>
        <v-tabs-window-item
          v-if="item.analysis?.type?.group === 'absolute dating'"
          value="absolute-dating"
          data-testid="tab-absolute-dating"
        >
          <data-item-page-abs-dating-analysis
            resource-key="absDatingAnalysisZooTooth"
            :show-back-button="false"
          />
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
