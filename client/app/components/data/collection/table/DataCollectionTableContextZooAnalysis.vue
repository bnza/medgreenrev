<script
  setup
  lang="ts"
  generic="
    Path extends
      | Extract<GetCollectionPath, '/api/data/analyses/contexts/zoo'>
      | '/api/data/contexts/{parentId}/analyses/zoo'
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import useResourceConfig from '~/stores/resource-config'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'context', '/api/data/contexts/{id}'>
}>()

const { id: parentId } = useResourceParent(props.parent)

const { appPath, labels } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/analyses/contexts/zoo/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/analyses/contexts/zoo/{id}'),
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
    <template #[`item.subject.site.code`]="{ item }">
      <data-item-info-box-span-site
        :iri="item.subject.site['@id']"
        :text="item.subject.site.code"
      />
    </template>
    <template #[`item.subject.name`]="{ item }">
      <data-item-info-box-span-context
        :iri="item.subject['@id']"
        :text="item.subject.name"
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
      <data-dialog-search :path :title="labels[0]" />
      <lazy-data-dialog-create-context-zoo-analysis
        :path
        :parent
        @refresh="refetch()"
      />
      <data-dialog-delete-context-zoo-analysis @refresh="refetch()" />
      <lazy-data-dialog-update-context-zoo-analysis @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
