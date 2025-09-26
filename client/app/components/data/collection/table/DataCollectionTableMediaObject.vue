<script
  setup
  lang="ts"
  generic="Path extends Extract<GetCollectionPath, '/api/data/media_objects'>"
>
import type { GetCollectionPath } from '~~/types'

const props = defineProps<{
  path: Path
}>()

const { appPath } = useResourceConfig(props.path)
const { parse, dateAdapter } = useAppDate()
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/media_objects/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/media_objects/{id}'),
)

const vocabularyMediaObjectTypeStore = useVocabularyStore(
  '/api/vocabulary/media_object/types',
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
    <template #[`item.thumbnail`]="{ item }">
      <data-media-object-image :item :size="100" />
    </template>
    <template #[`item.type.group`]="{ item }">
      {{ vocabularyMediaObjectTypeStore.getValue(item.type, 'group') }}
    </template>
    <template #[`item.type.value`]="{ item }">
      {{ vocabularyMediaObjectTypeStore.getValue(item.type) }}
    </template>
    <template #[`item.size`]="{ item }">
      {{ formatBitSize(item.size) }}
    </template>
    <template #[`item.uploadDate`]="{ item }">
      {{ dateAdapter.format(parse(item.uploadDate), 'fullDateTime24h') }}
    </template>
    <template #[`item.description`]="{ item }">
      <text-tooltip-span :text="item.description" />
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-search :path title="Media" />
      <data-dialog-create-media-object @refresh="refetch()" />
      <data-dialog-delete-media-object @refresh="refetch()" />
      <data-dialog-update-media-object @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
