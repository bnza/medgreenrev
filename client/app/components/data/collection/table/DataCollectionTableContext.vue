<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      '/api/data/contexts' | '/api/data/sites/{parentId}/contexts'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'site'>
}>()

const { appPath } = useResourceConfig(props.path)
const { id: parentId } = useResourceParent(props.parent)

const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/contexts/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/contexts/{id}'),
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
    <template #[`item.site.code`]="{ item }">
      <data-item-info-box-span-site
        :iri="item.site['@id']"
        :text="item.site.code"
      />
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-download :path title="Context" />
      <data-dialog-search :path title="Context" />
      <data-dialog-create-context :path :parent @refresh="refetch()" />
      <data-dialog-delete-context @refresh="refetch()" />
      <data-dialog-update-context @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
