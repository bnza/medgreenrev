<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/stratigraphic_units'
      | '/api/data/sites/{parentId}/stratigraphic_units'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import useResourceConfig from '~/stores/resource-config'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'site', '/api/data/sites/{id}'>
}>()

const { id: parentId } = useResourceParent(props.parent)

const { appPath } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/stratigraphic_units/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/stratigraphic_units/{id}'),
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
    <template #dialogs="{ refetch }">
      <!--      <data-dialog-search-site :path />-->
      <data-dialog-create-stratigraphic-unit
        :path
        :parent
        @refresh="refetch()"
      />
      <data-dialog-delete-stratigraphic-unit @refresh="refetch()" />
      <data-dialog-update-stratigraphic-unit />
    </template>
  </data-collection-table>
</template>
