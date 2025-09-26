<script
  setup
  lang="ts"
  generic="
    Path extends
      | Extract<GetCollectionPath, '/api/data/analyses/zoo/teeth'>
      | '/api/data/zoo/teeth/{parentId}/analyses'
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'zooTooth', '/api/data/zoo/teeth/{id}'>
}>()

const { id: parentId } = useResourceParent(props.parent)

const { appPath } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/analyses/zoo/teeth/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/analyses/zoo/teeth/{id}'),
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
    <template #[`item.item.code`]="{ item }">
      <data-item-info-box-span-zoo-tooth
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
      <!--      <data-dialog-download :path title="Pottery Analysis" :parent-id />-->
      <data-dialog-search :path title="Animal tooth analysis" />
      <data-dialog-create-analysis-zoo-tooth :parent @refresh="refetch()" />
      <data-dialog-delete-analysis-zoo-tooth @refresh="refetch()" />
      <data-dialog-update-analysis-zoo-tooth @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
