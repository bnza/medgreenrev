<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/context_samples'
      | '/api/data/samples/{parentId}/contexts'
      | '/api/data/contexts/{parentId}/samples'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import useResourceConfig from '~/stores/resource-config'

const props = defineProps<{
  path: Path
  parent?:
    | ResourceParent<'sample', '/api/data/samples/{id}'>
    | ResourceParent<'context', '/api/data/contexts/{id}'>
}>()

const subResourceKey = computed(() =>
  props.parent?.key === 'sample' ? 'context' : 'sample',
)

const { appPath } = useResourceConfig(
  props.parent
    ? props.parent.key === 'sample'
      ? '/api/data/contexts'
      : '/api/data/samples'
    : props.path,
)
const { id: parentId } = useResourceParent(props.parent)

const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/context_samples/{id}'),
)
</script>

<template>
  <data-collection-table :path :parent-id>
    <template #[`item.id`]="{ item }">
      <navigation-join-resource-item
        :item
        :sub-resource-key
        :app-path
        @delete="deleteDialogState = { id: item.id }"
      />
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-download :path :title="subResourceKey" :parent-id />
      <data-dialog-create-context-sample :path :parent @refresh="refetch()" />
      <data-dialog-delete-context-sample @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
