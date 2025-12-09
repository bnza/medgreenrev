<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/analyses/sites/anthropology'
      | '/api/data/analyses/{parentId}/sites/anthropology'
      | '/api/data/sites/{parentId}/analyses/anthropology'
    >
  "
>
import type { CollectionAcl, GetCollectionPath, ResourceParent } from '~~/types'
import DataDialogDeleteAnalysisSiteAnthropology from '~/components/data/dialog/delete/DataDialogDeleteAnalysisSiteAnthropology.vue'
import DataDialogUpdateAnalysisSiteAnthropology from '~/components/data/dialog/update/DataDialogUpdateAnalysisSiteAnthropology.vue'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'site'> | ResourceParent<'analysis'>
}>()

const { id: parentId } = useResourceParent(props.parent)

const { appPath } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/analyses/sites/anthropology/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/analyses/sites/anthropology/{id}'),
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
      <data-item-info-box-span-site
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
      <!--      <data-dialog-search :path title="Pottery Analysis" />-->
      <data-dialog-create-analysis-site-anthropology
        :path
        :parent
        @refresh="refetch()"
      />
      <data-dialog-delete-analysis-site-anthropology @refresh="refetch()" />
      <data-dialog-update-analysis-site-anthropology @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
