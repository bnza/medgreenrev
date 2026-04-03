<script
  setup
  lang="ts"
  generic="
    Path extends Extract<GetCollectionPath, '/api/data/history/written_sources'>
  "
>
import type {
  CollectionAcl,
  GetCollectionPath,
  GetCollectionMemberResponseMap,
} from '~~/types'

const props = defineProps<{
  path: Path
}>()

const { appPath, labels } = useResourceConfig(props.path)

const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/history/written_sources/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/history/written_sources/{id}'),
)

const acl = defineModel<CollectionAcl>('acl', { required: true })
const formatCenturies = (
  centuries: { chronologyLower: number; value: string }[],
): string => {
  return centuries
    .sort((a, b) => a.chronologyLower - b.chronologyLower)
    .map((c) => c.value)
    .join(', ')
}
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
      />
    </template>
    <template #[`item.centuries.century.chronologyLower`]="{ item }">
      <span v-if="item.centuries">{{ formatCenturies(item.centuries) }}</span>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-create-history-written-source @refresh="refetch()" />
      <data-dialog-download :path :title="labels[1]" />
      <data-dialog-search :path :title="labels[1]" />
      <data-dialog-delete-history-written-source @refresh="refetch()" />
      <data-dialog-update-history-written-source @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
