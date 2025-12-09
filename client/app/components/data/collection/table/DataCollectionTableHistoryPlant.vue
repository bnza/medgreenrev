<script
  setup
  lang="ts"
  generic="Path extends Extract<GetCollectionPath, '/api/data/history/plants'>"
>
import type { CollectionAcl, GetCollectionPath, ResourceParent } from '~~/types'
import DataDialogCreateHistoryPlant from '~/components/data/dialog/create/DataDialogCreateHistoryPlant.vue'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'vocHistoryLocation'>
}>()

const { appPath, labels } = useResourceConfig(props.path)
const { id: parentId } = useResourceParent(props.parent)

const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/history/plants/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/history/plants/{id}'),
)

const acl = defineModel<CollectionAcl>('acl', { required: true })
</script>

<template>
  <data-collection-table :path :parent-id @acl="acl = { ...acl, ...$event }">
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
      <data-dialog-create-history-plant :path :parent @refresh="refetch()" />
      <data-dialog-delete-history-plant @refresh="refetch()" />
      <data-dialog-update-history-plant @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
