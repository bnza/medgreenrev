<script setup lang="ts">
import type {
  ExpandedFilter,
  FilterState,
  SearchableGetCollectionPath,
} from '~~/types'

const props = defineProps<{
  filters: FilterState
  isChanged: boolean
  path: SearchableGetCollectionPath
}>()
defineEmits<{
  delete: [id: string]
  update: [id: string]
}>()
const text = computed(() =>
  props.isChanged
    ? 'All filters have been removed.'
    : 'No filter selected yet. Please add new filters clicking the plus button in the top right corner',
)
const { resourceFiltersDefinition } = useFilterConfig(props.path)
const expandedFilters = computed<Record<string, ExpandedFilter>>(() => {
  const entries = Object.entries(props.filters).map(([id, filter]) => {
    const definition = resourceFiltersDefinition[filter.property]?.[filter.key]
    return [
      id,
      definition ? { ...definition, operands: filter.operands } : undefined,
    ]
  })
  return Object.fromEntries(
    entries.filter(([_, definition]) => Boolean(definition)),
  )
})
</script>

<template>
  <v-list
    v-if="Object.keys(filters).length > 0"
    min-height="400px"
    data-testid="data-dialog-search-filters-list"
  >
    <data-dialog-search-filters-list-item
      v-for="(filter, key) in expandedFilters"
      :key
      :filter
      @delete="$emit('delete', String(key))"
      @update="$emit('update', String(key))"
    />
  </v-list>
  <v-empty-state
    v-else
    min-height="400px"
    title="No filter selected"
    :text
    data-testid="data-dialog-empty-state"
  />
</template>
