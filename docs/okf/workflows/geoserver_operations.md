---
type: workflow
title: GeoServer Operations & Entity Integration Workflow
status: active
target_file: docker/geoserver/
---

# GeoServer Operations & Entity Integration Workflow

## Architectural Role

GeoServer acts as the geospatial data engine for MEDGREENREV, publishing vector layers via standard Open Geospatial Consortium (OGC) Web Feature Service (WFS) and Web Map Service (WMS) protocols. The Symfony backend operates as an authenticated API Platform proxy and aggregator, exposing standardized `/features/*` endpoints that query GeoServer's WFS service internally and return GeoJSON feature collections, bounding box extents, count metrics, and raw exports to the Vue 3 OpenLayers client.

Exposing a new archaeological, specialist, historical, or environmental entity through GeoServer follows a four-stage integration lifecycle:
1. **Spatial Database View Definition:** PostGIS database view in the `geoserver` schema.
2. **GeoServer Layer Publication:** Feature type registration and spatial bounding box configuration via the GeoServer REST API.
3. **API Platform Operation Configuration:** Custom metadata operations, DTO outputs, and GeoServer state providers on the entity.
4. **Functional Testing & Verification:** PHPUnit integration tests verifying GeoJSON structure, filtering consistency, matched counts, and extent bounds.

---

## Entity Classification Model

The integration pattern depends on whether an entity owns geometry directly or inherits it relationally:

* **Root Geographic Entities:** Entities that directly contain a PostGIS point geometry (`the_geom`). Examples include `ArchaeologicalSite`, `SamplingSite`, `PaleoclimateSamplingSite`, and `HistoryLocation`. These entities use direct WFS feature collection queries (`GetFeatureCollection`) and non-aggregated providers.
* **Child (Aggregated) Entities:** Entities that inherit spatial coordinates from a parent root geographic entity through a relational path (e.g., `Pottery` $\rightarrow$ `StratigraphicUnit` $\rightarrow$ `ArchaeologicalSite`, or `SedimentCoreDepth` $\rightarrow$ `SedimentCore` $\rightarrow$ `SamplingSite`). These entities use parent-grouped aggregated queries (`GetAggregatedFeatureCollection`) and aggregated providers.

---

## End-to-End Entity Integration Workflow

```
[1. PostgreSQL/PostGIS] ──► geoserver.vw_<entity> (Migration: Version20260323152247.php)
         │
         ▼
[2. GeoServer REST API] ──► Register Feature Type (POST/PUT /rest/.../featuretypes)
         │                   Persisted to docker/geoserver/data/
         ▼
[3. Symfony API Entity] ──► #[GetFeatureCollection] / #[GetAggregatedFeatureCollection]
         │                   State Providers & Output DTOs (/features/*)
         ▼
[4. PHPUnit Test Suite] ──► tests/Functional/Api/Resource/Geoserver/ApiResource*Test.php
```

---

### Stage 1: Spatial Database View Definition

Spatial views reside in the dedicated `geoserver` PostgreSQL database schema and are managed through [api/migrations/Version20260323152247.php](../../../api/migrations/Version20260323152247.php).

#### 1. Schema & View Naming Invariants
* Schema: `geoserver`
* View Naming Pattern: `geoserver.vw_<entity_table_name>`
* DBAL Isolation: Views prefixed with `vw_` are excluded from standard Doctrine migrations by the `schema_filter` in [api/config/packages/doctrine.yaml](../../../api/config/packages/doctrine.yaml).

#### 2. Root Entity SQL View Pattern (`SamplingSite`)
Root entities select their primary identification columns, join controlled vocabulary tables for human-readable labels, and select `the_geom` directly:

```sql
CREATE OR REPLACE VIEW geoserver.vw_sampling_sites AS
SELECT
    s.id,
    s.code,
    s.name,
    s.description,
    r.value AS region,
    s.the_geom
FROM sampling_sites s
JOIN vocabulary.regions r ON s.region_id = r.id;
```

