---
type: architecture_document
title: Database Architecture & Migration Policies
status: active
target_file: api/config/packages/doctrine.yaml
---

# Database Architecture & Migration Policies

## Architectural Role

MEDGREENREV utilizes a PostgreSQL database with PostGIS extensions. The database architecture enforces strict separation between auto-generated schema tables and custom SQL objects (views, spatial triggers, and functions), governed by a distinct version lifecycle boundary.

---

## Schema Partitioning & Doctrine Filtering

* **Schema Partitioning:** Tables are grouped logically into `auth`, `data`, `vocabulary`, and `geoserver` schemas.
* **`vw_` Database Views:** Complex analytical joins and GeoServer layer sources are exposed as database views prefixed with `vw_` (e.g., `vw_analysis_subjects`, `vw_abs_dating_analyses`, `geoserver.vw_*`).
* **DBAL Schema Filter:** Configured in [api/config/packages/doctrine.yaml](../../../api/config/packages/doctrine.yaml) with `schema_filter: '~^(?!(tiger\.|topology\.|.+\.vw_|vw_))~'` to ensure Doctrine's migration diff tooling ignores custom `vw_` views and spatial extension schemas.

---

## Migration Strategy by Release Phase

* **Development Phase (API < 1.0.0):** Rapid schema iteration allows full database drops, recreation, and Alice fixture re-seeding. Entity table changes are squashed directly into the baseline schema migration [Version20250621090503.php](../../../api/migrations/Version20250621090503.php) via `doctrine:migrations:diff --from-empty-schema`.
* **Production / Stable Phase (API >= 1.0.0):** Strict incremental migrations generated via standard `doctrine:migrations:diff`. Database dropping is strictly prohibited, ensuring zero data loss and preserving production datasets, custom triggers, and spatial views.

---

## Purpose-Specific Migration Mapping

Migrations in [api/migrations/](../../../api/migrations/) are segregated strictly by architectural responsibility:

* **`Version20231119074007`:** Installs database extensions (`postgis`, `unaccent`).
* **`Version20250621090503`:** Defines the complete entity table schema, sequences, and foreign key constraints.
* **`Version20250627142200`:** Implements custom table checks, triggers, and PostgreSQL functions.
* **`Version20250627142201`:** Defines analytical subject join view (`vw_analysis_subjects`), a polymorphic UNION view aggregating records from all 13 analysis join tables with target resource type and analysis ID.
* **`Version20250627142202`:** Creates absolute dating views (`vw_abs_dating_analyses`) aggregating radiocarbon and luminescence analyses, alongside join trigger checks.
* **`Version20250628091340`:** Establishes API-consumed formatted taxonomy and observation views (`vocabulary.vw_botany_taxonomy`, `vocabulary.vw_zoo_taxonomy`, `vw_botany_seed`, `vw_botany_charcoal`, `vw_zoo_bone`, `vw_pottery`) using PostgreSQL functions (`format_botany_taxonomy`, `generate_code_su`).
* **`Version20260323152247`:** Establishes GeoServer spatial publishing views (`geoserver.vw_*`).

---

## Key Relationships

* **Doctrine DBAL Configuration:** [api/config/packages/doctrine.yaml](../../../api/config/packages/doctrine.yaml)
* **Migration Files Directory:** [api/migrations/](../../../api/migrations/)
* **Database Lifecycle Workflow:** [Database Lifecycle & Migrations Workflow](../workflows/database_lifecycle.md)
* **Foreign Key Policies:** [Foreign Key Deletion & Referential Integrity Policies](./foreign_key_policies.md)
* **GeoServer Integration Architecture:** [GeoServer Integration & Spatial Architecture](./geoserver.md)
* **Database Infrastructure:** [PostGIS Spatial Database Service](../infrastructure/database_service.md)

---

## Related Nodes

* Back to [Backend Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
