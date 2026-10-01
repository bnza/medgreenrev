---
type: frontend_architecture
title: State Management & Data Layer Architecture
status: active
target_file: client/app/stores/
---

# State Management & Data Layer Architecture

## Architectural Role

The client data architecture coordinates reactive UI state, asynchronous API interactions, client-side caching, dynamic vocabulary loading, and OpenAPI schema introspection. Built on Vue 3, Pinia, and Pinia Colada (`@pinia/colada`), it provides type-safe, declarative data fetching derived directly from backend OpenAPI schemas while guaranteeing data consistency across tables, item pages, modal dialogs, and WebGIS map layers.

---

## Data Layer Architecture Overview

```
                      [ Vue 3 UI Components / Pages ]
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
 [ Collection Query Store ]  [ Dynamic Vocab Store ]   [ Pinia UI Stores ]
  `collection-query:${path}` `dynamicVocabulary:${p}`  (Nav, Messages, Dialogs,
  (Pagination, Filters, Qs)   (Microtask ID Queue,      Map Exclusive Layers)
           │                  Pagewalking, Cache)              │
           │                         │                         │
           └─────────────────────────┼─────────────────────────┘
                                     ▼
                        [ Pinia Colada Query Cache ]
                         `useAppQueryCache.ts`
                    (Hierarchical Keys, Invalidation)
                                     │
                                     ▼
                         [ BaseOperation Layer ]
                    ($fetch, qs serialization, 401 JWT refresh)
                                     │
                                     ▼
                       [ Symfony REST API Backend ]
```

---

## Application Store Architecture (`client/app/stores/`)

Application state is modularized into specialized Pinia stores organized by functional domain:

### 1. UI & Navigation Stores
* **`useAppNavigationDrawerStore.ts`:** Manages responsive drawer collapse, drawer rails, and temporary drawer overlay states for mobile/desktop viewports.
* **`useAppUiModeStore.ts`:** Governs global viewport mode (`default` tabular/form view vs `map` fullscreen WebGIS view), switching icons (`fas fa-globe` vs `fas fa-table`).
* **`useHistoryStackStore.ts`:** Tracks user navigation history stack (`HistoryStackItem[]`). Employs `pushForcedLogin` during auth firewall intercepts and computes `redirectionPath` to return users to their intended view upon successful authentication.
* **`useMessagesStore.ts`:** Centralized snackbar alert queue (`SnackbarMessage[]`). Supports timed success alerts and persistent error cards, with automated parsing for Symfony 422 Hydra constraint violations (`isHydraConstraintViolation`).

### 2. Modal Dialog & Mutation Stores
* **`useResourceCreateDialogStore.ts` / `useResourceUpdateDialogStore.ts`:** Manage active form state, entity ID, parent relation IRIs, and modal visibility during creation and update operations.
* **`useResourceDeleteDialogStore.ts`:** Controls deletion confirmation modals, managing item IRI, deletion locks, and execution states.
* **`useResourceDownloadDialogStore.ts`:** Manages CSV dataset export modals, column selections, and filter forwarding.
* **`useUserPasswordDialogStore.ts`:** Coordinates administrator password reset dialog workflows.

### 3. Spatial & WebGIS Stores
* **`useMapStore.ts`:** Manages OpenLayers map viewport state, center coordinates, zoom level, and bounding box extent.
* **`useMapBaseMapStore.ts`:** Manages base tile layer selections (OSM vs ESRI Satellite / Topo).
* **`useMapLayerExclusiveVisibilityStore.ts`:** Enforces mutual layer exclusivity across archaeological and specialist thematic groups.
* **`useMapVectorApiStore.ts`:** Manages vector layer visibility, opacity, label options, and aggregation mode flags (`showNumberMatched`).
* **`useMapVectorApiStyleStore.ts`:** Manages dynamic OpenLayers vector styling functions, label factories, and layer redraw triggers.

---

## Collection Query Store (`useCollectionQueryStore.ts`)

The collection query store is the core reactive driver for all tabular data, search filters, and collection pagination. Stores are instantiated as parameterized singletons per API endpoint path via `useCollectionQueryStore(path)`:

* **Store Identifier:** `collection-query:${path}` (e.g., `collection-query:/api/data/archaeological_sites`).
* **Pagination State:** Tracks `DataTableComponentOptions`:
  ```typescript
  {
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    groupBy: []
  }
  ```
  Serialized to backend format via `dataTableOptionsToQsObject(pagination.value)`.
* **Search State:** `searchValue` extracted from `pagination.value.search` and appended to queries as `?search=...`.
* **Reactive Filter State:**
  * `filtersState`: A `shallowRef<FilterState>({})` dictionary storing active filter configurations indexed by unique property keys.
  * `isFiltered`: Computed boolean indicating if active filters are applied (`Object.keys(filtersState.value).length > 0`).
  * `clonedFilters`: Deep clone of current filter state for dialog isolation.
  * `setFilters(map)`: Bulk assigns new filter criteria from UI search dialogs.
  * `clearFilters()`: Resets all active filters.
