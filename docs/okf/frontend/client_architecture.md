---
type: architecture_document
title: Nuxt 4 Client Architecture & SPA Configuration
status: active
target_file: client/nuxt.config.ts
---

# Nuxt 4 Client Architecture & SPA Configuration

## Architectural Role

The frontend client operates as a static Single-Page Application (SPA with `ssr: false`), hosted behind Nginx under the `/app/` URL prefix. It interacts asynchronously with the Symfony 7.x REST API (powered by API Platform 3.x) for data operations and authentication, and connects to PostGIS/GeoServer for geospatial features and OGC map services.

The architecture emphasizes strict client-side isolation, complete type safety derived from OpenAPI specifications, robust client-side route access control, and seamless state-driven URL parameter serialization.

---

## SPA Hosting & Build Pipeline

* **SPA Mode Configuration:** Declared in [client/nuxt.config.ts](../../../client/nuxt.config.ts) with `ssr: false`, `app.baseURL: '/app'`, and `experimental.payloadExtraction: false`. Because SSR is disabled, all routing, state hydration, and UI rendering occur in the user's browser.
* **Volume Mount & Web Server Serving:** The production build is compiled into `client/.output/public` via `pnpm generate` inside the Node tools container. This directory is shared with the Nginx container via the Docker named volume `client_output`. Nginx serves these static assets directly from `/app/` with fallback to `/app/index.html`.
* **API Base URL Resolution:** Configured via `runtimeConfig.public.apiBaseUrl`, resolving `NUXT_PUBLIC_API_BASE_URL` with a fallback to `http://localhost`. Because the browser executes all HTTP requests directly, the API base URL must always resolve to an externally accessible host/port rather than a Docker-internal service name.
* **OpenLayers Transpilation:** OpenLayers modules and third-party extensions are explicitly transpiled via `build.transpile: ['ol', 'ol-ext', 'ol-contextmenu', 'vue3-openlayers']` to guarantee ES module compatibility across browser environments.

---

## Routing & Query Serialization Architecture

Client routing is configured in [client/app/router.options.ts](../../../client/app/router.options.ts) to handle deep analytical queries and SPA hosting constraints:

```typescript
import type { RouterConfig } from '@nuxt/schema'
import qs from 'qs'

export default <RouterConfig>{
  hashMode: true,
  parseQuery: qs.parse,
  stringifyQuery: qs.stringify,
}
```

### Hash Routing (`hashMode: true`)
Operating behind an Nginx reverse proxy under the `/app/` prefix, Vue Router hash mode eliminates URL rewrite collisions with backend API paths (`/api/`) or GeoServer endpoints (`/geoserver/`). It ensures deep links to specific resources, item tabs, and search states remain durable and shareable across browser refreshes without server-side routing reconfiguration.

### Deep Query Serialization with `qs`
Standard browser `URLSearchParams` cannot serialize nested object hierarchies or multiple array filters required by API Platform and Hydra. Nuxt's default query serializer is replaced with `qs`:
* **Hydra Filtering Queries:** Serializes complex filters into standard PHP bracket notation (e.g., `?name[contains]=pottery&order[id]=desc&period[in][]=1&period[in][]=2`).
* **Bidirectional Store Sync:** Deserializes deep query strings from the hash URL directly into reactive filter and pagination objects managed by `useCollectionQueryStore`.

---

## Authentication & Session Architecture

Client authentication is managed by `@sidebase/nuxt-auth` using a custom local JWT provider configured in `client/nuxt.config.ts`:

* **Authentication Endpoints:**
  * Sign In: `POST /api/login` (exchanges username/password for access token and refresh token).
  * Sign Out: `POST /api/token/invalidate` (invalidates active refresh token).
  * Session Details: `GET /api/users/me` (retrieves active user identity, roles, and site permissions).
* **Token Refresh Lifecycle:** Automatic refresh is enabled (`refresh.isEnabled: true`) targeting `POST /api/token/refresh`. Refresh tokens are extracted from and supplied to `/refresh_token` JSON pointers. Periodic background session validation occurs every 30 minutes (`sessionRefresh.enablePeriodically: 1800000`) and upon browser window refocus (`enableOnWindowFocus: true`).
* **Session Data Shape:**
  * `id: string` – Unique user IRI / identifier.
  * `email: string` – User login email address.
  * `roles: ApiRole[]` – Global security roles (`ROLE_ADMIN`, `ROLE_EDITOR`, `ROLE_USER`, and specialist roles like `ROLE_ARCHAEOBOTANIST`).
  * `sitePrivileges: Record<number, number>[]` – Maps site IDs to privilege levels (`0` = User, `1` = Editor).
* **`useAppAuth` Composable:** Located at [client/app/composables/useAppAuth.ts](../../../client/app/composables/useAppAuth.ts), this composable exposes reactive computed state: `isAuthenticated`, `user`, `roles`, `hasRole(role)`, `hasRoleAdmin`, `hasRoleEditor`, and `hasSpecialistRole(role)`.

---

## Global Route Firewall & ACL Voters

Client route navigation is governed by a global middleware firewall at [client/app/middleware/auth.1.firewall.global.ts](../../../client/app/middleware/auth.1.firewall.global.ts):

