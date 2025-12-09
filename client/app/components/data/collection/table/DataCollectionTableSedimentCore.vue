<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      '/api/data/sediment_cores' | '/api/data/sites/{parentId}/sediment_cores'
    >
  "
>
import type { CollectionAcl, GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'site'>
}>()

const { id: parentId } = useResourceParent(props.parent)

const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/sediment_cores/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/sediment_cores/{id}'),
)
const { appPath } = useResourceConfig(props.path)

const acl = defineModel<CollectionAcl>('acl', { required: true })
</script>

<template>
  <data-collection-table :path :parent-id @acl="acl = { ...acl, ...$event }">
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
      <!--      <data-dialog-download :path title="Sample" />-->
      <lazy-data-dialog-create-sediment-core
        :path
        :parent
        @refresh="refetch()"
      />
      <data-dialog-delete-sediment-core @refresh="refetch()" />
      <data-dialog-update-sediment-core @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
