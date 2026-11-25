---
type: testing_specification
title: Frontend Client Testing Specification
status: active
target_file: client/playwright.config.ts
---

# Frontend Client Testing Specification

## Architectural Role

Frontend testing validates Vue 3 components, reactive Pinia stores, query caching pipelines, dynamic form validation, and end-to-end user workflows within the Nuxt 4 SPA application. The testing architecture balances fast, isolated unit and composable execution via Vitest with robust, real-browser E2E workflow validation via Playwright.

---

## Unit & Composable Testing (Vitest)

Unit testing focuses on isolated business logic, Pinia stores, utilities, and composables without browser overhead:

* **Configuration:** Defined in [client/vitest.config.ts](../../../client/vitest.config.ts) utilizing `@nuxt/test-utils` and the `jsdom` DOM simulation environment.
* **Test Suites (`client/tests/unit/`):**
  * **Store Tests:** Validates store state mutations and OpenAPI spec introspection ([client/tests/unit/stores/openapi.spec.ts](../../../client/tests/unit/stores/openapi.spec.ts)).
  * **Utility & Request Tests:** Tests deep query serialization (`dataTableOptionsToQsObject`), array helpers, and string normalizers.
  * **Component Navigation Tests:** Validates header controls, drawer states, and responsive layout triggers.
* **Execution Command:**
  ```bash
  docker compose run --rm node pnpm test:unit
  ```

---

## End-to-End Testing (Playwright)

End-to-end testing validates full browser workflows against the containerized application stack (Nginx, Symfony API, PostgreSQL/PostGIS, GeoServer).

* **Configuration:** Defined in [client/playwright.config.ts](../../../client/playwright.config.ts).
* **Execution Parameters:** `workers: 1`, `fullyParallel: false`, viewport `1600x1000`, targeting `baseURL: 'http://localhost/app/'`.
* **Execution Host:** Playwright tests currently cannot run inside the Node Docker container and must be executed directly on the WSL host environment.

---

## Page Object Model (POM) Architecture

To prevent test fragility and decouple test assertions from DOM selectors, Playwright tests adhere to a strict hierarchical Page Object Model under `client/tests/e2e/`:

```
               [ BasePage ] (Global navigation, header, snackbars)
                     │
                     ▼
             [ BaseDataPage ] (Breadcrumbs, title, common data actions)
                     │
           ┌─────────┴─────────┐
           ▼                   ▼
[ BaseCollectionPage ]  [ BaseItemPage ]
(Tables, search dialog, (Tabbed views, item forms,
 pagination, selections) linked entity info cards)
           │                   │
           ▼                   ▼
Specialized Domain Pages (e.g. ArchaeologicalSiteCollectionPage,
 PotteryItemPage, AnalysisBotanySeedCollectionPage)
```

### 1. Page Object Hierarchy (`client/tests/e2e/pages/`)
* **`BasePage.ts`:** Root page object providing top navigation methods, login helpers, flash snackbar verifications (`expectMessageSuccess`, `expectMessageError`), and dialog triggers.
* **`BaseDataPage.ts`:** Inherits from `BasePage`, adding data-specific navigation, breadcrumb validation, and toolbar actions.
* **`BaseCollectionPage.ts`:** Coordinates collection tables, column sorting, pagination controls, search filter dialog triggers, and row action buttons.
* **`BaseItemPage.ts`:** Coordinates detail views, sub-tab navigation (Analyses, Subjects, Media, Absolute Dating), and linked entity navigation.
* **Domain Collection/Item Pages (60+ specs):** Extend `BaseCollectionPage` or `BaseItemPage` with entity-specific assertions and field selectors (e.g. `PotteryCollectionPage`, `StratigraphicUnitItemPage`).

