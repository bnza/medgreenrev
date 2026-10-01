---
type: architecture_document
title: Authorization & Security Model
status: active
target_file: api/src/Security/
---

# Authorization & Security Model

## Architectural Role

MEDGREENREV implements a multi-tiered authorization model designed for collaborative archaeological research. Permissions combine system-wide role-based access control (RBAC) with site-level discretionary permissions and Doctrine ORM query filtering extensions.

---

## Core Authorization Principles

* **Public Read Access:** Most published archaeological data, vocabularies, and spatial layers are accessible to unauthenticated consumers.
* **Role-Based Access Control (RBAC):** Administrative and specialist operations are gated by professional roles (e.g., `ROLE_ADMIN`, `ROLE_EDITOR`, `ROLE_ARCHAEOBOTANIST`, `ROLE_ZOO_ARCHAEOLOGIST`, `ROLE_HISTORIAN`, `ROLE_PALEOCLIMATOLOGIST`).
* **Site-Specific Privileges (`SiteUserPrivilege`):**
  * **User Level:** Grants standard data management capabilities on a specific excavation site (creating/updating contexts, stratigraphic units, and specialist data).
  * **Editor Level:** Required for modifying or deleting the top-level `ArchaeologicalSite` record itself.
* **Doctrine Security Query Extensions:** Automatically restrict query results and mutation operations at the ORM layer based on the authenticated user's permissions ([api/src/Doctrine/Extension/](../../../api/src/Doctrine/Extension/)).

---

## Key Relationships

* **Security Services:** [api/src/Security/](../../../api/src/Security/)
* **Security Query Extensions:** [Doctrine ORM Query Extensions & Security Filtering](./query_extensions_filtering.md)
* **Site Privilege Entity:** [SiteUserPrivilege Entity](../../../api/src/Entity/Auth/SiteUserPrivilege.php)
* **Foreign Key Policies:** [Foreign Key Deletion & Referential Integrity Policies](./foreign_key_policies.md)
* **Domain Entities Specification:** [Domain Entities & Modeling Principles](./entities/index.md)

---

## Related Nodes

* Back to [Backend Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
