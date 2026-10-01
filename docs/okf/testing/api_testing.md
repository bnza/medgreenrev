---
type: testing_specification
title: Backend API Testing Specification
status: active
target_file: api/phpunit.xml.dist
---

# Backend API Testing Specification

## Architectural Role

Backend testing ensures the correctness of Symfony API endpoints, access control rules, database filters, and domain entities. Tests run against a dedicated `app_test` PostgreSQL database.

---

## Test Environment & Tooling

* **PHPUnit Configuration:** Declared in [api/phpunit.xml.dist](../../../api/phpunit.xml.dist) targeting `tests/`.
* **Database Isolation:** Utilizes `DAMA\DoctrineTestBundle` to wrap each test case in an isolated database transaction, automatically rolling back changes upon completion.
* **Fixture Generation:** Uses `hautelook/alice-bundle` to load standardized YAML test fixtures into the test environment.
* **Execution Environment:** Executed inside the `php` container using `bin/phpunit`.

---

## Key Relationships

* **Configuration:** [api/phpunit.xml.dist](../../../api/phpunit.xml.dist)
* **Domain Entities Subsystem:** [Domain Entity Modeling Subsystem](../backend/entities/index.md)
* **API Platform Architecture:** [API Platform Architecture & Custom Operations](../backend/api_platform.md)
* **Test Fixtures Specification:** [Test Fixtures & Data Seeding Architecture](./fixtures_test_data.md)
* **Test Suite Directory:** [api/tests/](../../../api/tests/)
* **Backend Dependencies:** [api/composer.json](../../../api/composer.json)
* **GeoServer Operations & Testing Workflow:** [GeoServer Operations & Entity Integration Workflow](../workflows/geoserver_operations.md)
* **Execution Workflow:** [Testing Execution Workflow](../workflows/testing.md)

---

## Related Nodes

* Back to [Testing Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
