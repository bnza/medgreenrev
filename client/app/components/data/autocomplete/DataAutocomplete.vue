<script setup lang="ts">
import useAutocompleteQuery from '~/composables/queries/useAutocompleteQuery'
import type { ApiResourcePath } from '~/utils/consts/resources'
import type { GetItemPath, Iri, OperationPathParams } from '~~/types'

const model = defineModel<string | null>()

interface Props {
  path: ApiResourcePath
  itemTitle: string
  grantedOnly?: boolean
  queryParams?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  grantedOnly: false,
  queryParams: () => ({}),
})

const search = ref('')
const { items, asyncStatus } = useAutocompleteQuery(
  props.path,
  search,
  props.grantedOnly,
  props.queryParams,
)

// Fetch the selected item if it's not in the current items list

const itemPath = `${props.path}/{id}` satisfies GetItemPath
const params = ref<OperationPathParams<typeof itemPath, 'get'>>()
const getItemQuery = useGetItemQuery(itemPath, params)

const selectedItem = computed(() => getItemQuery.data.value ?? undefined)

// Watch for model changes and fetch the selected item if not in current items
watch(
  model,
  async (newValue) => {
    search.value = ''

    if (newValue) {
      params.value = { id: extractIdFromIri(newValue as Iri) }
    }
  },
  { immediate: true },
)

// Combine items with selected item for display
const displayItems = computed(() => {
  const baseItems = items.value || []

  if (
    selectedItem.value &&
    !baseItems.find((item) => item['@id'] === model.value)
  ) {
    return [selectedItem.value, ...baseItems]
  }

  return baseItems
})

const loading = computed(
  () =>
    asyncStatus.value === 'loading' ||
    getItemQuery.asyncStatus.value === 'loading',
)
</script>

<template>
  <v-autocomplete
    v-model="model"
    no-filter
    item-value="@id"
    :items="displayItems"
    :item-title
    :loading
    @update:search="search = $event"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name v-bind="slotProps || {}" />
    </template>
  </v-autocomplete>
</template>
