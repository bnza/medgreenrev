<script setup lang="ts">
import type { GetCollectionPath } from '~~/types'
import useResourceUiStore from '~/stores/resource-ui'

const resourceKey = 'site'

const SITES_GET_COLLECTION_OPERATION =
  '/api/sites' as const satisfies GetCollectionPath

const appPath = getApiResourceConfig(resourceKey).appPath
const { deleteDialogState, updateDialogState } = storeToRefs(
  useResourceUiStore('/api/sites/{id}'),
)
</script>

<template>
  <data-collection-table :path="SITES_GET_COLLECTION_OPERATION">
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
