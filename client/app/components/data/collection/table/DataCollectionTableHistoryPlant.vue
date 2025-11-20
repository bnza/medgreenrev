<script
  setup
  lang="ts"
  generic="Path extends Extract<GetCollectionPath, '/api/data/history/plants'>"
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import DataDialogCreateHistoryPlant from '~/components/data/dialog/create/DataDialogCreateHistoryPlant.vue'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'vocHistoryLocation'>
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
      <data-dialog-search :path title="Plant (historical data)" />
      <data-dialog-create-history-plant :path :parent @refresh="refetch()" />
      <data-dialog-delete-history-plant @refresh="refetch()" />
      <data-dialog-update-history-plant @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
