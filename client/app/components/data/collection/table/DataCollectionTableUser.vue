<script setup lang="ts">
import type { GetCollectionPath } from '~~/types'
import useResourceUiStore from '~/stores/resource-ui'

const resourceKey = 'user'

const GET_COLLECTION_OPERATION =
  '/api/users' as const satisfies GetCollectionPath
const appPath = getApiResourceConfig(resourceKey).appPath
const { deleteDialogState, updateDialogState } = storeToRefs(
  useResourceUiStore('/api/users/{id}'),
)
</script>

<template>
  <data-collection-table :path="GET_COLLECTION_OPERATION">
    <template #[`item.id`]="{ item }">
      <navigation-resource-item
        :id="item.id"
        :acl="item._acl"
        :app-path
        @delete="deleteDialogState = { id: item.id }"
        @update="updateDialogState = { id: item.id }"
      />
    </template>
  </data-collection-table>
</template>
