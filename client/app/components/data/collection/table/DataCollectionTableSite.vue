<script
  setup
  lang="ts"
  generic="Path extends Extract<GetCollectionPath, '/api/data/sites'>"
>
import type { CollectionAcl, GetCollectionPath } from '~~/types'

const props = defineProps<{
  path: Path
}>()

const { appPath, labels } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/sites/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/sites/{id}'),
)

const acl = defineModel<CollectionAcl>('acl', { required: true })
</script>

<template>
  <data-collection-table :path @acl="acl = { ...acl, ...$event }">
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
      <data-dialog-download :path :title="labels[1]" />
      <data-dialog-search :path :title="labels[1]" />
      <data-dialog-create-site :path @refresh="refetch()" />
      <data-dialog-delete-site @refresh="refetch()" />
      <data-dialog-update-site @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
