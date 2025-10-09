<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/individuals'
      | '/api/data/stratigraphic_units/{parentId}/individuals'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'stratigraphicUnit'>
}>()

const { appPath } = useResourceConfig(props.path)
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
    <template #[`item.age.id`]="{ item }">
      {{ vocabularyIndividualAge.getValue(item.age) }}
    </template>
    <template #dialogs="{ refetch }">
      <!--      <data-dialog-download :path title="Context" />-->
      <!--      <data-dialog-search :path />-->
      <data-dialog-create-individual :path :parent @refresh="refetch()" />
      <data-dialog-delete-individual @refresh="refetch()" />
      <data-dialog-update-individual @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
