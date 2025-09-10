<script
  setup
  lang="ts"
  generic="
    Path extends
      | Extract<GetCollectionPath, '/api/data/analyses/zoo/bones'>
      | '/api/data/zoo/bones/{parentId}/analyses'
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import useResourceConfig from '~/stores/resource-config'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'zooBone', '/api/data/zoo/bones/{id}'>
}>()

const { id: parentId } = useResourceParent(props.parent)

const { appPath } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/analyses/zoo/bones/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/analyses/zoo/bones/{id}'),
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
      <data-item-info-box-span-zoo-bone
        :iri="item.item['@id']"
        :text="item.item.code"
      />
    </template>
    <template #[`item.type.value`]="{ item }">
      {{ vocabularyAnalysisStore.getValue(item.type) }}
    </template>
    <template #[`item.summary`]="{ item }">
      <text-tooltip-span :text="item.summary" />
    </template>
    <template #dialogs="{ refetch }">
      <!--      <data-dialog-download :path title="Pottery Analysis" :parent-id />-->
      <data-dialog-search :path title="Animal bone analysis" />
      <data-dialog-create-zoo-bone-analysis
        :path
        :parent
        @refresh="refetch()"
      />
      <data-dialog-delete-zoo-bone-analysis @refresh="refetch()" />
      <data-dialog-update-zoo-bone-analysis @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
