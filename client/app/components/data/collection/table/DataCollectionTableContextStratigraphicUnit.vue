<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/context_stratigraphic_units'
      | '/api/stratigraphic_units/{parentId}/data_contexts'
      | '/api/data_contexts/{parentId}/stratigraphic_units'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import useResourceUiStore from '~/stores/resource-ui'
import useResourceConfig from '~/stores/resource-config'

const props = defineProps<{
  path: Path
  parent?:
    | ResourceParent<'stratigraphicUnit', '/api/stratigraphic_units/{id}'>
    | ResourceParent<'dataContext', '/api/data_contexts/{id}'>
}>()

const subResourceKey = computed(() =>
  props.parent?.key === 'stratigraphicUnit' ? 'context' : 'stratigraphicUnit',
)

const { appPath } = useResourceConfig(
  props.parent
    ? props.parent.key === 'stratigraphicUnit'
      ? '/api/data_contexts'
      : '/api/stratigraphic_units'
    : props.path,
)
const { updateDialogState } = storeToRefs(useResourceUiStore(props.path))
const { id: parentId } = useResourceParent(props.parent)
</script>

<template>
  <data-collection-table :path :parent-id>
    <template #[`item.id`]="{ item }">
      <navigation-join-resource-item :item :sub-resource-key :app-path />
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
