---
type: index
title: MEDGREENREV
description: Master Knowledge Graph governing the WebGIS architecture, medieval agricultural domain models, spatial API infrastructure, frontend client, and testing workflows.
version: 0.2.0
status: active
tags: [ webgis, archaeology, medieval, agriculture, mediterranean, okf, architecture, testing, workflows, infrastructure ]
---

# MEDGREENREV Knowledge Graph

## Mission & Purpose

The **MEDGREENREV** project (*Re-thinking the “Green Revolution” in the Medieval Western Mediterranean, 6th–16th centuries*) is a containerized WebGIS platform that models, analyzes, and visualizes archaeological, botanical, zoological, pottery, stratigraphic, historical, and paleoclimatic data.

---

## Knowledge Graph Architecture & Location

> **Important Notice on Knowledge Architecture**
> This project strictly implements the **Open Knowledge Format (OKF)** as an internal, traversable Knowledge Graph. The entire graph resides strictly within the **`docs/okf`** directory. All AI agents, automated pipelines, and developer workflows operating on this system MUST traverse the file tree under `docs/okf` as their primary contextual ground truth.

The knowledge graph is organized across three tiers:
* **Tier 1:** Domain Hub Indices and high-level service overviews.
* **Tier 2:** Granular subsystem specifications, foreign key policies, validation constraints, query extensions, spatial views, IPC topology, deployment pipelines, WebGIS mapping, state management, and test fixture hierarchies.
* **Tier 3:** Direct implementation files and code-level entity contracts.

---

## Domain Hubs

### 1. [Graph Meta & Conventions](./meta/index.md)
* [Architecture-as-Code Principles](./meta/architecture_as_code.md) – Spec-first development workflow and status progression.
* [Graph Authoring & Non-Duplication Policy](./meta/authoring_rules.md) – Multi-tier OKF conventions, Code-First Ground Truth principle, `.junie/` artifact exclusion, and Target Resolution Contract.

### 2. [Infrastructure & Containerization](./infrastructure/index.md)
* [Unix Domain Socket IPC & Topology](./infrastructure/socket_ipc_topology.md) – Shared socket communication (`php_socket`, `pg_socket`, `redis_socket`) and zero-TCP overhead design.
* [PHP Application Service](./infrastructure/php_service.md) – Symfony 7.x PHP 8.4-FPM container runtime and CLI console environment.
* [Nginx Web Server Service](./infrastructure/nginx_service.md) – Reverse proxy, static client host at `/app/`, media serving, and GeoServer routing.
* [PostGIS Database Service](./infrastructure/database_service.md) – PostgreSQL database with PostGIS extensions and automated backup utilities.
* [Redis Cache Service](./infrastructure/redis_service.md) – Low-latency Unix socket caching and message broker.
* [GeoServer Spatial Service](./infrastructure/geoserver_service.md) – OGC WMS/WFS spatial data publishing backed by PostGIS JNDI pool.
* [Certbot SSL Service](./infrastructure/certbot_service.md) – Let's Encrypt automated certificate management.
* [Node Tools Service](./infrastructure/node_tools_service.md) – Node.js 22 container profile for Nuxt SPA development and static site generation.

### 3. [Backend & Domain Architecture](./backend/index.md)
* [Domain Entity Modeling Subsystem](./backend/entities/index.md) – Entity modeling principles, multi-schema partitioning, base joins, and modular research subdomain specifications.
  * [Authentication & Identity Entities](./backend/entities/auth.md) – User, RefreshToken, and SiteUserPrivilege access models.
  * [Stratigraphy & Spatial Sites](./backend/entities/stratigraphy_sites.md) – Root spatial sites, stratigraphic units, microstratigraphy, and contexts.
  * [Specialist Analyses & Subjects](./backend/entities/specialist_analyses.md) – Scientific analyses, `BaseAnalysisJoin` subclasses, archaeobotany, zooarchaeology, pottery, and paleoclimate.
  * [Historical Sources & Taxa](./backend/entities/history.md) – Written sources, cited works, historical plant/animal references, and locations.
  * [Controlled Vocabularies & Lookups](./backend/entities/vocabularies.md) – Standard taxonomies, chronological periods, and shared lookup entities.
