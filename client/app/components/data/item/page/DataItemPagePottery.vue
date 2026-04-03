<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import type { Iri } from '~~/types'

const path = '/api/data/potteries/{id}' as const

const { tab } = storeToRefs(useResourceUiStore(path, ['aspect', 'chronology']))
defineProps<{
  iri?: Iri
}>()

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="code" :iri>
    <template #default="{ item }">
      <lazy-data-item-form-info-pottery :item />
      <v-tabs v-if="!iri" v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <v-tab value="analyses">analyses</v-tab>
        <v-tab value="media">media</v-tab>
      </v-tabs>
      <v-tabs-window v-if="!iri" v-model="tab">
        <v-tabs-window-item value="data" data-testid="tab-data">
          <data-item-form-detail-pottery :item />
        </v-tabs-window-item>
        <v-tabs-window-item value="analyses" data-testid="tab-analyses">
          <data-collection-page-analysis-pottery
            path="/api/data/potteries/{parentId}/analyses"
            :parent="{
              key: 'pottery',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="media" data-testid="tab-media">
          <data-media-object-join-container
            path="/api/data/potteries/{parentId}/media_objects"
            post-path="/api/data/media_object_potteries"
            delete-path="/api/data/media_object_potteries/{id}"
            :parent-iri="item['@id']!"
            :can-update="item._acl?.canUpdate"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-pottery @refresh="redirectToCollectionPath()" />
      <data-dialog-update-pottery @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
