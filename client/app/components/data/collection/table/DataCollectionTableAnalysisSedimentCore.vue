<script
  setup
  lang="ts"
  generic="
    Path extends
      | Extract<GetCollectionPath, '/api/data/analyses/sediment_cores'>
      | '/api/data/sediment_cores/{parentId}/analyses'
  "
>
import type { CollectionAcl, GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'sedimentCore'>
}>()

const { id: parentId } = useResourceParent(props.parent)

const { appPath, labels } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/analyses/sediment_cores/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/analyses/sediment_cores/{id}'),
)

const vocabularyAnalysisStore = useVocabularyStore(
  '/api/vocabulary/analysis/types',
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
    <template #[`item.subject.code`]="{ item }">
      <data-item-info-box-span-sediment-core
        :iri="item.subject['@id']"
        :text="item.subject.code"
      />
    </template>
    <template #[`item.analysis.type.group`]="{ item }">
      {{ vocabularyAnalysisStore.getValue(item.analysis.type['@id'], 'group') }}
    </template>
    <template #[`item.analysis.type`]="{ item }">
      {{ vocabularyAnalysisStore.getValue(item.analysis.type['@id']) }}
    </template>
    <template #[`item.analysis.identifier`]="{ item }">
      <data-item-info-box-span-analysis
        :iri="item.analysis['@id']"
        :text="item.analysis.identifier"
      />
    </template>
    <template #[`item.summary`]="{ item }">
      <text-tooltip-span :text="item.summary" />
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-download :path :title="labels[1]" :parent-id />
      <data-dialog-search :path :title="labels[1]" />
      <data-dialog-create-analysis-sediment-core
        :path
        :parent
        @refresh="refetch()"
      />
      <data-dialog-delete-analysis-sediment-core @refresh="refetch()" />
      <data-dialog-update-analysis-sediment-core @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
