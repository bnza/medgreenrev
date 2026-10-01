---
type: architecture_document
title: Doctrine ORM Query Extensions & Security Filtering
status: active
target_file: api/src/Doctrine/Extension/
---

# Doctrine ORM Query Extensions & Security Filtering

## Architectural Role

MEDGREENREV utilizes ApiPlatform Doctrine ORM Query Extensions ([api/src/Doctrine/Extension/](../../../api/src/Doctrine/Extension/)) and low-level SQL Filters to automatically modify DQL queries prior to execution. This architecture guarantees site privilege isolation, prevents unauthorized media data leakage, and resolves nested subresource relationships without contaminating business controller logic.

---

## Security & Access Control Extensions

```
[Incoming ApiPlatform Request]
   │
   ▼
[Doctrine Query Collection / Item Extension Pipeline]
   ├── CurrentUserSitePrivilegeExtension ──► Filter /users/me/site_user_privileges to current user
   ├── EditorUserSitePrivilegeExtension   ──► Filter privileges on editor's own created sites
   ├── PublicMediaSecurityExtension       ──► Filter non-public media for unauthenticated requests
   └── Subresource Extensions             ──► Inject join path parameters for nested API routes
   │
   ▼
[Executed DQL Query with Injected WHERE Clauses]
```

### 1. `CurrentUserSitePrivilegeExtension`
* **Target Operation:** `/users/me/site_user_privileges`
* **Mechanism:** Checks `IS_AUTHENTICATED_FULLY` and appends an `andWhere` condition binding `$rootAlias.user` to the authenticated user's ID. Prevents users from querying another user's assigned site privileges.

### 2. `EditorUserSitePrivilegeExtension`
* **Target Resource:** `SiteUserPrivilege` collection queries.
* **Mechanism:** When the requester holds `ROLE_EDITOR` (and not `ROLE_ADMIN`), this extension inner-joins `$rootAlias.site` and constrains results to `site.createdBy = :currentUser`. This enables site editors to view and manage privileges exclusively for excavations they created, while system administrators retain global visibility.

### 3. `PublicMediaSecurityExtension`
* **Target Resources:** `MediaObject`, subclasses of `BaseMediaObjectJoin`, and parent entities with `mediaObjects` collections.
* **Mechanism:** When the request is unauthenticated, this extension injects visibility checks:
  1. *Direct Media Queries:* Adds `$rootAlias.public = true`.
  2. *Media Join Entities:* Inner-joins `$rootAlias.mediaObject` and appends `mediaObject.public = true`.
  3. *Parent Entities:* When an existing join on `mediaObjects` is detected or requested, joins the underlying `MediaObject` and filters for public items.
* **Low-Level Safety Net:** Complemented by [PublicMediaObjectSqlFilter](../../../api/src/Doctrine/Filter/PublicMediaObjectSqlFilter.php), which is conditionally activated by `PublicMediaFilterListener` for low-level DBAL operations.

---

## Subresource Query Extensions

API Platform allows hierarchical subresource endpoints. Custom query extensions dynamically resolve the join paths:

### 1. `SiteStratigraphicUnitChildSubresourceExtension`
* **Supported Routes:**
  * `/data/archaeological_sites/{parentId}/botany/charcoals`
  * `/data/archaeological_sites/{parentId}/botany/seeds`
  * `/data/archaeological_sites/{parentId}/individuals`
  * `/data/archaeological_sites/{parentId}/microstratigraphic_units`
  * `/data/archaeological_sites/{parentId}/potteries`
  * `/data/archaeological_sites/{parentId}/zoo/bones`
  * `/data/archaeological_sites/{parentId}/zoo/teeth`
* **Mechanism:** Joins the child entity's `$stratigraphicUnit` relationship and filters by `stratigraphicUnit.site = :siteId`.

### 2. `SedimentCoreDepthSamplingSiteSubresourceExtension`
* **Supported Route:** `/data/sampling_sites/{parentId}/sediment_cores/depths`
* **Mechanism:** Joins the depth's `$sedimentCore` association and filters by `sedimentCore.site = :siteId`.

### 3. `AnalysisSampleMicrostratigraphyStratigraphicUnitSubresourceExtension`
* **Supported Route:** `/stratigraphic_units/{parentId}/analyses/samples/microstratigraphy`
* **Mechanism:** Traverses `$subject` (Sample) $\rightarrow$ `sampleStratigraphicUnits` $\rightarrow$ `stratigraphicUnit = :suId`.

---

## Key Relationships

* **Extensions Directory:** [api/src/Doctrine/Extension/](../../../api/src/Doctrine/Extension/)
* **Filters Directory:** [api/src/Doctrine/Filter/](../../../api/src/Doctrine/Filter/)
* **Authorization Specification:** [Authorization & Security Model](./authorization.md)
* **Domain Entities Specification:** [Domain Entities & Modeling Principles](./entities/index.md)

---

## Related Nodes

* Back to [Backend Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
