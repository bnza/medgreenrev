<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/individuals'
      | '/api/data/stratigraphic_units/{parentId}/individuals'
      | '/api/data/archaeological_sites/{parentId}/individuals'
    >
  "
>
import type { CollectionAcl, GetCollectionPath, ResourceParent } from '~~/types'
import type { SearchableGetCollectionPath } from '~/utils/consts/configs/filters'

const props = defineProps<{
  path: P
  parent?:
    | ResourceParent<'stratigraphicUnit'>
    | ResourceParent<'archaeologicalSite'>
  filterPath?: GetCollectionPath
}>()

const { appPath, labels } = useResourceConfig(props.path)
const { id: parentId } = useResourceParent(props.parent)

const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/individuals/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/individuals/{id}'),
)

const vocabularyIndividualAge = useVocabularyStore(
  '/api/vocabulary/individual/age',
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
    <template #[`item.age.id`]="{ item }">
      {{ vocabularyIndividualAge.getValue(item.age) }}
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-download :path :title="labels[1]" :parent-id />
      <data-dialog-search :path="searchPath" :title="labels[1]" />
      <data-dialog-create-individual
        v-if="parent?.key !== 'archaeologicalSite'"
        :path
        :parent
        @refresh="refetch()"
      />
      <data-dialog-delete-individual @refresh="refetch()" />
      <data-dialog-update-individual @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
