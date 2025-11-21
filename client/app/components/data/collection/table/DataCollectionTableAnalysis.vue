<script
  setup
  lang="ts"
  generic="Path extends Extract<GetCollectionPath, '/api/data/analyses'>"
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: Path
  parent?:
    | ResourceParent<'pottery'>
    | ResourceParent<'zooBone'>
    | ResourceParent<'zooTooth'>
}>()

const { appPath, labels } = useResourceConfig(props.path)
const { id: parentId } = useResourceParent(props.parent)

const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/analyses/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/analyses/{id}'),
)

const getStatusText = (status: number | null | undefined) => {
  switch (status) {
    case 0:
      return 'requested'
    case 1:
      return 'pending'
    case 2:
      return 'completed'
    default:
      return 'unknown'
  }
}
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
    <template #[`item.status`]="{ item }">
      {{ getStatusText(item.status) }}
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-download :path :title="labels[1]" />
      <data-dialog-search :path :title="labels[1]" />
      <data-dialog-create-analysis :path :parent @refresh="refetch()" />
      <data-dialog-delete-analysis @refresh="refetch()" />
      <data-dialog-update-analysis @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