* [API Platform Architecture & Operations](./backend/api_platform.md) – API Platform resource configuration, lifecycle processors, DTO pipelines, and serialization normalizers.
* [Database Architecture & Policies](./backend/database.md) – Schema partitioning, `vw_` database view isolation, DBAL regex filtering, and pre/post-1.0.0 migration strategies.
* [Foreign Key Deletion & Referential Integrity Policies](./backend/foreign_key_policies.md) – `CASCADE` vs `RESTRICT` rules, child dependency protection, and table inheritance cleanup.
* [Analysis Join Constraints & Validation Architecture](./backend/analysis_validation_constraints.md) – `BaseAnalysisJoin` mapped superclass, `PermittedAnalysisType` validator, and database triggers for absolute dating integrity.
* [Doctrine ORM Query Extensions & Security Filtering](./backend/query_extensions_filtering.md) – ApiPlatform collection/item query extensions for site privileges, public media isolation, and nested subresources.
* [GeoServer Integration & Spatial Architecture](./backend/geoserver.md) – PostGIS spatial views (`geoserver.vw_*`), custom API Platform spatial operations, state providers, and GeoServer OGC WMS/WFS publishing.
* [Authorization & Security Model](./backend/authorization.md) – Role-based access control, site-specific permissions (`SiteUserPrivilege`), and security voters.

### 4. [Frontend Client Architecture](./frontend/index.md)
* [Client Application Architecture & SPA Hosting](./frontend/client_architecture.md) – Nuxt 4 SPA configuration (`ssr: false`, `/app/` base URL), hash routing with `qs` serialization, `@sidebase/nuxt-auth` lifecycle, route firewall, and Vuetify 4 integration.
* [State Management & Data Layer Architecture](./frontend/state_data_layer.md) – Pinia stores, Pinia Colada hierarchical caching (`useAppQueryCache`), `useCollectionQueryStore`, sub-collection filter inheritance via `filterPath`, `useDynamicVocabularyStore`, and `useOpenApiStore`.
* [WebGIS Mapping & Spatial Data Layer](./frontend/webgis_mapping.md) – OpenLayers component architecture, BBOX vector loading, dynamic count aggregation mode (`number_matched`, dual styling, declutter toggling), layer exclusivity, and popups.
* [Dynamic Search & Filter Engine Subsystem](./frontend/search_filtering.md) – Filter path mapping (`FILTERS_PATHS_MAP`), static definitions, `@regle/core`-validated operand components, and Hydra query generation.
* [Resource Configuration & CRUD Workflow Subsystem](./frontend/resource_crud_workflow.md) – Standardized 7-component lifecycle pattern, `ResourceConfig` registry, composite analysis-subject tabbed pages, and form validation pipelines.

### 5. [Testing & Quality Assurance](./testing/index.md)
* [Backend API Testing Specification](./testing/api_testing.md) – PHPUnit test suites, `DAMA\DoctrineTestBundle` transactional rollback, and test environment isolation.
* [Test Fixtures & Data Seeding Architecture](./testing/fixtures_test_data.md) – Alice/Hautelook fixture hierarchy, relational dataset seeding, and media upload isolation.
* [Frontend Client Testing Specification](./testing/client_testing.md) – Vitest component tests and Playwright E2E browser automation.

### 6. [Operational & Developer Workflows](./workflows/index.md)
* [Database Lifecycle & Migration Workflow](./workflows/database_lifecycle.md) – Pre-1.0.0 development rebuilds, schema regeneration, purpose-specific migrations, and post-1.0.0 production incremental migrations.
* [GeoServer Operations & Entity Integration Workflow](./workflows/geoserver_operations.md) – PostGIS spatial views, REST layer publication, API Platform feature collections, and WFS test suites.
* [Server & Container Deployment Workflow](./workflows/server_deployment.md) – Automated production deployment pipeline, Docker Compose overrides, environment secrets, and systemd service supervision.
* [SSL Certificate Lifecycle & Renewal Workflow](./workflows/ssl_certificate_lifecycle.md) – Dual-stage SSL certificate initialization, Let's Encrypt ACME renewal, and Nginx automated reload.
* [Client Synchronization & Build Workflow](./workflows/client_sync.md) – OpenAPI schema regeneration, PHP container restart, and Nuxt static asset compilation.
* [Testing Execution Workflow](./workflows/testing.md) – Standard commands for running PHPUnit, Vitest, and Playwright suites.
