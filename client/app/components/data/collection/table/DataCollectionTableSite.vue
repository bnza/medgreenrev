<script
  setup
  lang="ts"
  generic="Path extends Extract<GetCollectionPath, '/api/sites'>"
>
import type { GetCollectionPath } from '~~/types'
import useResourceUiStore from '~/stores/resource-ui'
import useResourceConfig from '~/stores/resource-config'

const props = defineProps<{
  path: Path
}>()

const { appPath } = useResourceConfig(props.path)
const { deleteDialogState, updateDialogState } = storeToRefs(
  useResourceUiStore('/api/sites/{id}'),
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
