---
type: subsystem_specification
title: Resource Configuration & CRUD Workflow Subsystem
status: active
target_file: client/app/utils/consts/configs/data/
---

# Resource Configuration & CRUD Workflow Subsystem

## Architectural Role

The Resource Configuration and CRUD Workflow subsystem establishes a standardized, type-safe application lifecycle for managing over 50 domain datasets across archaeological excavations, specialist scientific analyses, historical sources, and taxonomies. Located under [client/app/utils/consts/configs/data/](../../../client/app/utils/consts/configs/data/) and [client/app/components/data/](../../../client/app/components/data/), it decouples data model declarations from presentation components, enforces uniform data table interfaces, and ensures rigorous client-side form validation using `@regle/core`.

---

## Central Resource Configuration (`RESOURCE_CONFIG_MAP`)

Every domain entity in the system is defined by a `ResourceConfig` declaration registered in [client/app/utils/consts/configs/index.ts](../../../client/app/utils/consts/configs/index.ts):

```typescript
export interface ResourceConfig {
  apiPath: GetCollectionPath
  appPath: string
  defaultHeaders: DataTableHeader[]
  labels: [string, string] // [singular, plural]
  name: string
}
```

### Configuration Resolution (`useResourceConfig`)
Components resolve resource metadata dynamically via [client/app/composables/useResourceConfig.ts](../../../client/app/composables/useResourceConfig.ts). The composable inspects `RESOURCE_CONFIG_MAP` or queries `useOpenApiStore().findApiResourcePath(path)` to automatically provide table column schemas, navigation URLs, and localized resource labels.

---

## Standardized 7-Component Lifecycle Pattern

To ensure UI consistency and code maintainability, each domain entity implements a standardized 7-component hierarchy:

```
[ DataCollectionPage<Resource>.vue ]
   └── [ DataCollectionTable<Resource>.vue ]
          ├── Header Actions (Search, Filter, Export, Create)
          ├── Vuetify Data Table Slots
          └── Row Actions ──► Open Update / Delete Modals

[ DataItemPage<Resource>.vue ] (Tabbed Detail View)
   ├── Tab: Info ──► DataItemFormInfo<Resource>.vue
   │                   └── Linked Entity Metadata ──► DataItemInfoBox<Relation>.vue
   ├── Tab: Parent Subject / Context
   ├── Tab: Absolute Dating (if applicable)
   └── Tab: Media & Photographs

[ Modal Dialogs ]
   ├── DataDialogCreate<Resource>.vue (Form validation + usePostCollectionMutation)
   ├── DataDialogUpdate<Resource>.vue (Form validation + usePatchItemMutation)
   ├── DataDialogDelete.vue (Confirmation + useDeleteItemMutation)
   └── DataDialogDownload.vue (CSV export with field selection)
```

### 1. `DataCollectionTable[Resource].vue`
* Renders the entity's tabular representation using Vuetify's `v-data-table-server`.
* Binds pagination, sorting, and search to `useCollectionQueryStore(path)`.
* Emits row selection and action triggers (`edit`, `delete`, `duplicate`).

### 2. `DataCollectionPage[Resource].vue`
* Standard page layout container providing breadcrumb trails, action toolbars, and search filters.
* Supports sub-collection routing via `filterPath` and `parentId` parameters.

### 3. `DataItemFormInfo[Resource].vue`
* Read-only entity inspector displaying formatted attributes, vocabulary labels, and coordinates.
* Embeds `DataItemInfoBox` components for immediate navigation to associated entities.

### 4. `DataItemInfoBox[Resource].vue`
* Compact metadata card/chip presenting summary details of related resources (e.g., displaying the parent Stratigraphic Unit on a Pottery detail page).

### 5. `DataItemPage[Resource].vue`
* Comprehensive tabbed item view coordinating complex domain aggregates:
  * Primary entity metadata.
  * Specialized analysis tabs (botany, zooarchaeology, ceramic analysis, microstratigraphy).
  * Composite Absolute Dating tab.
  * Media objects and archaeological photographs.

### 6. `DataDialogCreate[Resource].vue` & `DataDialogUpdate[Resource].vue`
* Scoped modal dialogs managing form state, `@regle/core` reactive validation, and backend submission.
* Executes `usePostCollectionMutation` or `usePatchItemMutation`.

### 7. `DataDialogDelete.vue` & `DataDialogDownload.vue`
* Central confirmation dialogs handling entity removal (with safety warnings for `RESTRICT` foreign key cascades) and CSV dataset exports with column selection.

