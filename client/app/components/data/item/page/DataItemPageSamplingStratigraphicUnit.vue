<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'

const path = '/api/data/sampling_stratigraphic_units/{id}' as const

const { tab } = storeToRefs(
  useResourceUiStore(path, ['description', 'chronology']),
)

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="code">
    <template #default="{ item }">
      <lazy-data-item-form-info-sampling-stratigraphic-unit :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <v-tab value="core-depths">core (depths)</v-tab>
        <v-tab value="media">media</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab" class="w-100 h-100">
        <v-tabs-window-item value="data" data-testid="tab-window-data">
          <data-item-form-detail-sampling-stratigraphic-unit :item />
        </v-tabs-window-item>
        <v-tabs-window-item value="core-depths" data-testid="tab-core-depths">
          <data-collection-page-sediment-core-depth
            path="/api/data/stratigraphic_units/{parentId}/sediment_cores/depths"
            :parent="{
              key: 'stratigraphicUnit',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="media" data-testid="tab-media">
          <data-media-object-join-container
            path="/api/data/sampling_stratigraphic_units/{parentId}/media_objects"
            post-path="/api/data/media_object_sampling_stratigraphic_units"
            delete-path="/api/data/media_object_sampling_stratigraphic_units/{id}"
            :parent-iri="item['@id']!"
            :can-update="item._acl?.canUpdate"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <!--      <data-dialog-delete-stratigraphic-unit-->
      <!--        @refresh="redirectToCollectionPath()"-->
      <!--      />-->
      <!--      <data-dialog-update-stratigraphic-unit @refresh="refetch()" />-->
    </template>
  </data-item-page>
</template>
