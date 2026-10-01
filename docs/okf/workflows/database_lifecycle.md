---
type: workflow
title: Database Lifecycle & Migrations Workflow
status: active
target_file: api/migrations/
---

# Database Lifecycle & Migrations Workflow

## Architectural Role

The database lifecycle strategy governs schema evolution, table checks, triggers, views, and fixture loading across development, testing, and production environments. The workflow enforces a strict version boundary between active development (< 1.0.0) and production release (>= 1.0.0).

---

## Migration Lifecycle Strategy by API Version

### 1. Active Development Phase (API < 1.0.0)

During development prior to version 1.0.0, the schema is not finalized, and breaking changes may be applied freely without data preservation overhead:

* **Full Database Rebuilds:** The development (`app`) and test (`app_test`) databases can be dropped, recreated, migrated, and re-seeded with Alice fixtures at any time.
* **Schema Squashing into Base Migration:** Table, column, foreign key, and sequence changes are squashed directly into the baseline schema migration [Version20250621090503.php](../../../api/migrations/Version20250621090503.php) using `doctrine:migrations:diff --from-empty-schema`.
* **Purpose-Specific Migration Isolation:** Non-table SQL objects (extensions, checks, triggers, functions, and views) are maintained in separate, purpose-specific migrations rather than mixed into the schema migration.

#### Development Rebuild Sequence

1. Drop and recreate development database, run migrations, and load Alice fixtures:
   ```bash
   docker compose exec php bin/console doctrine:database:drop --force
   docker compose exec php bin/console doctrine:database:create
   docker compose exec php bin/console doctrine:migrations:migrate --no-interaction
   docker compose exec php bin/console hautelook:fixtures:load --no-interaction
   ```
2. Drop and recreate test database, run migrations, and load Alice fixtures with `--env=test`:
   ```bash
   docker compose exec php bin/console doctrine:database:drop --force --env=test
   docker compose exec php bin/console doctrine:database:create --env=test
   docker compose exec php bin/console doctrine:migrations:migrate --no-interaction --env=test
   docker compose exec php bin/console hautelook:fixtures:load --no-interaction --env=test
   ```

#### Schema Migration Regeneration Procedure (API < 1.0.0)

When modifying Doctrine entity attributes in `api/src/Entity/`:

1. Run `doctrine:migrations:diff --from-empty-schema` inside the `php` container.
2. Replace the old baseline migration file:
   ```bash
   mv api/migrations/Version<timestamp>.php api/migrations/Version20250621090503.php
   ```
3. Update the class name inside the file: `final class Version<timestamp>` → `final class Version20250621090503`.
4. Remove the redundant `$this->addSql('CREATE SCHEMA public');` statement from the generated `up()` method.
5. Purpose-specific migrations remain untouched.

---

### 2. Production & Stable Release Phase (API >= 1.0.0)

Starting with API version 1.0.0, database contents and schema history are permanent and must be preserved:

* **Strict Incremental Migrations:** Schema changes must never squash or rewrite existing migration files. Every schema alteration must be generated as a new timestamped migration file (`Version<timestamp>.php`) using standard `doctrine:migrations:diff` (without `--from-empty-schema`).
* **Zero Destructive Resets:** Production databases must never be dropped or rebuilt. Migration files must execute non-destructive DDL and handle data migrations safely within transaction blocks (`up()` and `down()`).
* **Preservation of Custom Database Objects:**
  * Views prefixed with `vw_` (such as `vw_analysis_subjects`, `vw_abs_dating_analyses`, `vw_geoserver_*`) are filtered out from Doctrine schema comparison by the `schema_filter` regex configured in [api/config/packages/doctrine.yaml](../../../api/config/packages/doctrine.yaml).
  * Custom database triggers, functions, and views must be updated or added through dedicated incremental migrations (`Version<timestamp>.php`) using raw SQL in `up()` and `down()` methods.
* **Automated Migration on Container Startup:** The production entrypoint script [docker/php/docker-entrypoint.sh](../../../docker/php/docker-entrypoint.sh) executes `doctrine:migrations:migrate --no-interaction --all-or-nothing` during container startup to apply outstanding migrations before serving traffic.

---

## Migration Classification & Roles

| Migration File | Role & Purpose | Scope & Constraints |
|---|---|---|
| `Version20231119074007.php` | PostGIS and `unaccent` database extensions | Creates core PostgreSQL extensions. |
| `Version20250621090503.php` | Baseline tables, sequences, foreign keys, constraints | Generated via `doctrine:migrations:diff` from entity definitions. |
| `Version20250627142200.php` | Table CHECK constraints, triggers, functions | Custom SQL for site/core checks and stratigraphic triggers. |
| `Version20250627142201.php` | Analysis subject join view (`vw_analysis_subjects`) | Spatial and relational join view across analysis tables. |
| `Version20250627142202.php` | Absolute dating view and trigger checks | Custom SQL for `vw_abs_dating_analyses` and join update triggers. |
| `Version20250628091340.php` | API views | Custom views consumed directly by API Platform entities. |
| `Version20260323152247.php` | GeoServer views | PostGIS spatial views consumed by GeoServer WMS/WFS layers. |

---

## Key Relationships

* **Migration Directory:** [api/migrations/](../../../api/migrations/)
* **Doctrine Configuration:** [api/config/packages/doctrine.yaml](../../../api/config/packages/doctrine.yaml)
* **PHP Container Entrypoint:** [docker/php/docker-entrypoint.sh](../../../docker/php/docker-entrypoint.sh)
* **Database Architectural Spec:** [Database Architecture & Policies](../backend/database.md)
* **GeoServer Spatial Architecture:** [GeoServer Integration & Spatial Architecture](../backend/geoserver.md)

---

## Related Nodes

* Back to [Workflows Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