* **Query Serialization (`filterQueryObject`):** Iterates over active filters in `filtersState.value` and invokes the corresponding serializer from `API_FILTERS[filter.key].addToQueryObject(queryObject, filter)`.
* **Combined Query Object (`queryObject`):** Merges `paginationQueryObject` and `filterQueryObject` into the final parameters object supplied to `GetCollectionOperation`.

---

## Sub-Collection Filter Sharing Invariant (`filterPath`)

In scientific domain workflows, child collections (e.g. archaeobotanical seed analyses associated with a specific excavation site) are queried via sub-resource endpoints such as `/api/data/archaeological_sites/{parentId}/analyses/botany/seeds`. However, these child collections must share the exact same filter definitions, search dialogs, and active filter states as the root collection `/api/data/analyses/botany/seeds`.

This is achieved via the `filterPath` parameter pattern in [client/app/composables/queries/useGetCollectionQuery.ts](../../../client/app/composables/queries/useGetCollectionQuery.ts):

```typescript
export function useGetCollectionQuery(
  path: GetCollectionPath,
  params?: Ref<OperationPathParams<typeof path, 'get'> | undefined>,
  filterPath?: GetCollectionPath,
) {
  // Bind store totalItems to the actual sub-resource path
  const { totalItems: storeTotalItems } = storeToRefs(
    useCollectionQueryStore(path),
  )

  // Derive pagination and active filters from the root filterPath if provided
  const { pagination, queryObject } = storeToRefs(
    useCollectionQueryStore(filterPath ?? path),
  )

  const key = computed(() =>
    RESOURCE_QUERY_KEY.byFilter({
      ...queryObject.value,
      ...(params?.value || {}),
    }),
  )
  ...
}
```

### Invariant Rules
1. **Independent Pagination & Totals:** Each sub-resource maintains its own `totalItems` and pagination state under its specific `path`.
2. **Shared Filter State:** When `filterPath` is passed to `DataCollectionPage`, `DataCollectionTable`, or `useGetCollectionQuery`, the active filter criteria are bound to the root resource store.
3. **Cross-View Filter Consistency:** Applying a filter on the root collection table immediately synchronizes with related sub-resource tables and WebGIS map layers without state duplication or prop drilling.

---

## Query Cache Architecture (`useAppQueryCache.ts`)

Query caching is managed by Pinia Colada (`@pinia/colada`) and wrapped by [client/app/composables/queries/useAppQueryCache.ts](../../../client/app/composables/queries/useAppQueryCache.ts):

### Cache Key Hierarchy
Query keys are structured hierarchically to enable targeted invalidation:

* **Root Resource Key (`QUERY_KEYS.root`):** `[rootKey]` (where `rootKey` is the canonical `ApiResourcePath`, e.g. `['/api/data/archaeological_sites']`).
* **Search Query Key (`QUERY_KEYS.bySearch`):** `[...root, value, grantedOnly, queryParams]`.
* **Resource Path Key (`RESOURCE_QUERY_KEY.root`):** `[rootKey, resourcePath]`.
* **Filter Query Key (`RESOURCE_QUERY_KEY.byFilter`):** `[...root, query || {}]`.
* **Item Query Key (`RESOURCE_QUERY_KEY.byId`):** `[...root, params]`.

### Automated Auth-State Invalidation
`useAppQueryCache` watches `statusChanged` from `useAppAuth()`. Whenever a user logs in, logs out, or transitions authentication state, the cache automatically invalidates all queries under `QUERY_KEYS.root`:

```typescript
watch(
  () => statusChanged.value,
  async () => {
    await invalidateQueries({ key: QUERY_KEYS.root })
  },
)
```

---

## Mutation Invalidation Lifecycle

Mutations are orchestrated via dedicated composables that trigger cache invalidation upon settlement:

* **Creation (`usePostCollectionMutation.ts`):** On `onSettled`, calls `invalidateQueries({ key: QUERY_KEYS.root })`, clearing all cached collection pages and filter queries for the modified resource.
* **Update (`usePatchItemMutation.ts`):** Updates the target item and executes dual invalidation:
  * Invalidates primary resource collection queries: `invalidateQueries({ key: QUERY_KEYS.root })`.
  * Invalidates linked sub-resources using `patchedSubresourceMap` (e.g. patching an analysis automatically invalidates its counterpart in `/api/data/analyses/absolute_dating/*`).
* **Deletion (`useDeleteItemMutation.ts`):** Removes the entity and invalidates collection caches under `QUERY_KEYS.root`.

---

## Dynamic Vocabulary Store (`useDynamicVocabularyStore.ts`)

