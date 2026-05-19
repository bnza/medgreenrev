<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/history/written_sources_cited_works'
      | '/api/data/history/written_sources/{parentId}/cited_works'
    >
  "
>
import type { CollectionAcl, GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'historyWrittenSource'>
}>()

const { appPath, labels } = useResourceConfig(props.path)

const { id: parentId } = useResourceParent(props.parent)

const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore(
    '/api/data/history/written_sources_cited_works/{id}',
  ),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore(
    '/api/data/history/written_sources_cited_works/{id}',
  ),
)

const acl = defineModel<CollectionAcl>('acl', { required: true })
</script>

<template>
  <data-collection-table :parent-id :path @acl="acl = { ...acl, ...$event }">
    <template #[`item.id`]="{ item }">
      <navigation-resource-item
        :id="item.id"
        :acl="item._acl"
        :app-path
        @delete="deleteDialogState = { id: item.id }"
        @update="updateDialogState = { id: item.id }"
      />
    </template>
    <template #[`item.yearCompleted`]="{ item }">
      <span>{{
        [item.yearCompleted, item.yearCompletedUpper]
          .filter((value) => Boolean(value))
          .join('-')
      }}</span>
    </template>
    <!-- TODO: Add info-box components for writtenSource and citedWork when available -->
    <template #dialogs="{ refetch }">
      <data-dialog-create-history-written-source-cited-work
        :parent
        @refresh="refetch()"
      />
      <data-dialog-download :path :title="labels[1]" />
      <data-dialog-search :path :title="labels[1]" />
      <data-dialog-delete-history-written-source-cited-work
        @refresh="refetch()"
      />
      <data-dialog-update-history-written-source-cited-work
        @refresh="refetch()"
      />
    </template>
  </data-collection-table>
</template>
