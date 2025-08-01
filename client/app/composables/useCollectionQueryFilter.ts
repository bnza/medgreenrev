import type { Filter, FilterState, SearchableGetCollectionPath } from '~~/types'
import { createAvailableFiltersMap } from '~/utils/filters'

/**
 * Composable for managing filter state modification and display in the DataDialogSearchFilter component.
 *
 * The composable serves as the primary interface for handling individual filter creation and editing
 * within the search dialog system. It provides reactive state management for filter property and
 * operation selection, dynamically determines available filter options based on existing filters,
 * and handles the synchronization between UI state and filter data structures.
 *
 * ## Primary Use Case
 * Used exclusively by `DataDialogSearchFilter.vue` to:
 * - Populate property and operation dropdown selections
 * - Manage form state during filter creation/editing
 * - Provide dynamic filtering of available options based on current filter state
 * - Handle filter data synchronization and validation
 *
 * ## Component Integration
 * The composable integrates with the broader search system:
 * - `DataDialogSearch.vue`: Parent dialog that manages the overall filter collection
 * - `DataDialogSearchFilter.vue`: Direct consumer for individual filter editing
 * - `DataDialogSearch*.vue` operand components: Receive component keys to render appropriate inputs
 *
 * ## Filter Availability Logic
 * Dynamically filters available options based on:
 * - Existing active filters in the current filter state
 * - Filter multiplicity rules (single-use vs multi-use filters)
 * - Authentication and field protection rules from the filter configuration
 *
 * @example
 * ```typescript
 * // In DataDialogSearchFilter.vue
 * const {
 *   propertyLabel,
 *   operationLabel,
 *   availableProperties,
 *   availableOperations,
 *   filterComponentKey,
 *   getFilter,
 *   syncState
 * } = useCollectionQueryFilter(props.path, toRef(props, 'filters'))
 *
 * // Property selection drives operation availability
 * watch(propertyLabel, () => {
 *   operationLabel.value = undefined // Reset operation when property changes
 * })
 *
 * // Component selection for operand input
 * const operandsComponent = computed(() => {
 *   return operandComponentsMap[filterComponentKey.value]
 * })
 * ```
 */
export const useCollectionQueryFilter = (
  path: SearchableGetCollectionPath,
  filters: Ref<FilterState>,
) => {
  const { componentFiltersMap, resourceFiltersDefinition } =
    useFilterConfig(path)

  /**
   * Available filters map that excludes already-used single-instance filters.
   * This computed property ensures that:
   * - Single-use filters (multiple: false) are hidden once applied
   * - Multi-use filters (multiple: true) remain available even when active
   * - Properties with no available operations are completely hidden
   */
  const availableFiltersMap = computed(() =>
    createAvailableFiltersMap(componentFiltersMap.value, filters.value),
  )

  /** Currently selected property label in the filter form */
  const propertyLabel = ref<string>()

  /** Currently selected operation label in the filter form */
  const operationLabel = ref<string>()

  /**
   * Array of available property labels for the property dropdown.
   * Automatically updates based on current filter state and filter multiplicity rules.
   */
  const availableProperties = computed(() =>
    Object.keys(availableFiltersMap.value),
  )

  /**
   * Array of available operation labels for the selected property.
   * Returns empty array if no property is selected or property doesn't exist.
   * Uses the full componentFiltersMap to show all operations for the selected property,
   * not just the available ones, since operation filtering happens at the property level.
   */
  const availableOperations = computed(() =>
    propertyLabel.value
      ? Object.keys(componentFiltersMap.value[propertyLabel.value] || {})
      : [],
  )

  /**
   * Complete filter definition object for the current property/operation selection.
   * Contains all metadata needed to construct and validate the filter including:
   * - API filter key and property path
   * - Component key for operand input rendering
   * - Multiplicity and validation rules
   */
  const filterDefinition = computed(() => {
    if (!operationLabel.value || !propertyLabel.value) {
      return undefined
    }

    // Check if propertyLabel exists in componentFiltersMap
    const propertyFilters = componentFiltersMap.value[propertyLabel.value]
    if (!propertyFilters) {
      return undefined
    }

    return propertyFilters[operationLabel.value]
  })

  /** API filter key from the current filter definition (e.g., 'SearchExact', 'Exists') */
  const filterDefinitionKey = computed(() => filterDefinition.value?.key)

  /**
   * Component key determining which operand input component to render.
   * Maps to components like 'Single' -> DataDialogSearchOperandSingle, 'Boolean' -> DataDialogSearchOperandBoolean
   */
  const filterComponentKey = computed(
    () => filterDefinition.value?.componentKey,
  )

  /**
   * Retrieves and clones a filter by ID, or creates a new empty filter.
   * Uses structuredClone to prevent mutation of the original filter data.
   */
  const getFilter = (id?: string) => {
    if (id) {
      const filterDefinition = filters.value[id]
      return structuredClone(
        toRaw(filterDefinition) || ({ operands: [] } as Partial<Filter>),
      )
    }
    return { operands: [] } as Partial<Filter>
  }

  /**
   * Synchronizes UI state (propertyLabel, operationLabel) with an existing filter.
   * Used when editing an existing filter to populate the form with current values.
   */
  const syncState = (id?: string) => {
    const filter = getFilter(id)
    if (id) {
      const filterDefinition =
        filter.property && filter.key
          ? resourceFiltersDefinition[filter.property]?.[filter.key]
          : undefined
      propertyLabel.value = filterDefinition?.propertyLabel
      operationLabel.value = filterDefinition?.operationLabel
    }
    return filter
  }

  return {
    propertyLabel,
    operationLabel,
    availableOperations,
    availableProperties,
    filterDefinition,
    filterDefinitionKey,
    filterComponentKey,
    getFilter,
    syncState,
  }
}

export default useCollectionQueryFilter
