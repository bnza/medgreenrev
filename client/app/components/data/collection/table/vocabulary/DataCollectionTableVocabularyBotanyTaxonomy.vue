<script setup lang="ts">
import type { CollectionAcl } from '~~/types'

const path = '/api/data/vocabulary/botany/taxonomies'

const { appPath } = useResourceConfig(path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/vocabulary/botany/taxonomies/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/vocabulary/botany/taxonomies/{id}'),
)
const acl = defineModel<CollectionAcl>('acl', { required: true })
</script>

<template>
  <data-collection-table :path @acl="acl = { ...acl, ...$event }">
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
      <data-dialog-create-vocabulary-botany-taxonomy @refresh="refetch()" />
      <data-dialog-delete-vocabulary
        path="/api/vocabulary/botany/taxonomies/{id}"
        @refresh="refetch()"
      />
      <data-dialog-update-vocabulary-botany-taxonomy @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
