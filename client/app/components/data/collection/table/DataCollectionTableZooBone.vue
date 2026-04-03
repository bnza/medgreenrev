<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/zoo/bones'
      | '/api/data/stratigraphic_units/{parentId}/zoo/bones'
      | '/api/data/archaeological_sites/{parentId}/zoo/bones'
    >
  "
>
import type { CollectionAcl, GetCollectionPath, ResourceParent } from '~~/types'
import type { SearchableGetCollectionPath } from '~/utils/consts/configs/filters'

const props = defineProps<{
  path: Path
  parent?:
    | ResourceParent<'stratigraphicUnit'>
    | ResourceParent<'archaeologicalSite'>
  filterPath?: GetCollectionPath
}>()

const { id: parentId } = useResourceParent(props.parent)

const vocabularyZooTaxonomy = useVocabularyStore(
  '/api/vocabulary/zoo/taxonomies',
)
const vocabularyZooBones = useVocabularyStore('/api/vocabulary/zoo/bones')
const vocabularyZooBoneParts = useVocabularyStore(
  '/api/vocabulary/zoo/bone_parts',
)

const stringifyEndPreserved = (value: number | null | undefined) => {
  if (!value) {
    return value
  }
  const parts = []
  if (value & 0b01) parts.push('D') // Distal
  if (value & 0b10) parts.push('P') // Proximal

  return parts.join(' + ')
}

const { appPath, labels } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/zoo/bones/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/zoo/bones/{id}'),
)

const searchPath = computed(
  () => (props.filterPath ?? props.path) as SearchableGetCollectionPath,
)

const acl = defineModel<CollectionAcl>('acl', { required: true })
</script>

<template>
  <data-collection-table
    :path
    :parent-id
    :filter-path
    @acl="acl = { ...acl, ...$event }"
  >
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
      <data-item-info-box-span-archaeological-site
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
    <template #[`item.part.value`]="{ item }">
      {{ vocabularyZooBoneParts.getValue(item.part) }}
    </template>
    <template #[`item.endsPreserved`]="{ item }">
      {{ stringifyEndPreserved(item.endsPreserved) }}
    </template>

    <template #dialogs="{ refetch }">
      <data-dialog-download :path :title="labels[1]" :parent-id :filter-path />
      <data-dialog-search :path="searchPath" :title="labels[1]" />
      <data-dialog-create-zoo-bone
        v-if="parent?.key !== 'archaeologicalSite'"
        :path
        :parent
        @refresh="refetch()"
      />
      <data-dialog-delete-zoo-bone @refresh="refetch()" />
      <data-dialog-update-zoo-bone @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