```
       Navigation to Route
               │
               ▼
      Is to.meta.public? ────(Yes)────► Allow Access
               │ (No)
               ▼
      Is Authenticated?  ────(No)─────► Push to historyStack
               │                        Redirect to /login
               │ (Yes)
               ▼
     Evaluate to.meta.voters
     (HasRoleAdmin, HasRoleEditor)
               │
       Passed All Voters? ────(No)─────► Flash Error via messagesStore
               │                        Redirect to /
               ▼ (Yes)
          Allow Access
```

1. **Public Route Exemption:** If `to.meta.public === true` (such as the `/login` route), the firewall immediately grants passage.
2. **Forced Login History Preservation:** If an unauthenticated user attempts to visit a protected route, the middleware records the destination in [client/app/stores/useHistoryStackStore.ts](../../../client/app/stores/useHistoryStackStore.ts) via `historyStack.pushForcedLogin(to.fullPath)` and redirects to `/login`. Upon successful sign-in, `historyStack.redirectionPath` automatically returns the user to their intended URL.
3. **ACL Voter Execution:** Protected routes declare authorization requirements via `to.meta.voters: [AclVoters.HasRoleAdmin, ...]`. The firewall evaluates each voter against the user's active session:
   * `AclVoters.HasRoleAdmin`: Verifies `hasRoleAdmin.value === true`.
   * `AclVoters.HasRoleEditor`: Verifies `hasRole(ApiRole.Editor).value === true`.
4. **Access Denial Handling:** If any voter rejects authorization, an error message is dispatched to `useMessagesStore().addError()`, and the user is redirected to the home dashboard (`/`).

---

## Build-Time vs Runtime OpenAPI Schema Duality

The frontend maintains a dual relationship with the backend OpenAPI schema to balance compile-time type safety with dynamic runtime metadata:

```
[ Backend Symfony API ]
      │
      ├─► /api/docs.jsonopenapi.json ──(pnpm generate:all)──► types/openapi.d.ts
      │   (Live API Schema)                                    utils/consts/resources.ts
      │
      └─► /docs.jsonopenapi.json ──────(Runtime $fetch)─────► useOpenApiStore
          (Cached at PHP startup)                              (Path resolution, Form metadata)
```

1. **Build-Time Generation (`pnpm generate:all`):**
   * Endpoint: `GET /api/docs.jsonopenapi.json` (always reflects the live Symfony API configuration).
   * Generates [client/types/openapi.d.ts](../../../client/types/openapi.d.ts) for strict TypeScript request/response contracts.
   * Generates [client/app/utils/consts/resources.ts](../../../client/app/utils/consts/resources.ts) defining `API_RESOURCE_MAP` and collection path types.
   * *Invariant:* Never edit generated files directly.
2. **Runtime Introspection (`useOpenApiStore`):**
   * Endpoint: `GET /docs.jsonopenapi.json` (static snapshot cached on the PHP container filesystem at container boot).
   * Implemented in [client/app/stores/useOpenapiStore.ts](../../../client/app/stores/useOpenapiStore.ts).
   * Provides runtime path resolution (`findApiResourcePath`), tag-based resource mapping (`findApiResourceKeyFromPath`), parameter validation (`isValidOperationPathParams`), and dynamic form title introspection.
   * *Operational Requirement:* Because `/docs.jsonopenapi.json` is generated once at container boot, the PHP container must be restarted (`docker compose restart php`) after backend entity or annotation changes to refresh the runtime schema.

---

## UI Framework & Application Stores

* **Vuetify 4 Integration:** Configured via `vuetify-nuxt-module` with `prefixComposables: true` to prevent namespace collisions with Nuxt composables. Google Font `Montserrat` provides standard typography across table headers, controls, and map popups.
* **UI Mode Management (`useAppUiModeStore`):** Controls the global application layout mode:
  * `default`: Standard tabular data and entity form layout.
  * `map`: Fullscreen interactive WebGIS map viewport.
  * Automatically switches the header toggle icon (`fas fa-globe` vs `fas fa-table`).
* **Flash Alert Queue (`useMessagesStore`):** Provides a reactive snackbar notification queue:
  * Manages auto-expiring success messages (`timeout: 3000ms`).
  * Automatically inspects Symfony 422 HTTP errors (`isFetchError(err) && err.status === 422`) and unpacks Hydra constraint violations (`isHydraConstraintViolation(err.data)`), rendering persistent error alerts with specific property paths and validation messages.

---

## Key Relationships

* **Declaration / Implementation:** [client/nuxt.config.ts](../../../client/nuxt.config.ts)
* **Router Options:** [client/app/router.options.ts](../../../client/app/router.options.ts)
* **Route Firewall:** [client/app/middleware/auth.1.firewall.global.ts](../../../client/app/middleware/auth.1.firewall.global.ts)
* **Auth Composable:** [client/app/composables/useAppAuth.ts](../../../client/app/composables/useAppAuth.ts)
* **OpenAPI Runtime Store:** [client/app/stores/useOpenapiStore.ts](../../../client/app/stores/useOpenapiStore.ts)
* **State Data Layer Specification:** [State Management & Data Layer Architecture](./state_data_layer.md)
* **WebGIS Mapping Specification:** [WebGIS Mapping & Spatial Data Layer](./webgis_mapping.md)
* **Client Synchronization Workflow:** [Client Synchronization Workflow](../workflows/client_sync.md)
* **Infrastructure Host:** [Nginx Service](../infrastructure/nginx_service.md)

---

## Related Nodes

* Back to [Frontend Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