Controlled vocabularies and lookup entities (e.g. pottery functional forms, chronological periods, preservation states) are managed by [client/app/stores/useDynamicVocabularyStore.ts](../../../client/app/stores/useDynamicVocabularyStore.ts).

### Batched Microtask ID-Lookup Queue (Eliminating N+1 Queries)
When large data tables render hundreds of cells containing vocabulary IRI references (e.g., `vocabulary/pottery_shapes/42`), resolving each reference individually would trigger hundreds of HTTP requests. The store solves this via an internal microtask queue:

```typescript
const CHUNK_SIZE = 100
let queue = new Set<string>()
let scheduled = false

const enqueue = (iri: string) => {
  if (items.value.has(iri) || queue.has(iri)) return
  queue.add(iri)
  pending.value.add(iri)
  if (!scheduled) {
    scheduled = true
    queueMicrotask(flush)
  }
}
```

1. Each table cell calls `getValue(iri)`. If the IRI is not yet cached, it calls `enqueue(iri)`.
2. All lookups within the same event loop tick are coalesced into `queue`.
3. `flush()` executes at the next microtask, slicing up to 100 IDs into a single batch query: `GET {path}?id[]={id1}&id[]={id2}...`.
4. Retrieved entities are projected into `items.value.set(item['@id'], item)` with `staleTime: 10m` and `gcTime: 10m`.

### Pagewalking & Pickers
* `fetchPage(page, { search, order })`: Allows select dropdowns and autocomplete pickers to pagewalk vocabulary collections with server-side search and caching.
* **Write-Through Caching:** `upsert(item)` and `remove(iri)` update local cache maps synchronously and invalidate Colada query keys `[path, 'page']`.

---

## Runtime OpenAPI Store (`useOpenapiStore.ts`)

Located at [client/app/stores/useOpenapiStore.ts](../../../client/app/stores/useOpenapiStore.ts), `useOpenApiStore` consumes the OpenAPI schema snapshot served at `/docs.jsonopenapi.json`:

* **`findApiResourcePath(targetPath)`:** Resolves an arbitrary endpoint path (such as a nested subresource `/api/admin/users/{parentId}/site_user_privileges`) to its canonical API resource path (`/api/admin/site_user_privileges`) by analyzing shared OpenAPI operation tags.
* **`getRelatedItemPaths(itemPath)`:** Discovers all item endpoints sharing tags with `itemPath`.
* **`isValidOperationPathParams(path, method, param)`:** Validates required vs optional URL path parameters before operations dispatch HTTP requests.
* **`findApiResourceKeyFromPath(path)`:** Reverse-maps an API path to its `ApiResourceKey` in `API_RESOURCE_MAP`.

---

## HTTP Operation Layer (`BaseOperation.ts`)

All asynchronous network communication is encapsulated in typed operation classes extending [client/app/api/operations/BaseOperation.ts](../../../client/app/api/operations/BaseOperation.ts):

* **URL Template Expansion:** `expandUrlTemplate` replaces parameterized segments (`{id}`, `{parentId}`) with stringified arguments.
* **Query Serialization:** Formats query objects using `qs.stringify` to support nested PHP query parameters.
* **Automatic 401 JWT Refresh Interceptor:**
  ```typescript
  onResponseError: async (context) => {
    if (status.value === 'authenticated' && context.response.status === 401) {
      if (context.response._data?.message === 'Expired JWT Token') {
        await refresh()
      }
    }
  }
  ```
  If an authenticated request fails with an expired token, the interceptor automatically calls `@sidebase/nuxt-auth`'s `refresh()` method before re-evaluating error hooks.

---

## Key Relationships

* **Collection Query Store:** [client/app/stores/useCollectionQueryStore.ts](../../../client/app/stores/useCollectionQueryStore.ts)
* **Query Cache Composable:** [client/app/composables/queries/useAppQueryCache.ts](../../../client/app/composables/queries/useAppQueryCache.ts)
* **Get Collection Query:** [client/app/composables/queries/useGetCollectionQuery.ts](../../../client/app/composables/queries/useGetCollectionQuery.ts)
* **Dynamic Vocabulary Store:** [client/app/stores/useDynamicVocabularyStore.ts](../../../client/app/stores/useDynamicVocabularyStore.ts)
* **OpenAPI Runtime Store:** [client/app/stores/useOpenapiStore.ts](../../../client/app/stores/useOpenapiStore.ts)
* **Base Operation:** [client/app/api/operations/BaseOperation.ts](../../../client/app/api/operations/BaseOperation.ts)
* **Search Filtering Specification:** [Dynamic Search & Filter Engine Subsystem](./search_filtering.md)
* **Resource CRUD Specification:** [Resource Configuration & CRUD Workflow Subsystem](./resource_crud_workflow.md)
* **WebGIS Mapping Specification:** [WebGIS Mapping & Spatial Data Layer](./webgis_mapping.md)

---

## Related Nodes

* Back to [Frontend Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
