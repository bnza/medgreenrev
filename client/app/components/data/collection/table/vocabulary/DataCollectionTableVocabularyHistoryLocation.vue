<script setup lang="ts">
const path = '/api/data/vocabulary/history/locations'

const { appPath, labels } = useResourceConfig(path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/vocabulary/history/locations/{id}'),
)
</script>

<template>
  <data-collection-table :path>
    <template #[`item.id`]="{ item }">
      <v-btn-group>
        <navigation-resource-item-read
          :id="item.id"
          app-path="/data/history/locations"
          :disabled="!item._acl.canRead"
        />
        <navigation-resource-item-delete
          :id="item.id"
          :disabled="!item._acl.canDelete"
          :app-path
          @delete="deleteDialogState = { id: item.id }"
        />
      </v-btn-group>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-create-vocabulary-history-location @refresh="refetch()" />
      <data-dialog-search :path :title="labels[1]" />
      <data-dialog-delete-vocabulary
        path="/api/vocabulary/history/locations/{id}"
        @refresh="refetch()"
      />
    </template>
  </data-collection-table>
</template>