#### 3. Child Entity SQL View Pattern (`Pottery`)
Child entities join through their parent hierarchy to obtain `the_geom`, parent identification fields (`site_id`, `site_code`, `site_name`), and composite hierarchical codes (e.g., `su_code` via stored function `generate_code_su`):

```sql
CREATE OR REPLACE VIEW geoserver.vw_potteries AS
SELECT
    p.id, p.inventory, p.inner_color, p.outer_color, p.decoration_motif,
    p.chronology_lower, p.chronology_upper, p.notes,
    st.value AS surface_treatment,
    cc.value AS cultural_context,
    sh.value AS shape,
    fg.value AS functional_group,
    ff.value AS functional_form,
    su.site_id,
    s.code AS site_code,
    s.name AS site_name,
    s.the_geom,
    generate_code_su(s.code, su.year, su.number) AS su_code
FROM potteries p
JOIN sus su ON p.stratigraphic_unit_id = su.id
JOIN archaeological_sites s ON su.site_id = s.id
LEFT JOIN vocabulary.surface_treatment st ON p.surface_treatment_id = st.id
LEFT JOIN vocabulary.cultural_contexts cc ON p.cultural_context_id = cc.id
LEFT JOIN vocabulary.pottery_shapes sh ON p.part_id = sh.id
LEFT JOIN vocabulary.pottery_functional_forms ff ON p.functional_form_id = ff.id
LEFT JOIN vocabulary.pottery_functional_groups fg ON ff.functional_group_id = fg.id;
```

#### 4. Applying Migration Changes (Development Phase)
Following database modifications in pre-1.0.0 development, rebuild both `dev` and `test` databases per the [Database Lifecycle & Migrations Workflow](./database_lifecycle.md):

```bash
docker compose exec php bin/console doctrine:database:drop --force
docker compose exec php bin/console doctrine:database:create
docker compose exec php bin/console doctrine:migrations:migrate --no-interaction
docker compose exec php bin/console hautelook:fixtures:load --no-interaction

docker compose exec php bin/console doctrine:database:drop --force --env=test
docker compose exec php bin/console doctrine:database:create --env=test
docker compose exec php bin/console doctrine:migrations:migrate --no-interaction --env=test
docker compose exec php bin/console hautelook:fixtures:load --no-interaction --env=test
```

---

### Stage 2: GeoServer REST API Layer Publication

GeoServer stores its active workspace, datastore, and layer configurations on the container filesystem at `docker/geoserver/data/` (version-controlled in the repository). New layers are registered via GeoServer's REST API.

#### 1. REST Prerequisites
* **Workspace:** `mgr`
* **Datastore:** `medgreenrev` (connecting to PostgreSQL `geoserver` schema)
* **Default REST Endpoint:** `http://geoserver:8080/geoserver/rest/workspaces/mgr/datastores/medgreenrev/featuretypes`
* **Authentication:** HTTP Basic Auth credentials (`geoserver:geoserver`)

#### 2. Publishing Layers via REST (JSON Payload)
Publish a view as a GeoServer feature type layer using POST. The published layer name in GeoServer matches the entity table name without the `vw_` prefix (prefixed with workspace `mgr:` in WFS requests):

```bash
# Example: Publish vw_sampling_sites as mgr:sampling_sites
docker compose exec php curl -u geoserver:geoserver -X POST \
  "http://geoserver:8080/geoserver/rest/workspaces/mgr/datastores/medgreenrev/featuretypes" \
  -H "Content-Type: application/json" \
  -d '{
    "featureType": {
      "name": "sampling_sites",
      "nativeName": "vw_sampling_sites",
      "title": "Sampling Sites",
      "srs": "EPSG:4326",
      "enabled": true
    }
  }'

# Example: Publish vw_potteries as mgr:potteries
docker compose exec php curl -u geoserver:geoserver -X POST \
  "http://geoserver:8080/geoserver/rest/workspaces/mgr/datastores/medgreenrev/featuretypes" \
  -H "Content-Type: application/json" \
  -d '{
    "featureType": {
      "name": "potteries",
      "nativeName": "vw_potteries",
      "title": "Potteries",
      "srs": "EPSG:4326",
      "enabled": true
    }
  }'
```

