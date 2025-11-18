<script setup lang="ts">
import useAutocompleteQuery from '~/composables/queries/useAutocompleteQuery'
import type { ApiResourcePath } from '~/utils/consts/resources'
import type {
  GetItemPath,
  Iri,
  JsonLdItem,
  OperationPathParams,
} from '~~/types'

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
      // When a value is selected, fetch that specific item
      params.value = { id: extractIdFromIri(newValue as Iri) }
    } else {
      // When the model is cleared, also clear the item query params so the
      // previously selected item isn't kept around in the results.
      params.value = undefined
    }
  },
  { immediate: true },
)

// Combine items with selected item for display, de-duplicating by @id
const displayItems = computed(() => {
  const baseItems = items.value || []

  // If there is a selected item, prefer showing it at the top, but ensure
  // we do not produce duplicate keys for VVirtualScroll (item-value="@id").
  const combined = selectedItem.value
    ? [selectedItem.value, ...baseItems]
    : baseItems

  const seen = new Set<string>()
  return combined.filter((it) => {
    const key = it['@id'] as string | undefined
    if (!key) return true
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
})

const loading = computed(
  () =>
    asyncStatus.value === 'loading' ||
    getItemQuery.asyncStatus.value === 'loading',
)

const emit = defineEmits<{
  selected: [item: JsonLdItem | undefined]
}>()

watch(selectedItem, (newValue) => {
  emit('selected', newValue)
})
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
    <template v-for="(_index, name) in $slots" #[name]="slotProps">
      <slot :name v-bind="slotProps || {}" />
    </template>
  </v-autocomplete>
</template>
