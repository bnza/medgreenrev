<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'

const path = '/api/data/stratigraphic_units/{id}' as const

const { tab } = storeToRefs(useResourceUiStore(path))
</script>

<template>
  <data-item-page :path title="Stratigraphic Unit" identifier-prop="code">
    <template #default="{ item }">
      <lazy-data-item-form-info-stratigraphic-unit :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <v-tab value="contexts">contexts</v-tab>
        <v-tab value="samples">samples</v-tab>
        <v-tab value="media">media</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="data" data-testid="tab-data">
          <p>Data</p>
        </v-tabs-window-item>
        <v-tabs-window-item value="contexts" data-testid="tab-contexts">
          <data-collection-page-join-context-stratigraphic-unit
            path="/api/data/stratigraphic_units/{parentId}/contexts"
            :parent="{
              key: 'stratigraphicUnit',
              resourceItemPath: '/api/data/stratigraphic_units/{id}',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="samples" data-testid="tab-samples">
          <data-collection-page-join-sample-stratigraphic-unit
            path="/api/data/stratigraphic_units/{parentId}/samples"
            :parent="{
              key: 'stratigraphicUnit',
              resourceItemPath: '/api/data/stratigraphic_units/{id}',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="media" data-testid="tab-media">
          <data-media-object-join-container
            path="/api/stratigraphic_units/{parentId}/media_objects"
            post-path="/api/media_object_stratigraphic_units"
            delete-path="/api/media_object_stratigraphic_units/{id}"
            :parent-iri="item['@id']!"
            :can-update="item._acl?.canUpdate"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
