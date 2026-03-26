<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { GetItemResponseMap } from '~~/types'

const path = '/api/data/paleoclimate_sampling_sites/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(
  useResourceUiStore(path, ['location', 'chronology']),
)

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="code">
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-paleoclimate-sampling-site :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <v-tab value="samples">samples</v-tab>
        <v-tab value="media">media</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="data" data-testid="tab-window-data">
          <data-item-form-detail-paleoclimate-sampling-site :item />
        </v-tabs-window-item>
        <v-tabs-window-item value="samples" data-testid="tab-window-sus">
          <data-collection-page-paleoclimate-sample
            path="/api/data/paleoclimate_sampling_sites/{parentId}/samples"
            :parent="{
              key: 'paleoclimateSamplingSite',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="media" data-testid="tab-media">
          <data-media-object-join-container
            path="/api/data/paleoclimate_sampling_sites/{parentId}/media_objects"
            post-path="/api/data/media_object_paleoclimate_sampling_sites"
            delete-path="/api/data/media_object_paleoclimate_sampling_sites/{id}"
            :parent-iri="item['@id']!"
            :can-update="Boolean(item._acl?.canUpdate)"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-sampling-site @refresh="redirectToCollectionPath()" />
      <data-dialog-update-sampling-site @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
