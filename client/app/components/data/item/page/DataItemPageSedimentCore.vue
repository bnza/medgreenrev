<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { GetItemResponseMap, Iri } from '~~/types'

const path = '/api/data/sediment_cores/{id}' as const
type GetItemResponse = GetItemResponseMap[typeof path]

const { tab } = storeToRefs(useResourceUiStore(path, []))
defineProps<{
  iri?: Iri
}>()

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="code" :iri>
    <template #default="{ item }: { item: GetItemResponse }">
      <lazy-data-item-form-info-sediment-core :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="depths">depths</v-tab>
        <v-tab value="media">media</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="depths" data-testid="tab-window-depths">
          <data-collection-page-sediment-core-depth
            path="/api/data/sediment_cores/{parentId}/stratigraphic_units/depths"
            :parent="{
              key: 'sedimentCore',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="media" data-testid="tab-window-media">
          <data-media-object-join-container
            path="/api/data/sediment_cores/{parentId}/media_objects"
            post-path="/api/data/media_object_sediment_cores"
            delete-path="/api/data/media_object_sediment_cores/{id}"
            :parent-iri="item['@id']!"
            :can-update="Boolean(item._acl?.canUpdate)"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-sediment-core @refresh="redirectToCollectionPath()" />
      <data-dialog-update-sediment-core @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
