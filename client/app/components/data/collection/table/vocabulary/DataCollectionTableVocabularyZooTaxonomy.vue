<script setup lang="ts">
const path = '/api/data/vocabulary/zoo/taxonomies'

const { appPath } = useResourceConfig(path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/vocabulary/zoo/taxonomies/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/vocabulary/zoo/taxonomies/{id}'),
)
</script>

<template>
  <data-collection-table :path>
    <template #[`item.id`]="{ item }">
      <v-btn-group>
        <navigation-resource-item-update
          :id="item.id"
          :disabled="!item._acl.canUpdate"
          :app-path
          @update="updateDialogState = { id: item.id }"
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
      <data-dialog-create-vocabulary-zoo-taxonomy @refresh="refetch()" />
      <data-dialog-delete-vocabulary
        path="/api/vocabulary/zoo/taxonomies/{id}"
        @refresh="refetch()"
      />
      <data-dialog-update-vocabulary-zoo-taxonomy @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
