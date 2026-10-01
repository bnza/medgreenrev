---
type: subsystem_specification
title: Dynamic Search & Filter Engine Subsystem
status: active
target_file: client/app/utils/consts/configs/filters/
---

# Dynamic Search & Filter Engine Subsystem

## Architectural Role

The dynamic search and filtering engine translates multi-attribute user filtering criteria into type-safe, URL-serialized API Platform / Hydra queries. Located under [client/app/utils/consts/configs/filters/](../../../client/app/utils/consts/configs/filters/), this subsystem provides a declarative bridge between UI search modals, reactive Pinia collection stores, and backend Doctrine query extensions.

By abstracting filtering into static definition registries, reusable operand components validated with `@regle/core`, and serialized query builders, the platform enforces consistent search semantics across 60+ collection endpoints, nested child resources, and WebGIS map layers.

---

## Filter Engine Architecture

```
                    [ DataCollectionTable / Page ]
                                  │
                                  ▼
                        [ DataDialogSearch.vue ]
                                  │
           ┌──────────────────────┴──────────────────────┐
           ▼                                             ▼
[ Property & Operator Selection ]          [ Dynamic Operand Component ]
(FILTERS_PATHS_MAP[path])                  (useFilterOperandComponents)
           │                               (Boolean, Numeric, Vocab, ...)
           │                               (@regle/core Form Validation)
           └──────────────────────┬──────────────────────┘
                                  ▼
                    [ useCollectionQueryStore ]
                     (filtersState, filterQueryObject)
                                  │
                                  ▼
                   [ API_FILTERS Serializers ]
                    (addToQueryObject, qs serialization)
                                  │
                                  ▼
             [ Symfony API: ?property[operator]=value ]
```

---

## Central Filter Registry (`client/app/utils/consts/configs/filters/index.ts`)

The central entry point indexes all collection endpoints that support advanced filtering:

### `SearchableGetCollectionPath` Union Type
Defines every collection endpoint in the application equipped with filter configurations. This encompasses:
* **Root Resources:** `/api/data/archaeological_sites`, `/api/data/potteries`, `/api/data/botany/seeds`, `/api/data/zoo/bones`, etc.
* **Sub-Resources & Nested Collections:** `/api/data/archaeological_sites/{parentId}/stratigraphic_units`, `/api/data/contexts/{parentId}/analyses/botany`, `/api/data/samples/{parentId}/analyses`, etc.
* **Scientific Analyses & Absolute Dating:** `/api/data/analyses`, `/api/data/analyses/absolute_dating`, `/api/data/analyses/{parentId}/absolute_dating`.

### `FILTERS_PATHS_MAP`
A strongly-typed record mapping every `SearchableGetCollectionPath` to its static filter definitions (`ResourceStaticFiltersDefinitionObject`):

```typescript
export const FILTERS_PATHS_MAP: Record<
  SearchableGetCollectionPath,
  ResourceStaticFiltersDefinitionObject
> = {
  '/api/data/analyses': resourceFilterDefinitions.analysis,
  '/api/data/analyses/absolute_dating': resourceFilterDefinitions.absDatingAnalysis,
  '/api/data/analyses/botany/charcoals': resourceFilterDefinitions.analysisBotany,
  '/api/data/analyses/botany/seeds': resourceFilterDefinitions.analysisBotany,
  '/api/data/archaeological_sites': resourceFilterDefinitions.archaeologicalSite,
  '/api/data/potteries': resourceFilterDefinitions.pottery,
  ...
}
```

---

## Static Filter Definitions & Serializers (`definitions.ts`)

Located at [client/app/utils/consts/configs/filters/definitions.ts](../../../client/app/utils/consts/configs/filters/definitions.ts), this module implements the query-generation engine:

### 1. Nested Relation Definition Factory (`generateResourceDefinition`)
Enables child resources to inherit filter definitions from parent entities with automated property path and label prefixing:

```typescript
export const generateResourceDefinition = <
  T extends ResourceStaticFiltersDefinitionObject,
>(
  resourceDefinition: T,
  prefix: [string, string] = ['', ''], // [propertyPrefix, propertyLabelPrefix]
  blacklistedProperties: (keyof T)[] = [],
): ResourceStaticFiltersDefinitionObject => { ... }
```
* **Property Nesting:** Prefixes field names with relational paths (e.g. inheriting `site.name` as `stratigraphicUnit.site.name`).
* **Blacklisting:** Strips irrelevant or redundant parent properties to avoid circular or confusing filter options in child tables.

### 2. Query Object Serializers (`AddToQueryObject`)
Transforms operand values into Hydra/PHP query structures:

* **`addToQueryObjectSingle`:** Directly assigns scalar values (`queryObject[property] = value`).
* **`addOperatorToQueryObjectSingle(operator)`:** Generates nested operator objects for comparison operators (`queryObject[property][operator] = value`, such as `gt`, `gte`, `lt`, `lte`).
* **`addToQueryObjectMultiple`:** Appends values to an array for multi-value filtering.
* **`addToQueryObjectArrayNumericId`:** Extracts numeric IDs from JSON-LD IRIs (`/api/vocabulary/pottery_shapes/42` -> `42`) to pass clean identifiers to backend integer filters.

