<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/potteries'
      | '/api/data/stratigraphic_units/{parentId}/potteries'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

const vocabularyPotteryShapeStore = useVocabularyStore(
  '/api/vocabulary/pottery/shapes',
)

const vocabularyCulturalContextStore = useVocabularyStore(
  '/api/vocabulary/cultural_contexts',
)

const vocabularyPotteryFunctionalGroupStore = useVocabularyStore(
  '/api/vocabulary/pottery/functional_groups',
)

const vocabularyPotteryFunctionalFormStore = useVocabularyStore(
  '/api/vocabulary/pottery/functional_forms',
)

const vocabularyPotterySurfaceTreatmentStore = useVocabularyStore(
  '/api/vocabulary/pottery/surface_treatments',
)

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'stratigraphicUnit'>
}>()

const { appPath, labels } = useResourceConfig(props.path)
const { id: parentId } = useResourceParent(props.parent)

const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/potteries/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/potteries/{id}'),
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
    <template #[`item.culturalContext.id`]="{ item }">
      {{ vocabularyCulturalContextStore.getValue(item.culturalContext) }}
    </template>
    <template #[`item.shape.value`]="{ item }"
      >{{ vocabularyPotteryShapeStore.getValue(item.shape) }}
    </template>
    <template #[`item.functionalGroup.value`]="{ item }">
      {{ vocabularyPotteryFunctionalGroupStore.getValue(item.functionalGroup) }}
    </template>
    <template #[`item.functionalForm.value`]="{ item }">
      <p>
        {{ vocabularyPotteryFunctionalFormStore.getValue(item.functionalForm) }}
      </p>
    </template>
    <template #[`item.surfaceTreatment.value`]="{ item }">
      <p>
        {{
          vocabularyPotterySurfaceTreatmentStore.getValue(item.surfaceTreatment)
        }}
      </p>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-download :path :title="labels[1]" :parent-id />
      <data-dialog-search :path :title="labels[1]" />
      <lazy-data-dialog-create-pottery :path :parent @refresh="refetch()" />
      <data-dialog-delete-pottery @refresh="refetch()" />
      <data-dialog-update-pottery @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
