<script
  setup
  lang="ts"
  generic="Path extends Extract<GetCollectionPath, '/api/data/sites'>"
>
import type { GetCollectionPath } from '~~/types'
import useResourceConfig from '~/stores/resource-config'

const props = defineProps<{
  path: Path
}>()

const { appPath } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/sites/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/sites/{id}'),
)
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
    <template #dialogs>
      <data-dialog-search :path title="Site" />
      <data-dialog-create-site :path />
      <data-dialog-delete-site />
      <data-dialog-update-site />
    </template>
  </data-collection-table>
</template>