### 3. Static Filter Definitions (`API_FILTERS`)
Maps filter keys to their UI component representations and query-generation behavior:

| Filter Key | Component Key | Operator / Label | Query Serialization Result |
|:---|:---|:---|:---|
| `SearchPartial` | `Single` | `contains` | `?property=text` |
| `SearchExact` | `Single` | `equals` | `?property[]=exact_match` |
| `NumericEqual` | `Numeric` | `equals` | `?property[]=10` |
| `NumericGreaterThan` | `Numeric` | `greater than` | `?property[gt]=10` |
| `NumericLessThan` | `Numeric` | `less than` | `?property[lt]=10` |
| `RangeNumeric` | `NumericRange` | `between` | `?property[gte]=min&property[lte]=max` |
| `Vocabulary` | `Vocabulary` | `in` | `?property[]=/api/vocab/1&property[]=/api/vocab/2` |
| `Boolean` | `Boolean` | `is` | `?property=true` |

---

## Search Operand Components (`client/app/components/data/dialog/search/operand/`)

Filter inputs are rendered through dedicated operand components, resolved dynamically by [client/app/composables/useFilterOperandComponents.ts](../../../client/app/composables/useFilterOperandComponents.ts):

* **`DataDialogSearchOperandBoolean.vue`:** Renders binary switches (`true` / `false`) with localized labels.
* **`DataDialogSearchOperandSingle.vue`:** Text input for freeform strings and identifiers.
* **`DataDialogSearchOperandNumeric.vue`:** Numeric input enforcing valid integer or float formats.
* **`DataDialogSearchOperandNumericRange.vue`:** Dual-field input (`min` / `max`) integrated with `@regle/core`:
  * Validates that `min` is less than or equal to `max` (`lessThanOrEqual`).
  * Validates that `max` is greater than or equal to `min` (`greaterThanOrEqual`).
  * Binds reactive validity via `defineModel<boolean>('valid')`.
* **`DataDialogSearchOperandVocabulary.vue`:** Dynamic autocomplete dropdown backed by `useDynamicVocabularyStore`, providing pagewalking and cached label lookup.
* **Specialist Entity Operands:** `DataDialogSearchOperandArchaeologicalSite`, `SamplingSite`, `StratigraphicUnit`, `WrittenSource`, and `HistoryLocation` provide specialized entity lookups with code/name chips.

---

## Composable & UI Workflow Integration

### 1. Search Dialog Modal (`DataDialogSearch.vue`)
Embedded within `DataCollectionTable[Resource].vue` headers via `DataToolbarCollectionFilterMenu.vue`:
1. The user selects a target property from the resource's `FILTERS_PATHS_MAP` configuration.
2. The user selects an operator (e.g., `contains`, `equals`, `between`).
3. `useFilterOperandComponents` dynamically renders the corresponding operand component.
4. The dialog watches operand validity (`valid`) and disables confirmation if validation rules fail.
5. On submit, new filter objects (`Filter`) are pushed into the collection store via `setFilters(map)`.

### 2. Reactive Store Synchronization
The active filters are stored in `useCollectionQueryStore(path).filtersState`:
* `filterQueryObject` continuously re-computes the serialized query dictionary.
* `queryObject` merges active filters with current pagination (`page`, `itemsPerPage`, `sortBy`).
* Pinia Colada's `useGetCollectionQuery` detects changes to `queryObject`, automatically fetching fresh results and caching them under `RESOURCE_QUERY_KEY.byFilter`.

### 3. Sub-Collection Filter Sharing
When viewing child resources (e.g. site analyses), the table passes `filterPath` pointing to the root collection path. This binds the search dialog directly to the root filter definition and store, enabling shared filter synchronization across child tables and WebGIS map layers.

---

## Key Relationships

* **Filter Registry:** [client/app/utils/consts/configs/filters/index.ts](../../../client/app/utils/consts/configs/filters/index.ts)
* **Filter Definitions:** [client/app/utils/consts/configs/filters/definitions.ts](../../../client/app/utils/consts/configs/filters/definitions.ts)
* **Operand Resolver:** [client/app/composables/useFilterOperandComponents.ts](../../../client/app/composables/useFilterOperandComponents.ts)
* **Operand Components:** [client/app/components/data/dialog/search/operand/](../../../client/app/components/data/dialog/search/operand/)
* **Collection Query Store:** [client/app/stores/useCollectionQueryStore.ts](../../../client/app/stores/useCollectionQueryStore.ts)
* **State Data Layer Specification:** [State Management & Data Layer Architecture](./state_data_layer.md)
* **Resource CRUD Specification:** [Resource Configuration & CRUD Workflow Subsystem](./resource_crud_workflow.md)

---

## Related Nodes

* Back to [Frontend Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)