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
      <navigation-resource-item
        :id="item.id"
        :acl="item._acl"
        :app-path
        @delete="deleteDialogState = { id: item.id }"
        @update="updateDialogState = { id: item.id }"
      />
    </template>

    <template #dialogs="{ refetch }">
      <data-dialog-create-vocabulary-botany-taxonomy @refresh="refetch()" />
      <data-dialog-delete-vocabulary
        path="/api/vocabulary/botany/taxonomies/{id}"
        property-name="flat.value"
        @refresh="refetch()"
      />
      <data-dialog-update-vocabulary-botany-taxonomy @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
