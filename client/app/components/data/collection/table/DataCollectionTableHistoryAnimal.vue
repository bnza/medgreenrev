<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/history/animals'
      | '/api/data/history/locations/{parentId}/animals'
    >
  "
>
import type { CollectionAcl, GetCollectionPath, ResourceParent } from '~~/types'
import type { SearchableGetCollectionPath } from '~/utils/consts/configs/filters'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'vocHistoryLocation'>
  filterPath?: GetCollectionPath
}>()

const { appPath, labels } = useResourceConfig(props.path)
const { id: parentId } = useResourceParent(props.parent)

const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/history/animals/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/history/animals/{id}'),
)

const searchPath = computed(
  () => (props.filterPath ?? props.path) as SearchableGetCollectionPath,
)

const acl = defineModel<CollectionAcl>('acl', { required: true })
</script>

<template>
  <data-collection-table
    :path
    :parent-id
    :filter-path
    @acl="acl = { ...acl, ...$event }"
  >
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
      <data-dialog-download :path :title="labels[1]" :parent-id :filter-path />
      <data-dialog-search :path="searchPath" :title="labels[1]" />
      <data-dialog-create-history-animal :path :parent @refresh="refetch()" />
      <data-dialog-delete-history-animal @refresh="refetch()" />
      <data-dialog-update-history-animal @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
