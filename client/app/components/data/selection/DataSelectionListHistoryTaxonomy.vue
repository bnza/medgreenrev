<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      ListGetCollectionPath,
      '/api/list/history/animals' | '/api/list/history/plants'
    >
  "
>
import type { Iri, ListGetCollectionPath } from '~~/types'
import { useGetCollectionListQuery } from '~/composables/queries/useGetCollectionListQuery'

const props = defineProps<{
  path: Path
  queryParams?: Record<string, any>
}>()

const search = ref('')
const innerQueryParams = toRef(props, 'queryParams')
watch(
  innerQueryParams,
  () => {
    search.value = ''
  },
  { deep: true },
)
const { items, asyncStatus } = useGetCollectionListQuery(
  props.path,
  search,
  innerQueryParams.value ?? undefined,
)

const model = defineModel<string | null | undefined>({ required: true })

const isApiListResponseItem = (
  item: unknown,
): item is { value: string; taxonomy: string | null } =>
  isApiResourceObject(item) && 'taxonomy' in item && 'value' in item

const hasTaxonomy = (item: unknown): boolean =>
  isApiListResponseItem(item) && item.taxonomy !== null

const modelTaxonomy = ref<string | null>(null)

const updateModel = computed({
  get() {
    return model.value
  },
  set(newValue: unknown) {
    if (newValue === null || newValue === '') {
      model.value = null
      modelTaxonomy.value = null
    } else if ('string' === typeof newValue) {
      model.value = newValue
      modelTaxonomy.value = null
    } else if (isApiListResponseItem(newValue)) {
      model.value = newValue.value
      modelTaxonomy.value = newValue.taxonomy
    }
  },
})

onUnmounted(() => {
  modelTaxonomy.value = null
})
</script>

<template>
  <v-combobox
    v-model="updateModel"
    v-model:search="search"
    :items
    :loading="asyncStatus === 'loading'"
    item-title="value"
  >
    <template #append>
      <span class="text-grey-darken-1">{{
        modelTaxonomy ?? 'No matching taxonomy'
      }}</span
      >&nbsp;<v-icon
        icon="far fa-circle-check"
        :color="modelTaxonomy ? 'success' : 'warning'"
        size="small"
        >{{
          `fas fa-circle-${modelTaxonomy ? 'check' : 'exclamation'}`
        }}</v-icon
      >
    </template>
    <template #item="{ item, props: slotProps }">
      <v-list-item v-bind="slotProps">
        <template v-if="hasTaxonomy(item)" #append
          ><v-icon icon="fas fa-circle-check" color="success" size="small" />
        </template>
      </v-list-item>
    </template>
  </v-combobox>
</template>
