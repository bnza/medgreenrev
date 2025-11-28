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
import type { GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'site'>
}>()

const { id: parentId } = useResourceParent(props.parent)

const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/samples/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/samples/{id}'),
)
const { appPath, labels } = useResourceConfig(props.path)
</script>

<template>
  <data-collection-table :path :parent-id>
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
      <data-dialog-download :path :title="labels[1]" :parent-id />
      <data-dialog-search :path :title="labels[1]" />
      <data-dialog-create-sample :path :parent @refresh="refetch()" />
      <data-dialog-delete-sample @refresh="refetch()" />
      <data-dialog-update-sample @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
