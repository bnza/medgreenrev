import type {
  ExpandedFilter,
  Filter,
  FilterState,
  SearchableGetCollectionPath,
} from '~~/types'
import { createAvailableFiltersMap } from '~/utils/filters'

/**
 * Composable for managing individual filter state in collection search dialogs.
 *
 * Provides reactive state management for filter property and operation selection,
 * dynamically determines available filter options based on existing filters,
 * and handles synchronization between UI state and filter data structures.
 *
 * @example
 * ```typescript
 * // In DataDialogSearchFilter.vue - Individual filter editing
 * const {
 *   propertyLabel,
 *   operationLabel,
 *   availableProperties,
 *   availableOperations,
 *   filterComponentKey,
 *   getFilter,
 *   syncState
 * } = useCollectionQueryFilter(props.path, computed(() => props.filters))
 *
 * // Property selection drives operation availability
 * watch(propertyLabel, () => {
 *   operationLabel.value = undefined // Reset operation when property changes
 * })
 * ```
 *
 * @example
 * ```typescript
 * // In DataDialogSearchFiltersList.vue - Filter list display
 * const { expandedFilters } = useCollectionQueryFilter(
 *   props.path,
 *   computed(() => props.filters) // Use computed for proper reactivity
 * )
 * ```
 *
 * ## Core Functionality
 *
 * ### Filter Availability Logic
 * - Filters available options based on existing active filters
 * - Respects filter multiplicity rules (single-use vs multi-use)
 * - Integrates with authentication and field protection rules
 *
 * ### State Management
 * - `propertyLabel` / `operationLabel`: Currently selected filter criteria
 * - `availableProperties` / `availableOperations`: Dynamic option arrays
 * - `filterDefinition`: Complete metadata for current selection
 * - `expandedFilters`: Enriched filter objects for display
 *
 * ### Component Integration
 * - `filterComponentKey`: Determines which operand input component to render
 * - Maps to: 'Single' → DataDialogSearchOperandSingle, 'Boolean' → DataDialogSearchOperandBoolean, etc.
 *
 * ## Usage Patterns
 *
 * **Filter Creation/Editing**: Used by `DataDialogSearchFilter.vue` for form state management
 * **Filter Display**: Used by `DataDialogSearchFiltersList.vue` for rendering filter summaries
 * **Parent Integration**: Connects with `DataDialogSearch.vue` filter collection management
 *
 * ## Reactivity Notes
 *
 * ⚠️ **Important**: Pass filters using `computed(() => props.filters)` instead of `toRef(props.filters)`
 * to ensure proper reactivity chain when parent computed properties update.
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

  const expandedFilters = computed<Record<string, ExpandedFilter>>(() => {
    const entries = Object.entries(filters.value).map(([id, filter]) => {
      const definition =
        resourceFiltersDefinition[filter.property]?.[filter.key]
      return [
        id,
        definition ? { ...definition, operands: filter.operands } : undefined,
      ]
    })
    return Object.fromEntries(
      entries.filter(([_, definition]) => typeof definition !== 'undefined'),
    )
  })

  const expandedFilter = computed<ExpandedFilter | undefined>(() => {
    if (!propertyLabel.value || !operationLabel.value) {
      return undefined
    }
    return Object.values(expandedFilters).find(
      (expandedFilter) =>
        expandedFilter?.propertyLabel === propertyLabel.value &&
        expandedFilter?.operationLabel === operationLabel.value,
    )
  })

  return {
    expandedFilters,
    expandedFilter,
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
