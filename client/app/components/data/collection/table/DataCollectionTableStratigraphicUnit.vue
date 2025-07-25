<script
  setup
  lang="ts"
  generic="Path extends Extract<GetCollectionPath, '/api/stratigraphic_units'>"
>
import type { GetCollectionPath } from '~~/types'
import useResourceUiStore from '~/stores/resource-ui'
import useResourceConfig from '~/stores/resource-config'

const props = defineProps<{
  path: Path
}>()

const { appPath } = useResourceConfig(props.path)
const { deleteDialogState, updateDialogState } = storeToRefs(
  useResourceUiStore('/api/stratigraphic_units/{id}'),
)
</script>

<template>
  <data-collection-table :path>
    <template #[`item.id`]="{ item }">
      <navigation-resource-item
        :id="item.id"
        :acl="item._acl"
        :app-path
        @delete="deleteDialogState = { id: item.id }"
        @update="updateDialogState = { id: item.id }"
      />
    </template>
    <template #dialogs>
      <!--      <data-dialog-search-site :path />-->
      <data-dialog-create-stratigraphic-unit :path />
      <data-dialog-delete-stratigraphic-unit />
      <data-dialog-update-stratigraphic-unit />
    </template>
  </data-collection-table>
</template>
