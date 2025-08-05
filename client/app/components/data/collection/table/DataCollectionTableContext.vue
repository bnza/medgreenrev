<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/contexts'
      | '/api/data/stratigraphic_units/{parentId}/data_contexts'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import useResourceConfig from '~/stores/resource-config'

const props = defineProps<{
  path: Path
  parent?:
    | ResourceParent<'site', '/api/data/sites/{id}'>
    | ResourceParent<'stratigraphicUnit', '/api/data/stratigraphic_units/{id}'>
}>()

const { appPath } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/contexts/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/contexts/{id}'),
)
</script>

<template>
  <data-collection-table :path>
    <template #[`item.id`]="{ item }">
      <navigation-resource-item :id="item.id" :acl="item._acl" :app-path />
      <!--      @delete="deleteDialogState = { id: item.id }"-->
      <!--      @update="updateDialogState = { id: item.id }"-->
    </template>
    <template #dialogs>
      <!--      <data-dialog-search :path title="Site" />-->
      <!--      <data-dialog-create-site :path />-->
      <!--      <data-dialog-delete-site />-->
      <!--      <data-dialog-update-site />-->
    </template>
  </data-collection-table>
</template>
