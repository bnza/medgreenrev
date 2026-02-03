<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'

const path = '/api/data/analyses/{id}' as const

const { tab } = storeToRefs(useResourceUiStore(path))

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="code">
    <template #default="{ item }">
      <lazy-data-item-form-info-analysis :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="media">media</v-tab>
        <v-tab value="subjects">subjects</v-tab>
        <v-tab
          v-if="item?.type?.group === 'absolute dating'"
          value="absolute-dating"
          >absolute dating</v-tab
        >
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="subjects" data-testid="tab-subjects">
          <data-collection-page-analysis-subject
            path="/api/data/analyses/{parentId}/subjects"
            :parent="{
              key: 'analysis',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item
          value="absolute-dating"
          data-testid="tab-absolute-dating"
        >
          <data-collection-page-abs-dating-analysis
            path="/api/data/analyses/{parentId}/absolute_dating"
            :parent="{
              key: 'analysis',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="media" data-testid="tab-media">
          <data-media-object-join-container
            path="/api/data/analyses/{parentId}/media_objects"
            post-path="/api/data/media_object_analyses"
            delete-path="/api/data/media_object_analyses/{id}"
            :parent-iri="item['@id']!"
            :can-update="item._acl?.canUpdate"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-analysis @refresh="redirectToCollectionPath()" />
      <data-dialog-update-analysis @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