#### 3. Explicit SRS & Bounding Box Configuration (XML Payload)
For layers requiring explicit spatial bounds definitions:

```bash
# Create feature type with explicit bounding boxes
docker compose exec php curl -u geoserver:geoserver -X POST \
  "http://geoserver:8080/geoserver/rest/workspaces/mgr/datastores/medgreenrev/featuretypes" \
  -H "Content-Type: application/xml" \
  -d '<featureType>
    <name>stratigraphic_units</name>
    <nativeName>vw_stratigraphic_units</nativeName>
    <title>Stratigraphic Units</title>
    <srs>EPSG:4326</srs>
    <nativeBoundingBox>
      <minx>-10.0</minx><maxx>11.0</maxx>
      <miny>32.0</miny><maxy>44.0</maxy>
      <crs>EPSG:4326</crs>
    </nativeBoundingBox>
    <latLonBoundingBox>
      <minx>-10.0</minx><maxx>11.0</maxx>
      <miny>32.0</miny><maxy>44.0</maxy>
      <crs>EPSG:4326</crs>
    </latLonBoundingBox>
    <enabled>true</enabled>
  </featureType>'

# Update existing feature type configuration
docker compose exec php curl -u geoserver:geoserver -X PUT \
  "http://geoserver:8080/geoserver/rest/workspaces/mgr/datastores/medgreenrev/featuretypes/stratigraphic_units" \
  -H "Content-Type: application/xml" \
  -d '<featureType>
    <title>Stratigraphic Units</title>
    <srs>EPSG:4326</srs>
    <nativeBoundingBox>
      <minx>-10.0</minx><maxx>11.0</maxx>
      <miny>32.0</miny><maxy>44.0</maxy>
      <crs>EPSG:4326</crs>
    </nativeBoundingBox>
    <latLonBoundingBox>
      <minx>-10.0</minx><maxx>11.0</maxx>
      <miny>32.0</miny><maxy>44.0</maxy>
      <crs>EPSG:4326</crs>
    </latLonBoundingBox>
    <enabled>true</enabled>
  </featureType>'
```

#### 4. Layer Verification
Confirm layer registration and SRS metadata:

```bash
docker compose exec php curl -u geoserver:geoserver \
  "http://geoserver:8080/geoserver/rest/workspaces/mgr/datastores/medgreenrev/featuretypes/sampling_sites.json"
```

---

### Stage 3: API Platform Operation & State Provider Configuration

Backend Symfony entities in `api/src/Entity/Data/` expose four standard `/features/*` operations using custom ApiPlatform operation attributes and state providers.

#### Required Imports

```php
use App\Dto\Output\WfsGetFeatureCollectionExtentMatched;
use App\Dto\Output\WfsGetFeatureCollectionNumberMatched;
use App\Metadata\ExportFeatureCollection;
// For Root Geographic Entities:
use App\Metadata\GetFeatureCollection;
use App\State\GeoserverFeatureCollectionExtentMatchedProvider;
use App\State\GeoserverFeatureCollectionNumberMatchedProvider;
// For Child Entities:
use App\Metadata\GetAggregatedFeatureCollection;
use App\State\GeoserverAggregatedExtentMatchedProvider;
use App\State\GeoserverAggregatedNumberMatchedProvider;
```

#### 1. Root Geographic Entity Configuration (`SamplingSite`)

Root entities query GeoServer directly for their own spatial features:

