---
type: index
title: Frontend Client Architecture
description: Nuxt 4 SPA architecture, OpenLayers WebGIS integration, OpenAPI synchronization, Pinia/Colada reactive data layer, dynamic search filters, and resource CRUD workflows.
version: 0.2.0
status: active
target_file: client/
---

# Frontend Client Architecture

## Overview

The MEDGREENREV frontend is a modern Single-Page Application (SPA) built on Nuxt 4 (`ssr: false`), Vue 3, Vuetify 4, OpenLayers (`vue3-openlayers`), Pinia, and Pinia Colada. Hosted behind Nginx under the `/app/` base prefix, it connects asynchronously to the Symfony 7.x REST API (powered by API Platform 3.x) and PostGIS/GeoServer geospatial services.

The frontend is architected as an offline-first capable, client-side rendered spatial research workspace. It enables domain researchers and archaeological specialists to manage multi-period excavation sites, catalog scientific analyses across specialized subdomains (archaeobotany, zooarchaeology, ceramic analysis, microstratigraphy, paleoclimate), interact with real-time WebGIS maps, dynamically filter multi-dimensional datasets via deep Hydra query serialization, and execute role-governed data workflows.

---

## Architectural Pillars

* **Static Single-Page Application with Hash Routing & Deep Query Parsing:** Hosted strictly as a client-side SPA (`ssr: false`) under the `/app/` base URL. Hash routing (`hashMode: true`) coupled with `qs` query serialization (`parseQuery` / `stringifyQuery`) eliminates web server rewrite complexities while transparently handling nested API Platform / Hydra filtering structures (`?property[operator]=val&order[field]=asc`).
* **Dual OpenAPI Contract Synchronization:** Implements a strict separation between build-time static contract compilation and runtime dynamic schema introspection. Static TypeScript interfaces (`client/types/openapi.d.ts`) and endpoint constants (`client/app/utils/consts/resources.ts`) are generated from `/api/docs.jsonopenapi.json`, while runtime path mapping, parameter validation, and form metadata are introspected dynamically by `useOpenApiStore` from `/docs.jsonopenapi.json`.
* **Hierarchical Reactive Query Cache & Mutation Lifecycle:** Utilizes Pinia Colada (`@pinia/colada`) orchestrated through `useAppQueryCache` to implement a structured cache hierarchy (`QUERY_KEYS.root`, `RESOURCE_QUERY_KEY.root`, `byFilter`, `byId`). Mutations (`usePostCollectionMutation`, `usePatchItemMutation`, `useDeleteItemMutation`) execute automated cache invalidation upon settlement, keeping collection tables, sub-resource views, and map layers synchronized.
* **OpenLayers WebGIS Layer Pipeline with Dynamic Count Aggregation & Exclusivity:** Delivers interactive geospatial mapping via `vue3-openlayers` and `AppMap.vue`. Implements dynamic BBOX vector loading, marker radius resizing (5px standard vs 12px aggregated), centered `number_matched` count badge styling, declutter toggling, contextual entity/aggregation overlay cards, and mutual layer exclusivity governed by `useMapLayerExclusiveVisibilityStore`.
* **Type-Safe Dynamic Search & Operand Filter Registry:** A centralized filtering engine (`client/app/utils/consts/configs/filters/`) links API collection paths (`SearchableGetCollectionPath`) to static filter definitions. High-level UI dialogs dynamically resolve `@regle/core`-validated operand components (`DataDialogSearchOperand*`) to serialize complex boolean, range, and vocabulary constraints into API Platform queries.
* **Standardized 7-Component Resource CRUD Lifecycle & Form Validation:** Unifies UI interaction across 50+ domain datasets using a strict 7-component lifecycle pattern per resource (`DataCollectionTable`, `DataCollectionPage`, `DataItemFormInfo`, `DataItemInfoBox`, `DataItemPage`, `DataDialogCreate`/`Update`, `DataDialogDelete`/`Download`). Multi-step forms enforce robust data integrity using `@regle/core` rule factories, normalizers, and asynchronous backend unique validation.
* **Role-Based & Site-Privilege Client Route Firewall:** A global Nuxt middleware firewall (`client/app/middleware/auth.1.firewall.global.ts`) guards client routes using `@sidebase/nuxt-auth`, JWT session claims (`roles`, `sitePrivileges`), and ACL voters (`AclVoters.HasRoleAdmin`, `AclVoters.HasRoleEditor`), preserving intended destinations via `useHistoryStackStore` upon forced authentication redirects.

---

## Subsystem Specifications

### Core Client Architecture & State
* [Client Application Architecture & SPA Hosting](./client_architecture.md) – Nuxt 4 SPA configuration (`ssr: false`, `/app/`), hash routing with `qs` serialization, `@sidebase/nuxt-auth` JWT session lifecycle, global route firewall, and Vuetify 4 integration.
* [State Management & Data Layer Architecture](./state_data_layer.md) – Pinia stores, Pinia Colada hierarchical caching (`useAppQueryCache`), `useCollectionQueryStore`, sub-collection filter inheritance via `filterPath`, `useDynamicVocabularyStore`, and `useOpenApiStore`.

### Geospatial & Mapping
* [WebGIS Mapping & Spatial Data Layer](./webgis_mapping.md) – OpenLayers component architecture (`AppMap.vue`, `MapLayerVectorApiBase.vue`), BBOX vector loading, dynamic count aggregation mode (`number_matched`, dual-label styles, decluttering), layer exclusivity groups, and contextual popup overlays.

### Search, Filtering & Resource Workflows
* [Dynamic Search & Filter Engine Subsystem](./search_filtering.md) – Filter path mapping (`FILTERS_PATHS_MAP`), static definitions (`definitions.ts`), `@regle/core`-validated operand components, and Hydra query generation.
* [Resource Configuration & CRUD Workflow Subsystem](./resource_crud_workflow.md) – Central resource configuration registry (`RESOURCE_CONFIG_MAP`), standardized 7-component lifecycle pattern, composite analysis-subject tabbed pages, and form validation pipelines.

---

## Related Hubs & Specifications

* [Infrastructure Hub](../infrastructure/index.md) – Nginx web server container (`/app/` static volume mount) and Node tools container.
* [Backend Domain Hub](../backend/index.md) – Symfony 7.x API Platform endpoints, PostGIS spatial queries, and authentication endpoints.
* [Client Testing Specifications](../testing/client_testing.md) – Vitest unit testing and Playwright Page Object Model (POM) end-to-end testing suite.
* [Client Synchronization Workflow](../workflows/client_sync.md) – Dual OpenAPI sync, type generation, container restart, and production build pipelines.
* Back to [Main Knowledge Graph Index](../index.md)
