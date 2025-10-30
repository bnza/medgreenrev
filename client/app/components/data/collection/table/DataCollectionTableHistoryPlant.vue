<script
  setup
  lang="ts"
  generic="Path extends Extract<GetCollectionPath, '/api/data/history/plants'>"
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'historyLocation'>
}>()

const { appPath } = useResourceConfig(props.path)
const { id: parentId } = useResourceParent(props.parent)

const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/history/plants/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/history/plants/{id}'),
)
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
      <!--      <data-dialog-download :path title="Context" />-->
      <!--      <data-dialog-search :path title="Analysis" />-->
      <!--      <data-dialog-create-analysis :path :parent @refresh="refetch()" />-->
      <!--      <data-dialog-delete-analysis @refresh="refetch()" />-->
      <!--      <data-dialog-update-analysis @refresh="refetch()" />-->
    </template>
  </data-collection-table>
</template>
