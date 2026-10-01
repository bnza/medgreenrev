---
type: architecture_document
title: Stratigraphy & Spatial Sites Entities
status: active
target_file: api/src/Entity/Data/
---

# Stratigraphy & Spatial Sites Entities

## Architectural Role

Excavation field observations and environmental investigations in MEDGREENREV are anchored to root spatial sites and hierarchical stratigraphic sequences. Defined in [api/src/Entity/Data/](../../../../api/src/Entity/Data/) under the `data` PostgreSQL schema, these entities model spatial excavation boundaries, off-site sampling points, sediment cores, and stratigraphic relationships (Harris matrix).

---

## Root Spatial Sites

```
[Spatial Root Sites]
   ├── ArchaeologicalSite (Excavation) ──► Contexts, StratigraphicUnits (SU), Samples
   ├── SamplingSite (Off-Site)         ──► SedimentCores, SamplingStratigraphicUnits
   └── PaleoclimateSamplingSite        ──► PaleoclimateSamples
```

### 1. `ArchaeologicalSite`
* **Path:** [api/src/Entity/Data/ArchaeologicalSite.php](../../../../api/src/Entity/Data/ArchaeologicalSite.php)
* **Table:** `data.archaeological_sites`
* **Core Attributes:**
  * `$code`: Unique excavation code (e.g., `CP` for Can Pignatel).
  * `$name`, `$description`, `$region` (referencing `Vocabulary\Region`).
  * `$point`: PostGIS `geometry(Point, 4326)` representing the geographic centroid.
  * `$culturalContexts`: Many-to-Many association via `SiteCulturalContext` (`Vocabulary\CulturalContext`).
  * `$createdBy`: User ownership with `RESTRICT` safety lock.
* **API Platform & Spatial Mechanics:**
  * Exposes custom GeoJSON operations (`#[GetFeatureCollection]`, `#[GetAggregatedFeatureCollection]`, `#[ExportFeatureCollection]`).
  * Output DTOs: `WfsGetFeatureCollectionExtentMatched` (bounding box) and `WfsGetFeatureCollectionNumberMatched` (feature counts).
  * Lifecycle Processor: `SitePostProcessor` parses coordinates ($N, E$) and serializes PostGIS geometry.
  * Security: Modifying or deleting a site requires `PRIVILEGE_EDITOR` via `SiteUserPrivilege`.

### 2. `SamplingSite`
* **Path:** [api/src/Entity/Data/SamplingSite.php](../../../../api/src/Entity/Data/SamplingSite.php)
* **Table:** `data.sampling_sites`
* **Core Attributes:**
  * Represents off-site environmental, botanical, or limnological sampling locations (wetlands, lakes, caves).
  * Contains `$code`, `$name`, `$point` (PostGIS), `$description`, and `$region`.
  * Parents environmental sediment coring and sampling stratigraphic observations.

### 3. `PaleoclimateSamplingSite`
* **Path:** [api/src/Entity/Data/PaleoclimateSamplingSite.php](../../../../api/src/Entity/Data/PaleoclimateSamplingSite.php)
* **Table:** `data.paleoclimate_sampling_sites`
* **Core Attributes:**
  * Dedicated spatial anchor for paleoclimatological cores and speleothem records.
  * Parents `PaleoclimateSample` child records.

---

## Stratigraphic & Context Hierarchy

### 1. `StratigraphicUnit` (SU)
* **Path:** [api/src/Entity/Data/StratigraphicUnit.php](../../../../api/src/Entity/Data/StratigraphicUnit.php)
* **Table:** `data.stratigraphic_units`
* **Core Attributes & Invariants:**
  * `$site`: Foreign key to `ArchaeologicalSite`.
  * `$number`: Stratigraphic unit number.
  * Unique Constraint: `#[ORM\UniqueConstraint(columns: ['site_id', 'number'])]` guarantees unique numbering per site.
  * `$description`, `$year`, `$interpretation`.
* **Stratigraphic Relationships (Harris Matrix):**
  * Linked through `StratigraphicUnitRelationship` with vocabulary term `Vocabulary\StratigraphicUnit\Relation` (e.g., *earlier than*, *later than*, *cuts*, *fills*, *contemporary with*).
* **Child Observations & Deletion Protection:**
  * Direct parent to `MicrostratigraphicUnit` and physical finds (`Pottery`, `ZooBone`, `ZooTooth`, `BotanySeed`, `BotanyCharcoal`, `Individual`).
  * Enforces `RESTRICT` deletion rules: an SU cannot be deleted while child units, pottery, or specialist specimens exist.

### 2. `MicrostratigraphicUnit` (MU)
* **Path:** [api/src/Entity/Data/MicrostratigraphicUnit.php](../../../../api/src/Entity/Data/MicrostratigraphicUnit.php)
* **Table:** `data.microstratigraphic_units`
* **Core Attributes:**
  * Represents micro-facies or sub-laminae identified within an excavated layer.
  * Linked to `$stratigraphicUnit` with a localized micro-unit number.

### 3. `Context`
* **Path:** [api/src/Entity/Data/Context.php](../../../../api/src/Entity/Data/Context.php)
* **Table:** `data.contexts`
* **Core Attributes:**
  * Higher-level spatial or interpretive aggregate (e.g., room, wall, tomb, hearth, burial trench).
  * Linked to multiple SUs through the junction entity `ContextStratigraphicUnit`.

### 4. `SamplingStratigraphicUnit` & `SedimentCore`
* **`SamplingStratigraphicUnit`:** [api/src/Entity/Data/SamplingStratigraphicUnit.php](../../../../api/src/Entity/Data/SamplingStratigraphicUnit.php) models stratigraphic horizons recorded at an off-site `SamplingSite`.
* **`SedimentCore`:** [api/src/Entity/Data/SedimentCore.php](../../../../api/src/Entity/Data/SedimentCore.php) models vertical coring columns; depth intervals are recorded via `SedimentCoreDepth` to host palynological, microcharcoal, and isotopic analyses.

---

## Key Relationships

* **Entity Directory:** [api/src/Entity/Data/](../../../../api/src/Entity/Data/)
* **GeoServer Integration:** [GeoServer Integration & Spatial Architecture](../geoserver.md)
* **API Platform Operations:** [API Platform Architecture & Operations](../api_platform.md)
* **Foreign Key Policies:** [Foreign Key Deletion & Referential Integrity Policies](../foreign_key_policies.md)
* **Specialist Analyses:** [Specialist Analyses & Subjects](./specialist_analyses.md)

---

## Related Nodes

* Back to [Domain Entities Subsystem](./index.md)
* Back to [Backend Hub](../index.md)
* Back to [Main Knowledge Graph Index](../../index.md)
