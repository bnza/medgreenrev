<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/sediment_core_depths'
      | '/api/data/sediment_cores/{parentId}/depths'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: Path
  parent?:
    | ResourceParent<'stratigraphicUnit', '/api/data/stratigraphic_units/{id}'>
    | ResourceParent<'sedimentCore', '/api/data/sediment_cores/{id}'>
}>()

const { appPath } = useResourceConfig(props.path)

const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/sediment_core_depths/{id}'),
)

const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/sediment_core_depths/{id}'),
)

const { id: parentId } = useResourceParent(props.parent)
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
    <template #[`item.sedimentCore.site.code`]="{ item }">
      <data-item-info-box-span-site
        :iri="item.sedimentCore.site['@id']"
        :text="item.sedimentCore.site.code"
      />
    </template>
    <template #[`item.stratigraphicUnit.code`]="{ item }">
      <data-item-info-box-span-stratigraphic-unit
        :iri="item.stratigraphicUnit['@id']"
        :text="item.stratigraphicUnit.code"
      />
    </template>
    <template #dialogs="{ refetch }">
      <!--      <data-dialog-download :path :title="subResourceKey" :parent-id />-->
      <data-dialog-create-sediment-core-depth
        :path
        :parent
        @refresh="refetch()"
      />
      <data-dialog-delete-sediment-core-depth @refresh="refetch()" />
      <data-dialog-update-sediment-core-depth @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