```php
#[ApiResource(
    operations: [
        // ... Standard CRUD Operations ...

        // 1. WFS GeoJSON Feature Collection
        new GetFeatureCollection(
            uriTemplate: '/features/sampling_sites.{_format}',
            typeName: 'mgr:sampling_sites',
            propertyNames: ['id', 'code', 'name'],
        ),

        // 2. Count of Matched Features
        new Get(
            uriTemplate: '/features/number_matched/sampling_sites',
            defaults: ['typeName' => 'mgr:sampling_sites'],
            normalizationContext: ['groups' => ['wfs_number_matched:read']],
            output: WfsGetFeatureCollectionNumberMatched::class,
            provider: GeoserverFeatureCollectionNumberMatchedProvider::class,
        ),

        // 3. Bounding Box Extent of Matched Features
        new Get(
            uriTemplate: '/features/extent_matched/sampling_sites',
            defaults: ['typeName' => 'mgr:sampling_sites'],
            normalizationContext: ['groups' => ['wfs_extent_matched:read']],
            output: WfsGetFeatureCollectionExtentMatched::class,
            provider: GeoserverFeatureCollectionExtentMatchedProvider::class,
        ),

        // 4. Raw WFS Export
        new ExportFeatureCollection(
            uriTemplate: '/features/export/sampling_sites',
            typeName: 'mgr:sampling_sites',
        ),
    ],
)]
```

#### 2. Child Entity Configuration (`Pottery`)

Child entities group observations by parent site geometry and provide property path accessors:

```php
#[ApiResource(
    operations: [
        // ... Standard CRUD Operations ...

        // 1. Aggregated WFS GeoJSON Feature Collection (Grouped by Parent Site)
        new GetAggregatedFeatureCollection(
            uriTemplate: '/features/potteries.{_format}',
            typeName: 'mgr:archaeological_sites',       // Parent's GeoServer Layer
            parentAccessor: 'stratigraphicUnit.site',    // Dot-notation traversal path to root entity
            entityTypeName: 'mgr:potteries',             // Child entity's GeoServer Layer
            propertyNames: ['id', 'code', 'name'],       // Parent properties returned in GeoJSON
        ),

        // 2. Aggregated Matched Count
        new Get(
            uriTemplate: '/features/number_matched/potteries',
            defaults: ['typeName' => 'mgr:archaeological_sites', 'parentAccessor' => 'stratigraphicUnit.site'],
            normalizationContext: ['groups' => ['wfs_number_matched:read']],
            output: WfsGetFeatureCollectionNumberMatched::class,
            provider: GeoserverAggregatedNumberMatchedProvider::class,
        ),

        // 3. Aggregated Bounding Box Extent
        new Get(
            uriTemplate: '/features/extent_matched/potteries',
            defaults: ['typeName' => 'mgr:archaeological_sites', 'parentAccessor' => 'stratigraphicUnit.site'],
            normalizationContext: ['groups' => ['wfs_extent_matched:read']],
            output: WfsGetFeatureCollectionExtentMatched::class,
            provider: GeoserverAggregatedExtentMatchedProvider::class,
        ),

        // 4. Raw WFS Export
        new ExportFeatureCollection(
            uriTemplate: '/features/export/potteries',
            typeName: 'mgr:potteries',
        ),
    ],
)]
```

#### 3. Operation Specification Summary

| Endpoint Pattern | Operation Class | State Provider / Handler | Purpose |
|---|---|---|---|
| `/features/<entities>.{_format}` | `GetFeatureCollection` | `GeoserverFeatureCollectionProvider` | Returns direct GeoJSON features for root entities. |
| `/features/<entities>.{_format}` | `GetAggregatedFeatureCollection` | `GeoserverAggregatedFeatureCollectionProvider` | Returns parent-grouped GeoJSON features for child entities. |
| `/features/number_matched/<entities>` | `Get` | `GeoserverFeatureCollectionNumberMatchedProvider` / `GeoserverAggregatedNumberMatchedProvider` | Returns integer count of matched records. |
| `/features/extent_matched/<entities>` | `Get` | `GeoserverFeatureCollectionExtentMatchedProvider` / `GeoserverAggregatedExtentMatchedProvider` | Returns `[minx, miny, maxx, maxy]` spatial bounds. |
| `/features/export/<entities>` | `ExportFeatureCollection` | `GeoserverExportProvider` | Proxies raw GeoServer feature exports (GeoJSON/CSV/GML). |

