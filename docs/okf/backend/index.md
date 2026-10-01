---
type: index
title: Backend & Domain Architecture
description: Symfony 7.x API Platform architecture, multi-schema domain entities, Doctrine ORM query extensions, validation constraints, database view isolation, and authorization model.
version: 0.2.0
status: active
---

# Backend & Domain Architecture

## Overview

The MEDGREENREV backend is a Symfony 7.x REST API powered by API Platform 3.x and Doctrine ORM, backed by a PostgreSQL database with PostGIS extensions. It models archaeological excavations, scientific specialist analyses (archaeobotany, zooarchaeology, ceramic analysis, microstratigraphy, paleoclimate), historical written sources, and shared controlled vocabularies.

The architecture enforces strict separation of concerns across multiple PostgreSQL schemas, transparent query-level authorization via Doctrine extensions, custom geospatial API operations integrated with GeoServer, and rigorous referential integrity policies.

---

## Architectural Pillars

* **Multi-Schema Entity Namespaces:** Entities are partitioned into three dedicated namespaces (`Auth`, `Data`, `Vocabulary`) mapped directly into PostgreSQL database schemas (`auth`, `data`, `vocabulary`).
* **API Platform Resource & Spatial Engine:** Exposes standard CRUD operations alongside specialized GeoJSON feature collections (`#[GetFeatureCollection]`, `#[GetAggregatedFeatureCollection]`, `#[ExportFeatureCollection]`) driven by custom state providers and processors.
* **Referential Integrity & Delete Policies:** Explicit `CASCADE` vs `RESTRICT` foreign key rules balance automated junction cleanup with safety locks preventing accidental deletion of primary domain aggregates.
* **Multi-Layer Analysis Constraints:** Symfony validator constraints (`PermittedAnalysisType`) combine with PostgreSQL triggers and table checks to protect scientific analysis relationships.
* **ORM Query Extensions & Security Filtering:** ApiPlatform query extensions transparently filter site-level permissions, private media objects, and subresource routes at the ORM query level before database execution.
* **Database View Isolation:** API-consumed taxonomy read models and GeoServer-published analytical aggregates are structured as database views prefixed with `vw_`, segregated from standard Doctrine DDL diffs via DBAL `schema_filter`.
* **Granular Site-Level Authorization:** Access control combines standard Symfony security roles with site-specific user and editor privileges (`SiteUserPrivilege`).

---

## Architecture & Subsystem Specifications

### Domain Entities Subsystem
* [Domain Entity Modeling Subsystem](./entities/index.md) – Entity modeling principles, multi-schema partitioning, base joins, and modular research subdomain specifications.
  * [Authentication & Identity Entities](./entities/auth.md) – User, RefreshToken, and SiteUserPrivilege access models.
  * [Stratigraphy & Spatial Sites](./entities/stratigraphy_sites.md) – Root spatial sites, stratigraphic units, microstratigraphy, and contexts.
  * [Specialist Analyses & Subjects](./entities/specialist_analyses.md) – Scientific analyses, `BaseAnalysisJoin` subclasses, archaeobotany, zooarchaeology, pottery, and paleoclimate.
  * [Historical Sources & Taxa](./entities/history.md) – Written sources, cited works, historical plant/animal references, and locations.
  * [Controlled Vocabularies & Lookups](./entities/vocabularies.md) – Standard taxonomies, chronological periods, and shared lookup entities.

### Framework & System Architecture
* [API Platform Architecture & Operations](./api_platform.md) – API Platform resource configuration, lifecycle processors, DTO pipelines, and serialization normalizers.
* [Database Architecture & Policies](./database.md) – PostgreSQL schema partitioning, `vw_` view naming conventions, DBAL regex filtering, and pre/post-1.0.0 migration strategies.
* [Foreign Key Deletion & Referential Integrity Policies](./foreign_key_policies.md) – `CASCADE` vs `RESTRICT` deletion rules, child-to-parent constraints, and entity dependency behaviors.
* [Analysis Join Constraints & Validation Architecture](./analysis_validation_constraints.md) – `BaseAnalysisJoin` mapped superclass, `PermittedAnalysisType` validator, and database-level triggers for absolute dating integrity.
* [Doctrine ORM Query Extensions & Security Filtering](./query_extensions_filtering.md) – ApiPlatform collection/item query extensions for site privileges, public media isolation, and nested subresources.
* [GeoServer Integration & Spatial Architecture](./geoserver.md) – Purpose-specific PostGIS views (`geoserver.vw_*`), custom API Platform spatial operations, state providers, and GeoServer OGC WMS/WFS publishing.
* [Authorization & Security Model](./authorization.md) – Role hierarchy, site-specific permissions (`SiteUserPrivilege`), and security voters.

---

## Related Nodes

* [Infrastructure Hub](../infrastructure/index.md) – PHP-FPM service, PostgreSQL database, and GeoServer service topology.
* [Frontend Hub](../frontend/index.md) – Nuxt 4 SPA client architecture and WebGIS mapping layer.
* [Testing Hub](../testing/index.md) – API testing suite, fixtures, and verification pipelines.
* [Workflows Hub](../workflows/index.md) – Database lifecycle, GeoServer synchronization, and deployment workflows.
* Back to [Main Knowledge Graph Index](../index.md)
