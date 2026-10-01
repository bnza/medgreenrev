---
type: testing_specification
title: Test Fixtures & Data Seeding Architecture
status: active
target_file: api/fixtures/
---

# Test Fixtures & Data Seeding Architecture

## Architectural Role

MEDGREENREV relies on HautelookAliceBundle and Nelmio Alice to generate structured relational test data for development and testing environments. Fixtures populate core controlled vocabularies, archaeological excavations, specialist analyses, and media attachments with referential integrity.

---

## Fixture Hierarchy & Organization

```
api/fixtures/
├── vocabulary.*.yml      ──► Shared controlled vocabularies & taxonomies (global)
├── input/                ──► Sample media files (PDFs, images) for media seeding
└── dev/                  ──► Development & test dataset
      ├── auth.*.yaml     ──► Test users, roles, and SiteUserPrivilege records
      ├── data.*.yaml     ──► Sites, stratigraphic units, finds, analyses, and history
      └── data.join.*.yml ──► Explicit association and analysis join records
```

### 1. Global Vocabularies (`api/fixtures/vocabulary.*.yml`)
Contains standardized lookup dictionaries required across all environments:
* Chronological periods (`vocabulary.century.yml`), cultural contexts (`vocabulary.cultural_context.yml`), geographical regions (`vocabulary.region.yml`).
* Specialist taxonomies (`vocabulary.zoo.taxonomy.yml`, `vocabulary.botany.element.yml`).
* Analysis types and groups (`vocabulary.analysis_type.yml`).

### 2. Development Dataset (`api/fixtures/dev/`)
* **Authentication (`auth.*.yaml`):** Predefined test user accounts (`user_admin`, `user_editor`, `user_inactive`) and site-specific privilege assignments (`auth.site_user_privilege.yaml`).
* **Domain Data (`data.*.yaml`):** Excavation sites (`data.archeological_site.yaml`), stratigraphic layers (`data.su.yaml`, `data.mu.yaml`), samples (`data.sample.yaml`), ceramic artifacts (`data.pottery.yml`), botanical ecofacts (`data.botany.seed.yaml`, `data.botany.charcoal.yml`), faunal finds (`data.zoo.bone.yaml`, `data.zoo.tooth.yaml`), human remains (`data.individual.yaml`), and historical sources (`data.history.written_source.yml`).
* **Relational Joins (`data.join.*.yml`):** Junction mappings connecting specialist analyses and media objects to subjects.

---

## Test Isolation & Environment Lifecycle

* **Transactional Rollback (`dama/doctrine-test-bundle`):** Configured via [api/phpunit.xml.dist](../../../api/phpunit.xml.dist) using `DAMA\DoctrineTestBundle\PHPUnit\PHPUnitExtension`. Every PHPUnit functional test runs inside a database transaction that rolls back automatically on completion, ensuring clean test state without reloading fixtures between runs.
* **Media Upload Isolation (`VichUploaderExtension`):** Directs test file uploads to `/tmp/srv/static` using source fixtures in `api/fixtures/input/`, preventing test artifact pollution in persistent host volumes.
* **Sequence Identity Reset:** The custom purger decorator (`RestartIdentityPurgerDecorator`) resets PostgreSQL auto-incrementing identity sequences during full fixture reloads.

---

## Execution Commands

* **Load Dev Fixtures:**
  ```bash
  docker compose exec php bin/console hautelook:fixtures:load --no-interaction
  ```
* **Load Test Fixtures:**
  ```bash
  docker compose exec php bin/console hautelook:fixtures:load --no-interaction --env=test
  ```

---

## Key Relationships

* **Fixtures Root Directory:** [api/fixtures/](../../../api/fixtures/)
* **PHPUnit Configuration:** [api/phpunit.xml.dist](../../../api/phpunit.xml.dist)
* **API Testing Specification:** [Backend API Testing Architecture](./api_testing.md)
* **Database Lifecycle Workflow:** [Database Lifecycle & Migrations Workflow](../workflows/database_lifecycle.md)

---

## Related Nodes

* Back to [Testing Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
