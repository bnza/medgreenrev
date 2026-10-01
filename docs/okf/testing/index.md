---
type: index
title: Testing & Quality Assurance
description: Multi-tier testing strategy encompassing Symfony PHPUnit suites, Alice/Hautelook fixtures, Vitest unit tests, and Playwright E2E suites.
version: 0.2.0
status: active
---

# Testing & Quality Assurance

## Overview

The MEDGREENREV testing strategy enforces automated verification across both backend and frontend layers to guarantee data integrity, API contract adherence, and UI reliability.

---

## 4-Tier Testing Pyramid

1. **Backend Unit Tests:** Isolated PHPUnit tests for services, DQL functions, and utility classes.
2. **Backend Functional / API Tests:** Symfony `WebTestCase` suites validating API Platform endpoints, security extensions, site privilege policies, and database transactions wrapped via `DAMA\DoctrineTestBundle`.
3. **Frontend Component & Unit Tests:** Vitest test suites running in Nuxt jsdom environments verifying Vue components, Pinia stores, and composables.
4. **End-to-End (E2E) Browser Tests:** Playwright suites automating user journeys, authentication flows, and WebGIS map interactions across browser engines.

---

## Testing Specifications

* [Backend API Testing Specification](./api_testing.md) – PHPUnit configuration, DAMA transaction isolation, and test suite execution.
* [Test Fixtures & Data Seeding Architecture](./fixtures_test_data.md) – Alice/Hautelook fixture hierarchy, relational dataset seeding, and media upload isolation.
* [Frontend Client Testing Specification](./client_testing.md) – Vitest unit testing and Playwright E2E automation.

---

## Related Workflows

* [Testing Execution Workflow](../workflows/testing.md)
* Back to [Main Knowledge Graph Index](../index.md)
