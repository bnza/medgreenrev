<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/analyses/sediment_core_depth_botany_taxonomies'
      | '/api/data/analyses/sediment_core_depths/botany/{parentId}/taxonomies'
    >
  "
>
import type { CollectionAcl, GetCollectionPath, ResourceParent } from '~~/types'
const props = defineProps<{
  path: Path
  parent?: ResourceParent<'analysisSedimentCoreDepthBotany'>
}>()
const { id: parentId } = useResourceParent(props.parent)
const { appPath, labels } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore(
    '/api/data/analyses/sediment_core_depth_botany_taxonomies/{id}',
  ),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore(
    '/api/data/analyses/sediment_core_depth_botany_taxonomies/{id}',
  ),
)
const vocabularyBotanyTaxonomy = useVocabularyStore(
  '/api/vocabulary/botany/taxonomies',
)
const acl = defineModel<CollectionAcl>('acl', { required: true })
</script>
<template>
  <data-collection-table :path :parent-id @acl="acl = { ...acl, ...$event }">
    <template #[`item.id`]="{ item }">
      <v-btn-group>
        <navigation-resource-item-update
          :id="item.id"
          :disabled="!item._acl.canUpdate"
          :app-path
          @update="updateDialogState = { id: item.id }"
        />
        <navigation-resource-item-delete
          :id="item.id"
          :disabled="!item._acl.canDelete"
          :app-path
          @delete="deleteDialogState = { id: item.id }"
        />
      </v-btn-group>
    </template>
    <template #[`item.taxonomy.value`]="{ item }">
      {{ vocabularyBotanyTaxonomy.getValue(item.taxonomy) }}
    </template>
    <template #[`item.taxonomy.englishName`]="{ item }">
      {{ vocabularyBotanyTaxonomy.getValue(item.taxonomy, 'englishName') }}
    </template>
    <template #[`item.taxonomy.flat.class`]="{ item }">
      {{ vocabularyBotanyTaxonomy.getValue(item.taxonomy, 'flat.class') }}
    </template>
    <template #[`item.taxonomy.flat.family`]="{ item }">
      {{ vocabularyBotanyTaxonomy.getValue(item.taxonomy, 'flat.family') }}
    </template>
    <template #[`item.taxonomy.flat.genus`]="{ item }">
      {{ vocabularyBotanyTaxonomy.getValue(item.taxonomy, 'flat.genus') }}
    </template>
    <template #[`item.taxonomy.flat.species`]="{ item }">
      {{ vocabularyBotanyTaxonomy.getValue(item.taxonomy, 'flat.species') }}
    </template>
    <template #[`item.cf`]="{ item }">
      <v-checkbox-btn class="centered-item" :model-value="item.cf" readonly />
    </template>
    <template #[`item.sp`]="{ item }">
      <v-checkbox-btn class="centered-item" :model-value="item.sp" readonly />
    </template>
    <template #[`item.type`]="{ item }">
      <v-checkbox-btn class="centered-item" :model-value="item.type" readonly />
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-create-analysis-sediment-core-depth-botany-taxonomy
        :path
        :parent
        @refresh="refetch()"
      />
      <data-dialog-delete-analysis-sediment-core-depth-botany-taxonomy
        @refresh="refetch()"
      />
      <data-dialog-update-analysis-sediment-core-depth-botany-taxonomy
        @refresh="refetch()"
      />
    </template>
  </data-collection-table>
</template>
