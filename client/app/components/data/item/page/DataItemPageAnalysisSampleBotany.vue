<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { GetItemResponseMap } from '~~/types'

const path = '/api/data/analyses/samples/botany/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(useResourceUiStore(path))

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="id">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-analysis-sample-botany :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="analysis">analysis</v-tab>
        <v-tab value="sample">sample</v-tab>
        <v-tab value="taxonomies">taxonomies</v-tab>
        <v-tab value="media">media</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="analysis" data-testid="tab-item-analysis">
          <data-item-page-analysis
            v-if="item.analysis"
            :iri="item.analysis['@id']"
          />
          <loading-component v-else />
        </v-tabs-window-item>
        <v-tabs-window-item value="sample" data-testid="tab-item-sample">
          <data-item-page-sample
            v-if="item.subject"
            :iri="item.subject['@id']"
          />
          <loading-component v-else />
        </v-tabs-window-item>
        <v-tabs-window-item value="taxonomies" data-testid="tab-taxonomies">
          <data-collection-page-analysis-sample-botany-taxonomy
            path="/api/data/analyses/samples/botany/{parentId}/taxonomies"
            :parent="{
              key: 'analysisSampleBotany',
              item,
            }"
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
    <template #dialogs="{ refetch }">
      <data-dialog-delete-analysis-sample-botany
        @refresh="redirectToCollectionPath()"
      />
      <data-dialog-update-analysis-sample-botany @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
