<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'
import { ApiSpecialistRole } from '~/utils/consts/auth'

const path = '/api/vocabulary/history/locations/{id}' as const

const { tab } = storeToRefs(useResourceUiStore(path))

const { hasSpecialistRole, hasRoleAdmin } = useAppAuth()

const canUpdate = computed(
  () =>
    hasRoleAdmin.value || hasSpecialistRole(ApiSpecialistRole.Historian).value,
)
</script>

<template>
  <data-item-page :path identifier-prop="identifier">
    <template #default="{ item }">
      <lazy-data-item-form-info-history-location :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="animals">animals</v-tab>
        <v-tab value="plants">plants</v-tab>
        <v-tab value="media">media</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="animals" data-testid="tab-animals">
          <data-collection-page-history-animal
            path="/api/data/history/locations/{parentId}/animals"
            :parent="{ key: 'vocHistoryLocation', item }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="plants" data-testid="tab-plants">
          <data-collection-page-history-plant
            path="/api/data/history/locations/{parentId}/plants"
            :parent="{ key: 'vocHistoryLocation', item }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="media" data-testid="tab-media">
          <data-media-object-join-container
            path="/api/data/history/locations/{parentId}/media_objects"
            post-path="/api/data/media_object_history_locations"
            delete-path="/api/data/media_object_history_locations/{id}"
            :parent-iri="item['@id']!"
            :can-update
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
  </data-item-page>
</template>
