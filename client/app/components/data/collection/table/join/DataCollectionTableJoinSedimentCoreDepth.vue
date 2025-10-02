<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/sample_stratigraphic_units'
      | '/api/data/stratigraphic_units/{parentId}/sediment_cores'
      | '/api/data/sediment_cores/{parentId}/stratigraphic_units'
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

const subResourceKey = computed(() =>
  props.parent?.key === 'stratigraphicUnit'
    ? 'sedimentCore'
    : 'stratigraphicUnit',
)

const { appPath } = useResourceConfig(
  props.parent
    ? props.parent.key === 'stratigraphicUnit'
      ? '/api/data/sediment_cores'
      : '/api/data/stratigraphic_units'
    : props.path,
)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/sediment_core_depths/{id}'),
)
const { id: parentId } = useResourceParent(props.parent)
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
      <!--      <data-dialog-download :path :title="subResourceKey" :parent-id />-->
      <!--      <data-dialog-create-sample-stratigraphic-unit-->
      <!--        :path-->
      <!--        :parent-->
      <!--        @refresh="refetch()"-->
      <!--      />-->
      <!--      <data-dialog-delete-sample-stratigraphic-unit @refresh="refetch()" />-->
    </template>
  </data-collection-table>
</template>
