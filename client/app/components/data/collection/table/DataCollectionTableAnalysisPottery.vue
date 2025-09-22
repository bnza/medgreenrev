<script
  setup
  lang="ts"
  generic="
    Path extends
      | Extract<GetCollectionPath, '/api/data/analyses/potteries'>
      | '/api/data/potteries/{parentId}/analyses'
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import useResourceConfig from '~/stores/resource-config'
import DataItemInfoBoxSpanPottery from '~/components/data/item/info-box/span/DataItemInfoBoxSpanPottery.vue'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'pottery', '/api/data/potteries/{id}'>
}>()

const { id: parentId } = useResourceParent(props.parent)

const { appPath } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/analyses/potteries/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/analyses/potteries/{id}'),
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
    <template #[`item.item.inventory`]="{ item }">
      <data-item-info-box-span-pottery
        :iri="item.subject['@id']"
        :text="item.subject.inventory"
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
      <data-dialog-search :path title="Pottery Analysis" />
      <data-dialog-create-analysis-pottery :path :parent @refresh="refetch()" />
      <data-dialog-delete-analysis-pottery @refresh="refetch()" />
      <data-dialog-update-analysis-pottery @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
