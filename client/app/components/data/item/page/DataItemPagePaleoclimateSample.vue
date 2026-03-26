<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import DataItemFormDetailPaleoclimateSample from '~/components/data/item/form/detail/DataItemFormDetailPaleoclimateSample.vue'

const path = '/api/data/paleoclimate_samples/{id}' as const

const { tab } = storeToRefs(
  useResourceUiStore(path, ['chronology', 'records', 'proxies']),
)

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="code">
    <template #default="{ item }">
      <lazy-data-item-form-info-paleoclimate-sample :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <v-tab value="media">media</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab" class="w-100 h-100">
        <v-tabs-window-item value="data" data-testid="tab-window-data">
          <data-item-form-detail-paleoclimate-sample :item />
        </v-tabs-window-item>
        <v-tabs-window-item value="media" data-testid="tab-media">
          <data-media-object-join-container
            path="/api/data/paleoclimate_samples/{parentId}/media_objects"
            post-path="/api/data/media_object_paleoclimate_samples"
            delete-path="/api/data/media_object_paleoclimate_samples/{id}"
            :parent-iri="item['@id']!"
            :can-update="item._acl?.canUpdate"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-sampling-stratigraphic-unit
        @refresh="redirectToCollectionPath()"
      />
      <data-dialog-update-sampling-stratigraphic-unit @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
