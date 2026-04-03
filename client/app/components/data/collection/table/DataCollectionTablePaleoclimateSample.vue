<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/paleoclimate_samples'
      | '/api/data/paleoclimate_sampling_sites/{parentId}/samples'
    >
  "
>
import type { CollectionAcl, GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'paleoclimateSamplingSite'>
  filterPath?: GetCollectionPath
}>()

const { id: parentId } = useResourceParent(props.parent)

const { appPath, labels } = useResourceConfig(props.path)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/paleoclimate_samples/{id}'),
)
const { updateDialogState } = storeToRefs(
  useResourceUpdateDialogStore('/api/data/paleoclimate_samples/{id}'),
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
    <template #[`item.site.code`]="{ item }">
      <data-item-info-box-span-paleoclimate-sampling-site
        :iri="item.site['@id']"
        :text="item.site.code"
      />
    </template>
    <template #[`item.precipitationRecord`]="{ item }">
      <v-checkbox-btn
        class="centered-item"
        :model-value="item.precipitationRecord"
        readonly
      />
    </template>
    <template #[`item.temperatureRecord`]="{ item }">
      <v-checkbox-btn
        class="centered-item"
        :model-value="item.temperatureRecord"
        readonly
      />
    </template>
    <template #[`item.stableIsotopes`]="{ item }">
      <v-checkbox-btn
        class="centered-item"
        :model-value="item.stableIsotopes"
        readonly
      />
    </template>
    <template #[`item.petrographicDescriptions`]="{ item }">
      <v-checkbox-btn
        class="centered-item"
        :model-value="item.petrographicDescriptions"
        readonly
      />
    </template>
    <template #[`item.fluidInclusions`]="{ item }">
      <v-checkbox-btn
        class="centered-item"
        :model-value="item.fluidInclusions"
        readonly
      />
    </template>
    <template #[`item.traceElements`]="{ item }">
      <v-checkbox-btn
        class="centered-item"
        :model-value="item.traceElements"
        readonly
      />
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-download :path :title="labels[1]" :parent-id :filter-path />
      <data-dialog-search :path :title="labels[1]" />
      <data-dialog-create-paleoclimate-sample
        :path
        :parent
        @refresh="refetch()"
      />
      <data-dialog-delete-paleoclimate-sample @refresh="refetch()" />
      <data-dialog-update-paleoclimate-sample @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
