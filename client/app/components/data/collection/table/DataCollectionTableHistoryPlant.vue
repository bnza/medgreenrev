<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/history/plants'
      | '/api/data/history/locations/{parentId}/plants'
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
  useResourceDeleteDialogStore('/api/data/history/plants/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/history/plants/{id}'),
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
      <data-dialog-download :path :title="labels[1]" :parent-id />
      <data-dialog-search :path="searchPath" :title="labels[1]" />
      <data-dialog-create-history-plant :path :parent @refresh="refetch()" />
      <data-dialog-delete-history-plant @refresh="refetch()" />
      <data-dialog-update-history-plant @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