---

### Stage 4: Functional Testing & Verification

Every GeoServer-integrated entity must have an automated test suite located in [api/tests/Functional/Api/Resource/Geoserver/](../../../api/tests/Functional/Api/Resource/Geoserver/).

#### 1. Test Suite Invariants
* **Location:** `api/tests/Functional/Api/Resource/Geoserver/`
* **Naming:** `ApiResource<EntityName>GeoserverTest.php`
* **Base Class:** `ApiTestCase` (ApiPlatform)
* **Traits:** `ApiTestRequestTrait`, `ApiTestProviderTrait`

#### 2. Required Test Methods

| Test Method | Assertions & Scenario |
|---|---|
| `testGetCollectionJsonUnfiltered` | Requests aggregated endpoint with `Accept: application/json`; asserts HTTP 200, JSON Content-Type, non-empty array of positive entity counts. |
| `testGetCollectionJsonFiltered` | Applies an entity query filter parameter (e.g., `?year=2024`); asserts filtered total count $\le$ unfiltered total count and positive integer counts. |
| `testGetCollectionGeoJson` | Requests `Accept: application/geo+json`; asserts HTTP 200, GeoJSON `FeatureCollection` schema, non-empty features array, `number_matched` property, and correct layer FID prefix (e.g., `potteries.1`). |
| `testGetNumberMatched` | Requests `/features/number_matched/<entities>`; asserts HTTP 200 and integer `numberMatched` response key. |
| `testGetExtentMatched` | Requests `/features/extent_matched/<entities>`; asserts HTTP 200 and 4-element coordinate bounding box array under `extent`. |
| `testAggregatedFeatureCollectionFilterConsistency` | (Child entities) Queries standard API Platform data endpoint with a filter, groups results in memory by parent ID using `parentAccessor`, and asserts exact count matching against the GeoServer aggregated endpoint. |
| `testGetExport` | Requests `/features/export/<entities>`; asserts HTTP 200 and valid file/stream payload. |

#### 3. Test Execution Commands

```bash
# Execute single entity GeoServer integration test
docker compose exec php bin/phpunit tests/Functional/Api/Resource/Geoserver/ApiResourcePotteryGeoserverTest.php --no-coverage

# Execute all GeoServer integration tests
docker compose exec php bin/phpunit tests/Functional/Api/Resource/Geoserver/ --no-coverage
```

---

## Complete Entity Integration Matrix

The table below lists all 18 GeoServer-published entities in MEDGREENREV, their PostgreSQL spatial views, layer identifiers, parent relationships, and property traversal accessors:

| Entity Class | SQL View (`geoserver.`) | Type | Layer (`typeName`) | Parent Layer | Property Accessor (`parentAccessor`) |
|---|---|---|---|---|---|
| `ArchaeologicalSite` | `vw_archaeological_sites` | Root | `mgr:archaeological_sites` | — | — |
| `SamplingSite` | `vw_sampling_sites` | Root | `mgr:sampling_sites` | — | — |
| `HistoryLocation` | `vw_history_locations` | Root | `mgr:history_locations` | — | — |
| `PaleoclimateSamplingSite` | `vw_paleoclimate_sampling_sites` | Root | `mgr:paleoclimate_sampling_sites` | — | — |
| `StratigraphicUnit` | `vw_stratigraphic_units` | Child | `mgr:stratigraphic_units` | `mgr:archaeological_sites` | `site` |
| `SamplingStratigraphicUnit` | `vw_sampling_stratigraphic_units` | Child | `mgr:sampling_stratigraphic_units` | `mgr:sampling_sites` | `site` |
| `MicrostratigraphicUnit` | `vw_mus` | Child | `mgr:microstratigraphic_units` | `mgr:archaeological_sites` | `stratigraphicUnit.site` |
| `Pottery` | `vw_potteries` | Child | `mgr:potteries` | `mgr:archaeological_sites` | `stratigraphicUnit.site` |
| `Individual` | `vw_individuals` | Child | `mgr:individuals` | `mgr:archaeological_sites` | `stratigraphicUnit.site` |
| `Mu` | `vw_mus` | Child | `mgr:mus` | `mgr:archaeological_sites` | `stratigraphicUnit.site` |
| `ZooBone` | `vw_zoo_bones` | Child | `mgr:zoo_bones` | `mgr:archaeological_sites` | `stratigraphicUnit.site` |
| `ZooTooth` | `vw_zoo_teeth` | Child | `mgr:zoo_teeth` | `mgr:archaeological_sites` | `stratigraphicUnit.site` |
| `BotanyCharcoal` | `vw_botany_charcoals` | Child | `mgr:botany_charcoals` | `mgr:archaeological_sites` | `stratigraphicUnit.site` |
| `BotanySeed` | `vw_botany_seeds` | Child | `mgr:botany_seeds` | `mgr:archaeological_sites` | `stratigraphicUnit.site` |
| `PaleoclimateSample` | `vw_paleoclimate_samples` | Child | `mgr:paleoclimate_samples` | `mgr:paleoclimate_sampling_sites` | `site` |
| `SedimentCore` | `vw_sediment_cores` | Child | `mgr:sediment_cores` | `mgr:sampling_sites` | `site` |
| `SedimentCoreDepth` | `vw_sediment_core_depths` | Child | `mgr:sediment_core_depths` | `mgr:sampling_sites` | `sedimentCore.site` |
| `HistoryAnimal` | `vw_history_animals` | Child | `mgr:history_animals` | `mgr:history_locations` | `location` |
| `HistoryPlant` | `vw_history_plants` | Child | `mgr:history_plants` | `mgr:history_locations` | `location` |

---

## Key Relationships

* **Spatial Database Migration:** [api/migrations/Version20260323152247.php](../../../api/migrations/Version20260323152247.php)
* **GeoServer Data Configuration:** [docker/geoserver/data/](../../../docker/geoserver/data/)
* **Custom Operation Metadata:** [api/src/Metadata/GetFeatureCollection.php](../../../api/src/Metadata/GetFeatureCollection.php) and [api/src/Metadata/GetAggregatedFeatureCollection.php](../../../api/src/Metadata/GetAggregatedFeatureCollection.php)
* **GeoServer State Providers:** [api/src/State/GeoserverFeatureCollectionProvider.php](../../../api/src/State/GeoserverFeatureCollectionProvider.php) and [api/src/State/GeoserverAggregatedFeatureCollectionProvider.php](../../../api/src/State/GeoserverAggregatedFeatureCollectionProvider.php)
* **Functional Test Suites:** [api/tests/Functional/Api/Resource/Geoserver/](../../../api/tests/Functional/Api/Resource/Geoserver/)
* **Backend GeoServer Architecture:** [GeoServer Integration & Spatial Architecture](../backend/geoserver.md)
* **API Platform Architecture:** [API Platform Architecture & Custom Operations](../backend/api_platform.md)
* **GeoServer Infrastructure Service:** [GeoServer Geospatial Service](../infrastructure/geoserver_service.md)
* **WebGIS Frontend Mapping:** [WebGIS Mapping & Spatial Data Layer](../frontend/webgis_mapping.md)
* **Database Lifecycle Workflow:** [Database Lifecycle & Migrations Workflow](./database_lifecycle.md)

---

## Related Nodes

* Back to [Workflows Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
