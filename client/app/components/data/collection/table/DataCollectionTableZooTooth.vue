<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/zoo/teeth'
      | '/api/data/stratigraphic_units/{parentId}/zoo/teeth'
    >
  "
>
import type { CollectionAcl, GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'stratigraphicUnit'>
}>()

const { id: parentId } = useResourceParent(props.parent)

const vocabularyZooTaxonomy = useVocabularyStore(
  '/api/vocabulary/zoo/taxonomies',
)
const vocabularyZooBones = useVocabularyStore('/api/vocabulary/zoo/bones')

const { appPath, labels } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/zoo/teeth/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/zoo/teeth/{id}'),
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
    <template #[`item.stratigraphicUnit.site.code`]="{ item }">
      <data-item-info-box-span-site
        :iri="item.stratigraphicUnit.site['@id']"
        :text="item.stratigraphicUnit.site.code"
      />
    </template>
    <template #[`item.stratigraphicUnit.code`]="{ item }">
      <data-item-info-box-span-stratigraphic-unit
        :iri="item.stratigraphicUnit['@id']"
        :text="item.stratigraphicUnit.code"
      />
    </template>
    <template #[`item.taxonomy.value`]="{ item }">
      {{ vocabularyZooTaxonomy.getValue(item.taxonomy) }}
    </template>
    <template #[`item.taxonomy.vernacularName`]="{ item }">
      {{ vocabularyZooTaxonomy.getValue(item.taxonomy, 'vernacularName') }}
    </template>
    <template #[`item.taxonomy.class`]="{ item }">
      {{ vocabularyZooTaxonomy.getValue(item.taxonomy, 'class') }}
    </template>
    <template #[`item.taxonomy.family`]="{ item }">
      {{ vocabularyZooTaxonomy.getValue(item.taxonomy, 'family') }}
    </template>
    <template #[`item.element.value`]="{ item }">
      {{ vocabularyZooBones.getValue(item.element) }}
    </template>
    <template #[`item.connected`]="{ item }">
      {{ item.connected ? 'jaw' : 'loose' }}
    </template>

    <template #dialogs="{ refetch }">
      <data-dialog-download :path :title="labels[1]" :parent-id />
      <data-dialog-search :path :title="labels[1]" />
      <data-dialog-create-zoo-tooth :path :parent @refresh="refetch()" />
      <data-dialog-delete-zoo-tooth @refresh="refetch()" />
      <data-dialog-update-zoo-tooth @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
