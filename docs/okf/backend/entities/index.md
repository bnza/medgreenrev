---
type: index
title: Domain Entity Modeling Subsystem
description: Domain entity modeling philosophy, multi-schema partitioning (Auth, Data, Vocabulary), mapped superclasses, and modular research subdomain specifications.
version: 0.2.0
status: active
target_file: api/src/Entity/
---

# Domain Entity Modeling Subsystem

## Architectural Role

The MEDGREENREV entity layer in [api/src/Entity/](../../../../api/src/Entity/) models the complex interdisciplinary domains of Mediterranean environmental and archaeological research. Built with Doctrine ORM and API Platform, entities are organized into three distinct namespaces matching PostgreSQL database schemas: `Auth`, `Data`, and `Vocabulary`.

The system emphasizes strict relational integrity, polymorphic association patterns for laboratory analyses, and specialized view entities for high-performance read models.

---

## Multi-Schema Partitioning

```
[PostgreSQL Database]
   ├── [auth schema]       ──► Auth\ (Identity, JWT tokens, SiteUserPrivilege)
   ├── [data schema]       ──► Data\ (Excavations, stratigraphy, specialist finds, analyses, history)
   └── [vocabulary schema] ──► Vocabulary\ (Controlled dictionaries, taxonomies, periods, regions)
```

1. **`App\Entity\Auth` (Schema `auth`):**
   * Encapsulates authentication credentials, refresh tokens, and site-level authorization grants.
   * Isolates sensitive user data from research datasets.
2. **`App\Entity\Data` (Schema `data`):**
   * Encapsulates primary excavation observations, spatial sites, stratigraphy, specialist analyses, historical texts, and media attachments.
   * Implements strict foreign key constraints (`RESTRICT` on aggregates, `CASCADE` on junctions).
3. **`App\Entity\Vocabulary` (Schema `vocabulary`):**
   * Houses controlled dictionaries, hierarchical biological taxonomies, ceramic typologies, and chronological centuries.
   * Standardizes shared vocabularies across archaeological sites and analytical laboratories.

---

## Base Join Patterns & Mapped Superclasses

To support scientific analyses and multimedia across diverse archaeological subjects without code duplication, the architecture utilizes Doctrine `#[ORM\MappedSuperclass]` patterns:

### 1. `BaseAnalysisJoin`
* **Path:** [api/src/Entity/Data/Join/Analysis/BaseAnalysisJoin.php](../../../../api/src/Entity/Data/Join/Analysis/BaseAnalysisJoin.php)
* **Function:** Serves as the base mapped superclass for linking a laboratory `Analysis` entity to a specific archaeological subject (e.g., pottery, seed, bone, sediment core depth).
* **Guarantees:**
  * Defines `$id`, `$analysis` (referencing `Analysis` with `ON DELETE CASCADE`), and optional `$summary`.
  * Mandates unique subject-analysis pairings via `#[ORM\UniqueConstraint(fields: ['subject', 'analysis'])]`.
  * Integrates with `PermittedAnalysisTypeValidator` to ensure only compatible analysis types can be linked to concrete subjects.

### 2. `AbsDatingAnalysisJoin`
* **Path:** [api/src/Entity/Data/Join/Analysis/AbsDating/AbsDatingAnalysisJoin.php](../../../../api/src/Entity/Data/Join/Analysis/AbsDating/AbsDatingAnalysisJoin.php)
* **Function:** Extends concrete analysis join entities with absolute dating fields (radiocarbon C14, luminescence OSL/TL).
* **Guarantees:**
  * Records uncalibrated dating determinations (BP), standard laboratory error ($\pm$), and calibrated calendar date ranges.
  * Enforces PostgreSQL table checks (`chk_analysis_types_absdating_id_range`) and triggers (`trg_abs_dating_*`).

### 3. `BaseMediaObjectJoin`
* **Path:** [api/src/Entity/Data/Join/MediaObject/BaseMediaObjectJoin.php](../../../../api/src/Entity/Data/Join/MediaObject/BaseMediaObjectJoin.php)
* **Function:** Base mapped superclass attaching a `MediaObject` file (photograph, drawing, photogrammetry model) to any domain entity.
* **Guarantees:**
  * Enforces `ON DELETE CASCADE` on both target entity and `MediaObject`.
  * Injects visibility filters for unauthenticated requests via `PublicMediaSecurityExtension`.

---

## Read-Only View Entities (`App\Entity\Data\View`)

High-performance read queries, API collection serializers, and GeoServer layer publishers leverage PostgreSQL views mapped to unmanaged Doctrine entities:
* **Polymorphic Views:** `AnalysisSubjectView` (`vw_analysis_subjects`) aggregates all 13 analysis join tables into a unified subject-analysis query model.
* **Absolute Dating Views:** `AbsDatingAnalysisView` (`vw_abs_dating_analyses`) standardizes radiocarbon and luminescence queries.
* **Code & Format Views:** Formatted lookup views (e.g., `BotanyCharcoalView`, `ZooBoneView`, `MicrostratigraphicUnitCodeView`) pre-compute human-readable composite identifiers.

---

## Subsystem Specifications

The entity layer is partitioned into five focused domain specifications:

* [Authentication & Identity](./auth.md) – User accounts, JWT refresh tokens, and site-level permissions (`SiteUserPrivilege`).
* [Stratigraphy & Spatial Sites](./stratigraphy_sites.md) – Excavation sites, environmental sampling sites, stratigraphic units (SU/MU), and contexts.
* [Specialist Analyses & Subjects](./specialist_analyses.md) – Scientific analyses, `BaseAnalysisJoin` subclasses, archaeobotany, zooarchaeology, pottery, and paleoclimate.
* [Historical Sources & Taxa](./history.md) – Written primary sources, bibliographic cited works, historical plant/animal records, and locations.
* [Controlled Vocabularies & Lookups](./vocabularies.md) – Taxonomic hierarchies (botany/zoo), ceramic typologies, chronological periods, and geographic regions.

---

## Related Nodes

* [API Platform Architecture & Operations](../api_platform.md) – API Platform operations, state providers, and DTO contracts.
* [Database Architecture & Policies](../database.md) – PostgreSQL schema partitioning and migration strategies.
* [Foreign Key Policies](../foreign_key_policies.md) – Referential integrity and cascade rules.
* [Analysis Validation Constraints](../analysis_validation_constraints.md) – Validator and trigger constraints on analysis joins.
* [Authorization & Security Model](../authorization.md) – Role-based and site-level security policies.
* Back to [Backend Hub](../index.md)
* Back to [Main Knowledge Graph Index](../../index.md)
