---
type: workflow
title: Test Suite Execution Workflow
status: active
target_file: api/composer.json
---

# Test Suite Execution Workflow

## Architectural Role

Provides the standard execution procedures for verifying the application across all testing tiers.

## Execution Procedures

* **Backend PHPUnit Suites:**
  * Executed inside the `php` container using `docker compose exec php bin/phpunit`.
  * Runs unit and functional tests with transactional rollback against `app_test`.
* **Frontend Vitest Unit Tests:**
  * Executed inside the `node` container via `docker compose run --rm node pnpm test:unit:run`.
* **Frontend Playwright E2E Tests:**
  * Executed against the running Docker stack via `docker compose run --rm node pnpm test:e2e`.

## Key Relationships

* **Backend Composer Manifest:** [api/composer.json](../../../api/composer.json)
* **Client Package Manifest:** [client/package.json](../../../client/package.json)
* **Backend Test Specification:** [Backend API Testing](../testing/api_testing.md)
* **Frontend Test Specification:** [Frontend Client Testing](../testing/client_testing.md)

## Related Nodes

* Back to [Workflows Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
