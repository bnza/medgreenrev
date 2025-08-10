<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      '/api/data/samples' | '/api/data/sites/{parentId}/samples'
    >
  "
>
import type { GetCollectionPath } from '~~/types'
import useResourceConfig from '~/stores/resource-config'

const props = defineProps<{
  path: Path
}>()

const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/samples/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/samples/{id}'),
)
const { appPath } = useResourceConfig(props.path)
</script>

<template>
  <data-collection-table :path>
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
      <lazy-data-dialog-create-sample :path @refresh="refetch()" />
      <data-dialog-delete-sample @refresh="refetch()" />
      <data-dialog-update-sample @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
