<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/zoo/bones'
      | '/api/data/stratigraphic_units/{parentId}/zoo/bones'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
import useResourceConfig from '~/stores/resource-config'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<
    'stratigraphicUnit',
    '/api/data/stratigraphic_units/{id}'
  >
}>()

const { id: parentId } = useResourceParent(props.parent)

const vocabularyZooSpecies = useVocabularyStore('/api/vocabulary/zoo/species')
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

const { appPath } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/zoo/bones/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/zoo/bones/{id}'),
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
    <template #[`item.species.value`]="{ item }">
      {{ vocabularyZooSpecies.getValue(item.species) }}
    </template>
    <template #[`item.species.scientificName`]="{ item }">
      {{ vocabularyZooSpecies.getValue(item.species, 'scientificName') }}
    </template>
    <template #[`item.species.class`]="{ item }">
      {{ vocabularyZooSpecies.getValue(item.species, 'class') }}
    </template>
    <template #[`item.species.family`]="{ item }">
      {{ vocabularyZooSpecies.getValue(item.species, 'family') }}
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
      <!--          <data-dialog-download :path title="StratigraphicUnit" :parent-id />-->
      <data-dialog-search :path title="Zooarchaeology (bones)" />
      <data-dialog-create-zoo-bone :path :parent @refresh="refetch()" />
      <data-dialog-delete-zoo-bone @refresh="refetch()" />
      <data-dialog-update-zoo-bones @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
