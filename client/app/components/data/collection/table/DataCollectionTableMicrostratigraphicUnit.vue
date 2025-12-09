<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/microstratigraphic_units'
      | '/api/data/stratigraphic_units/{parentId}/microstratigraphic_units'
      | '/api/data/samples/{parentId}/microstratigraphic_units'
    >
  "
>
import type { CollectionAcl, GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'stratigraphicUnit'> | ResourceParent<'sample'>
}>()

const { id: parentId } = useResourceParent(props.parent)

const { appPath, labels } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/microstratigraphic_units/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/microstratigraphic_units/{id}'),
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
    <template #[`item.stratigraphicUnit.site.code`]="{ item }">
      <data-item-info-box-span-site
        :iri="item.stratigraphicUnit.site['@id']"
        :text="item.stratigraphicUnit.site.code"
      />
    </template>
    <template #[`item.stratigraphicUnit.code`]="{ item }">
      <data-item-info-box-span-stratigraphic-unit
        :iri="item.stratigraphicUnit['@id']"
        :text="item.stratigraphicUnit.code"
      />
    </template>
    <template #[`item.notes`]="{ item }">
      <text-tooltip-span :text="item.notes" />
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-download :path :title="labels[1]" :parent-id />
      <data-dialog-search :path :title="labels[1]" />
      <data-dialog-create-microstratigraphic-unit
        :path
        :parent
        @refresh="refetch()"
      />
      <data-dialog-delete-microstratigraphic-unit @refresh="refetch()" />
      <data-dialog-update-microstratigraphic-unit @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
