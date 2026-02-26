<script
  setup
  lang="ts"
  generic="Path extends Extract<GetCollectionPath, '/api/data/sampling_sites'>"
>
import type { CollectionAcl, GetCollectionPath } from '~~/types'

const props = defineProps<{
  path: Path
}>()

const { appPath, labels } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/sampling_sites/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/sampling_sites/{id}'),
)

const acl = defineModel<CollectionAcl>('acl', { required: true })
</script>

<template>
  <data-collection-table :path @acl="acl = { ...acl, ...$event }">
    <template #[`item.id`]="{ item }">
      <navigation-resource-item
        :id="item.id"
        :acl="item._acl"
        :app-path
        @delete="deleteDialogState = { id: item.id }"
        @update="updateDialogState = { id: item.id }"
      >
        <!--        <template #prepend>-->
        <!--          <navigation-map-location-coordinate-->
        <!--            :x="item.e"-->
        <!--            :y="item.n"-->
        <!--            icon-size="x-small"-->
        <!--          />-->
        <!--        </template>-->
      </navigation-resource-item>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-download :path :title="labels[1]" />
      <data-dialog-search :path :title="labels[1]" />
      <data-dialog-create-sampling-site :path @refresh="refetch()" />
      <data-dialog-delete-sampling-site @refresh="refetch()" />
      <data-dialog-update-sampling-site @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
