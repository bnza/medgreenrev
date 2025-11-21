<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/botany/seeds'
      | '/api/data/stratigraphic_units/{parentId}/botany/seeds'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'stratigraphicUnit'>
}>()

const { id: parentId } = useResourceParent(props.parent)

const vocabularyZooTaxonomy = useVocabularyStore(
  '/api/vocabulary/botany/taxonomies',
)
const vocabularyBotanyElements = useVocabularyStore(
  '/api/vocabulary/botany/elements',
)
const vocabularyBotanyElementParts = useVocabularyStore(
  '/api/vocabulary/botany/element_parts',
)

const { appPath, labels } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/botany/seeds/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/botany/seeds/{id}'),
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
      {{ vocabularyBotanyElements.getValue(item.element) }}
    </template>
    <template #[`item.part.value`]="{ item }">
      {{ vocabularyBotanyElementParts.getValue(item.part) }}
    </template>

    <template #dialogs="{ refetch }">
      <data-dialog-download :path :title="labels[1]" :parent-id />
      <data-dialog-search :path :title="labels[1]" />
      <data-dialog-create-botany-seed :path :parent @refresh="refetch()" />
      <data-dialog-delete-botany-seed @refresh="refetch()" />
      <data-dialog-update-botany-seed @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