### 2. Component Wrapper Objects (`client/tests/e2e/components/`)
Encapsulate complex UI components into reusable testing harnesses:
* **`DataCollectionTableComponent.ts`:** Interacts with table headers, cell values, pagination selectors, and multi-row selection checkboxes.
* **`DataDialogCreateComponent.ts` / `DataDialogUpdateComponent.ts`:** Automates field entry, autocomplete selection, `@regle/core` validation checks, and submission buttons.
* **`DataDialogSearchComponent.ts`:** Drives search property selection, operator selection, dynamic operand input, and filter application.
* **`DataDialogDeleteComponent.ts` / `DataDialogDownloadComponent.ts`:** Confirms destructive actions or triggers CSV export downloads.

---

## Authentication State Caching (`auth.setup.ts`)

Repeated UI login sequences introduce massive overhead. The test suite uses Playwright storage state caching configured in [client/tests/e2e/setup/auth.setup.ts](../../../client/tests/e2e/setup/auth.setup.ts):

1. **Fixture Initialization:** `setup.beforeAll` resets the test database using `loadFixtures()`.
2. **Role Authentication:** Authenticates 12 distinct user roles through the login UI and caches their session JWT tokens and browser storage state to `playwright/.auth/<role>.json`:
   * `admin.json` (`ROLE_ADMIN`)
   * `editor.json` (`ROLE_EDITOR`)
   * `base.json` (`ROLE_USER`)
   * Specialist roles: `bot.json` (Archaeobotanist), `zoo.json` (Zooarchaeologist), `pot.json` (Ceramic Specialist), `geo.json` (Geoarchaeologist), `mst.json` (Microstratigraphist), `ant.json` (Anthropologist), `cli.json` (Paleoclimatologist), `his.json` (Historian), `mat.json` (Material Analyst).
3. **Storage State Reuse:** Spec tests declare their required auth context via `test.use({ storageState: 'playwright/.auth/admin.json' })`, bypassing the login UI entirely.

---

## Execution Constraints & Operational Rules

### 1. WSL Host Execution & Single-Browser Selection (`--project=setup --project=chromium`)
Playwright requires browser binaries installed on the host. Always execute tests on the WSL host with the `setup` project followed by the single browser project (e.g. `chromium`):
```bash
# Run targeted spec file on WSL host
pnpm test:e2e --project=setup --project=chromium tests/e2e/specs/history.lifecycle.spec.ts
```

### 2. Targeted Test Execution
Full E2E regression runs are time-consuming. During regular development and task verification, only execute strictly necessary targeted spec files (e.g., specific domain lifecycle specs).

### 3. Client Static Asset Rebuild Prerequisite
Because Playwright interacts with the containerized application served by Nginx from the `client_output` volume mount, client logic modifications in `client/app/**` **do not take effect until assets are regenerated**.
* **Workflow:**
  ```bash
  # 1. Rebuild static client assets into client_output volume
  docker compose run --rm node pnpm generate

  # 2. Restart Nginx if volume mount rebinding is required
  docker compose restart nginx

  # 3. Refresh auth state and run targeted spec on WSL host
  pnpm test:e2e --project=setup
  pnpm test:e2e --project=chromium tests/e2e/specs/<target>.spec.ts
  ```

### 4. Setup-Only Execution
To refresh stored auth states without running the full test suite:
```bash
pnpm test:e2e --project=setup
```

---

## Key Relationships

* **Playwright Config:** [client/playwright.config.ts](../../../client/playwright.config.ts)
* **Vitest Config:** [client/vitest.config.ts](../../../client/vitest.config.ts)
* **Auth Setup:** [client/tests/e2e/setup/auth.setup.ts](../../../client/tests/e2e/setup/auth.setup.ts)
* **Base Page Object:** [client/tests/e2e/pages/base.page.ts](../../../client/tests/e2e/pages/base.page.ts)
* **Base Collection Page:** [client/tests/e2e/pages/base-collection.page.ts](../../../client/tests/e2e/pages/base-collection.page.ts)
* **Testing Hub:** [Testing Hub](./index.md)
* **Client Architecture:** [Client Application Architecture & SPA Hosting](../frontend/client_architecture.md)

---

## Related Nodes

* Back to [Testing Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
