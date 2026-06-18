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
import { GetCollectionOperation } from '~/api/operations/GetCollectionOperation'

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
const taxonomyLoading = ref(false)

// Dedicated operation used to resolve the taxonomy of a plain string value
// (e.g. when a form is duplicated and the value is injected as a string).
const taxonomyLookup = new GetCollectionOperation(props.path)

// When the model is set programmatically from an explicit list selection we
// already know the taxonomy, so we skip the async lookup for that change.
let suppressLookup = false

const resolveTaxonomy = async (value: string) => {
  const normalized = value.trim().toLowerCase()
  if (!normalized) {
    modelTaxonomy.value = null
    return
  }
  taxonomyLoading.value = true
  try {
    const response = await taxonomyLookup.request({ query: { value } })
    const match = (response.member ?? []).find(
      (item) =>
        isApiListResponseItem(item) && item.value.toLowerCase() === normalized,
    )
    // Guard against stale responses: only apply if the model still holds the
    // value we looked up.
    if (model.value === value) {
      modelTaxonomy.value =
        match && isApiListResponseItem(match) ? match.taxonomy : null
    }
  } catch {
    if (model.value === value) {
      modelTaxonomy.value = null
    }
  } finally {
    if (model.value === value) {
      taxonomyLoading.value = false
    }
  }
}

const updateModel = computed({
  get() {
    return model.value
  },
  set(newValue: unknown) {
    if (newValue === null || newValue === '') {
      model.value = null
      modelTaxonomy.value = null
    } else if ('string' === typeof newValue) {
      // Taxonomy resolution is delegated to the watcher below so that both
      // user typing and external (duplication) injection are handled.
      model.value = newValue
    } else if (isApiListResponseItem(newValue)) {
      suppressLookup = true
      modelTaxonomy.value = newValue.taxonomy
      model.value = newValue.value
    }
  },
})

watch(
  model,
  (value) => {
    if (suppressLookup) {
      suppressLookup = false
      return
    }
    if (value === null || value === undefined || value === '') {
      modelTaxonomy.value = null
      return
    }
    if ('string' === typeof value) {
      void resolveTaxonomy(value)
    }
  },
  { immediate: true },
)

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
    <template v-if="model !== null" #append-inner>
      <div class="wide-append-inner">
        <v-progress-circular
          v-if="taxonomyLoading"
          indeterminate
          size="16"
          width="2"
          color="grey-darken-1"
        />
        <template v-else>
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
      </div>
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

<style scoped>
.wide-append-inner {
  min-width: 120px;
  display: flex;
  align-items: center;
  white-space: nowrap; /* Prevent content from wrapping */
}

/* Also ensure the input area doesn't wrap */
:deep(.v-field__input) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
