<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { GetItemResponseMap } from '~~/types'

const path = '/api/data/analyses/botany/charcoals/{id}' as const

type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(useResourceUiStore(path))

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="id">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-analysis-botany-charcoal :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="subject">element</v-tab>
        <v-tab
          v-if="item.analysis?.type?.group === 'absolute dating'"
          value="absolute-dating"
          >absolute dating</v-tab
        >
        <v-tab value="media">media</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="subject" data-testid="tab-subject">
          <data-item-page-botany-charcoal
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
            resource-key="absDatingAnalysisBotanyCharcoal"
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
    <template #dialogs="{ refetch }">
      <data-dialog-delete-analysis-botany-charcoal
        @refresh="redirectToCollectionPath()"
      />
      <data-dialog-update-analysis-botany-charcoal @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
