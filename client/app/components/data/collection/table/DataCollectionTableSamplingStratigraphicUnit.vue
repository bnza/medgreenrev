<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/sampling_stratigraphic_units'
      | '/api/data/sampling_sites/{parentId}/stratigraphic_units'
    >
  "
>
import type { CollectionAcl, GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'samplingSite'>
}>()

const { id: parentId } = useResourceParent(props.parent)

const { appPath, labels } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/sampling_stratigraphic_units/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/sampling_stratigraphic_units/{id}'),
)

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
      <data-item-info-box-span-sampling-site
        :iri="item.site['@id']"
        :text="item.site.code"
      />
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-download :path :title="labels[1]" :parent-id />
      <data-dialog-search :path :title="labels[1]" />
      <data-dialog-create-sampling-stratigraphic-unit
        :path
        :parent
        @refresh="refetch()"
      />
      <data-dialog-delete-sampling-stratigraphic-unit @refresh="refetch()" />
      <data-dialog-update-sampling-stratigraphic-unit @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
