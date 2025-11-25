<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/analyses/samples/microstratigraphy'
      | '/api/data/analyses/{parentId}/samples/microstratigraphy'
      | '/api/data/samples/{parentId}/analyses/microstratigraphy'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'sample'> | ResourceParent<'analysis'>
}>()

const { id: parentId } = useResourceParent(props.parent)

const { appPath, labels } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore(
    '/api/data/analyses/samples/microstratigraphy/{id}',
  ),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore(
    '/api/data/analyses/samples/microstratigraphy/{id}',
  ),
)

const vocabularyAnalysisStore = useVocabularyStore(
  '/api/vocabulary/analysis/types',
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
    <template #[`item.subject.code`]="{ item }">
      <data-item-info-box-span-sample
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
      <data-dialog-create-analysis-sample-microstratigraphy
        :path
        :parent
        @refresh="refetch()"
      />
      <data-dialog-delete-analysis-samples-microstratigraphy
        @refresh="refetch()"
      />
      <data-dialog-update-analysis-sample-microstratigraphy
        @refresh="refetch()"
      />
    </template>
  </data-collection-table>
</template>