---

## Composite & Specialist Analysis Patterns

### Analysis-Subject Relationships
In the MEDGREENREV domain model, scientific analyses (e.g. C14 absolute dating, seed morphology) are performed on physical find subjects (e.g. bone fragments, pottery sherds, charcoal pieces). 

* **Generic Tabbed Views:** `DataItemPageAbsDatingAnalysis.vue` uses generic typing `<RK extends AbsDatingAnalysisSubjectResourceKey>` to render absolute dating results for any valid subject without duplicating layout code.
* **Child Route Binding:** Detail views query child relations via parameterized paths (e.g. `/api/data/analyses/{parentId}/subjects`) while maintaining synchronization with parent records.

### Derived & Non-Writable Relational Fields
Certain tabular fields represent non-writable, deeply nested attributes. For example, in [client/app/utils/consts/configs/data/pottery.ts](../../../client/app/utils/consts/configs/data/pottery.ts):
```typescript
{
  key: 'functionalForm.functionalGroup.value',
  value: 'functionalForm.functionalGroup',
  title: 'functional group',
  minWidth: '150',
}
```
* **Table Display:** Displays the broader functional group derived from the specific functional form selection.
* **Read-Only Invariant:** Form mutations omit derived fields, submitting only the writable foreign key IRI (`functionalForm: '/api/vocabulary/pottery_functional_forms/12'`).

---

## Form Validation & Normalization Pipeline

Data entry and mutation integrity are enforced through a multi-stage validation and normalization pipeline:

```
[ User Input in Form ]
         │
         ▼
[ Client Validation: @regle/core ] ──(Fails)──► Display Inline Form Errors
         │ (Passes)
         ▼
[ Asynchronous Unique Validation ] ──(Duplicate)──► useApiUniqueValidator Error
         │ (Passes)
         ▼
[ Pre-Mutation Normalization ]
(usePreCreateNormalization / usePreUpdateNormalization)
         │
         ▼
[ Typed HTTP Operation ]
(BaseOperation JSON or TypedFormData)
         │
         ▼
[ Backend Symfony API Validation ]
(Doctrine Constraints, 422 Constraint Violations)
```

### 1. `@regle/core` Rule Factories (`useGenerateValidationCreateRules.ts`)
Form rules are generated via [client/app/composables/useGenerateValidationCreateRules.ts](../../../client/app/composables/useGenerateValidationCreateRules.ts), defining required fields, regex formats, and numeric constraints per `PostCollectionPath`.

### 2. Asynchronous Unique Validator (`useApiUniqueValidator.ts`)
Prevents database constraint collisions before form submission:
* Calls backend validation endpoints (e.g. `/api/validator/unique/site_user_privileges`).
* Extracts IDs from IRIs and passes tuple parameters (`?user=12&site=34`).
* Evaluates asynchronously and flags duplicate combinations in the form UI.

### 3. Normalization Composables
* **`usePreCreateNormalization.ts`:** Converts empty strings to `null`, trims whitespace, formats dates to ISO 8601 strings, and converts IRI references.
* **`usePreUpdateNormalization.ts`:** Filters out unchanged properties and extracts read-only metadata before PATCH submissions.
* **`usePostCloneDuplicateNormalization.ts`:** Clears unique identifiers and site codes when cloning an entity for duplicate-and-edit workflows.
* **`useTypedFormData.ts`:** Packages multipart requests containing binary file uploads (e.g. archaeological photos or documentation PDFs in `media_objects`).

---

## Key Relationships

* **Resource Config Directory:** [client/app/utils/consts/configs/data/](../../../client/app/utils/consts/configs/data/)
* **Resource Config Registry:** [client/app/utils/consts/configs/index.ts](../../../client/app/utils/consts/configs/index.ts)
* **Resource Config Composable:** [client/app/composables/useResourceConfig.ts](../../../client/app/composables/useResourceConfig.ts)
* **Unique Validator Composable:** [client/app/composables/useApiUniqueValidator.ts](../../../client/app/composables/useApiUniqueValidator.ts)
* **Validation Rule Generator:** [client/app/composables/useGenerateValidationCreateRules.ts](../../../client/app/composables/useGenerateValidationCreateRules.ts)
* **Search Filtering Specification:** [Dynamic Search & Filter Engine Subsystem](./search_filtering.md)
* **State Data Layer Specification:** [State Management & Data Layer Architecture](./state_data_layer.md)

---

## Related Nodes

* Back to [Frontend Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)