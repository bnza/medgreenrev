---
type: architecture_document
title: GeoServer Integration & Spatial Architecture
status: active
target_file: api/src/State/AbstractGeoserverFeatureCollectionProvider.php
---

# GeoServer Integration & Spatial Architecture

## Architectural Role

MEDGREENREV combines relational archaeological and specialist data in PostgreSQL with geospatial features in PostGIS, published through GeoServer via Open Geospatial Consortium (OGC) protocols. Rather than exposing GeoServer directly to external clients or duplicating spatial data across multiple tables, the Symfony backend operates as an authenticated API Platform proxy, aggregator, and spatial query layer.

The backend GeoServer integration encompasses three interconnected tiers:
1. **Spatial Database Views (`geoserver` schema):** PostGIS views in PostgreSQL providing spatial coordinates (`the_geom`) for both root geographic sites and child specialist finds.
2. **Custom API Platform Operations:** Specialized HTTP operations (`#[GetFeatureCollection]`, `#[GetAggregatedFeatureCollection]`, `#[ExportFeatureCollection]`) exposing vector geometries and parent aggregations.
3. **GeoServer State Provider Pipeline:** Dedicated state handlers that delegate query filtering to Doctrine ORM collection extensions, retrieve matching entity IDs, and stream filtered OGC Web Feature Service (WFS) responses to the WebGIS client.

---

## Architecture Topology

```
[WebGIS Client / API Requester]
       │
       ▼ (GET /data/<resource>/features[?...])
[Symfony API Platform Layer]
       │
       ├── Custom Metadata Operations (#[GetFeatureCollection], #[GetAggregatedFeatureCollection])
       │
       ├── State Provider Pipeline (GeoserverFeatureCollectionProvider)
       │      │
       │      ├── 1. Doctrine ORM Collection Provider ──► Injects Security & Query Extensions
       │      │                                           (CurrentUserSitePrivilegeExtension, etc.)
       │      └── 2. Extract Matching Entity IDs
       │
       ▼ (WFS GetFeature + Filter XML / BBOX)
[GeoServer Service (WFS / WMS)]
       │
       ▼ (JNDI Connection Pool)
[PostgreSQL / PostGIS Database]
       └── geoserver.vw_* (Spatial Views with the_geom)
```

---

## Spatial Database Views (`geoserver` Schema)

Spatial views reside in the dedicated `geoserver` PostgreSQL schema and are managed through [api/migrations/Version20260323152247.php](../../../api/migrations/Version20260323152247.php).

### 1. DBAL Schema Filter & View Isolation

Standard Doctrine ORM migrations treat unmapped database views as extraneous and attempt to drop them. To protect spatial views:
* **Configuration:** [api/config/packages/doctrine.yaml](../../../api/config/packages/doctrine.yaml) defines:
  ```yaml
  schema_filter: '~^(?!(tiger\.|topology\.|.+\.vw_|vw_))~'
  ```
* **Isolation Rule:** Excludes PostGIS internal schemas (`tiger`, `topology`) and any table or view prefixed with `vw_` (including `geoserver.vw_*`).
* **Architectural Invariant:** Doctrine schema diffs never generate DDL for `geoserver.vw_*` views; they are maintained strictly in migration `Version20260323152247.php`.

### 2. Root vs. Child Spatial Views

The spatial views follow two design patterns based on geometry ownership:

* **Root Geographic Entities (Direct Geometry):**
  Entities that directly hold a PostGIS `geometry(Point, 4326)` column (`the_geom`).
  * `geoserver.vw_archaeological_sites`: Excavation site points with regional and chronological attributes.
  * `geoserver.vw_sampling_sites`: Off-site environmental and paleoclimate sampling points.
  * `geoserver.vw_history_locations`: Historical written source geographical coordinates.
* **Child Relational Entities (Inherited Geometry):**
  Entities that inherit spatial coordinates from a parent site or stratigraphic unit through relational joins:
  * `geoserver.vw_potteries`, `geoserver.vw_individuals`, `geoserver.vw_zoo_bones`, `geoserver.vw_botany_seeds`: Join `stratigraphic_units` and `archaeological_sites` to inherit `the_geom`, `site_id`, `site_code`, and composite `su_code` (via stored function `generate_code_su`).
  * `geoserver.vw_sediment_cores`: Joins `sampling_sites` to inherit environmental coring coordinates.

---

## Custom API Platform Operations

MEDGREENREV defines reusable PHP attributes in [api/src/Metadata/](../../../api/src/Metadata/) to declare GeoServer-backed spatial endpoints on API Platform resources:

### 1. `#[GetFeatureCollection]`
* **Path:** [api/src/Metadata/GetFeatureCollection.php](../../../api/src/Metadata/GetFeatureCollection.php)
* **Target Routes:** `/data/{resource}/features`
* **Formats:** Returns GeoJSON (`application/geo+json`) for vector mapping or JSON (`application/json`) returning an array of matched entity IDs.
* **Parameters:** Accepts bounding box parameters (`bbox=minx,miny,maxx,maxy[,CRS]`, defaulting to `EPSG:3857`).
* **State Provider:** `GeoserverFeatureCollectionProvider`.

### 2. `#[GetAggregatedFeatureCollection]`
* **Path:** [api/src/Metadata/GetAggregatedFeatureCollection.php](../../../api/src/Metadata/GetAggregatedFeatureCollection.php)
* **Target Routes:** `/data/{resource}/features/aggregated`
* **Function:** Used for child entities to aggregate finds by parent site or location, injecting a `number_matched` property on each spatial feature or returning a `{parentId: count}` mapping.
* **State Provider:** `GeoserverAggregatedFeatureCollectionProvider`.

### 3. `#[ExportFeatureCollection]`
* **Path:** [api/src/Metadata/ExportFeatureCollection.php](../../../api/src/Metadata/ExportFeatureCollection.php)
* **Target Routes:** `/data/{resource}/export`
* **Formats:** Streams vector layer exports in requested formats: `geojson`, `shapefile`, `csv`, `kml`, or `gml3`.
* **Security:** Gated by `is_granted("IS_AUTHENTICATED_FULLY")`.
* **State Provider:** `GeoserverExportProvider`.

---

## State Provider & Filter Pipeline

The spatial state providers in [api/src/State/](../../../api/src/State/) extend [AbstractGeoserverFeatureCollectionProvider](../../../api/src/State/AbstractGeoserverFeatureCollectionProvider.php):

### 1. Doctrine Integration & Security Bridging

Rather than querying GeoServer in isolation, `AbstractGeoserverFeatureCollectionProvider` delegates to the underlying Doctrine ORM collection provider:
1. **Query Filtering:** Passes operation context to `doctrineOrmCollectionProvider`, triggering all active ApiPlatform query extensions (e.g., `CurrentUserSitePrivilegeExtension`, `EditorUserSitePrivilegeExtension`).
2. **ID Extraction:** Evaluates filtered entities; if filters reduce the collection, it collects matched entity IDs.
3. **XML Filter Construction:** [GeoserverXmlWfsGetFeatureFilterBuilder](../../../api/src/Service/Geoserver/GeoserverXmlWfsGetFeatureFilterBuilder.php) converts IDs and bounding box parameters into an OGC XML `Filter` request.
4. **WFS Proxying:** Dispatches an internal HTTP request to GeoServer (`http://geoserver:8080/geoserver/wfs`) and streams back the result.

### 2. Specialized Spatial Providers

* **`GeoserverFeatureCollectionProvider`:** Fetches standard GeoJSON feature collections for root entities.
* **`GeoserverAggregatedFeatureCollectionProvider`:** Aggregates child finds by parent spatial entity ID for map clustering.
* **`GeoserverFeatureCollectionNumberMatchedProvider`:** Queries GeoServer to return the total count of features matching filter criteria.
* **`GeoserverFeatureCollectionExtentMatchedProvider`:** Uses [GeoserverXmlWpsExecuteBoundsBuilder](../../../api/src/Service/Geoserver/GeoserverXmlWpsExecuteBoundsBuilder.php) via Web Processing Service (WPS) to compute the exact bounding box envelope for matching features.
* **`GeoserverExportProvider`:** Proxies format conversion requests for shapefiles, KML, and CSV.

---

## Output DTOs & OpenAPI Documentation

### 1. Data Transfer Objects (DTOs)
* **`WfsGetFeatureCollectionNumberMatched`:** [api/src/Dto/Output/WfsGetFeatureCollectionNumberMatched.php](../../../api/src/Dto/Output/WfsGetFeatureCollectionNumberMatched.php) models feature count response payloads.
* **`WfsGetFeatureCollectionExtentMatched`:** [api/src/Dto/Output/WfsGetFeatureCollectionExtentMatched.php](../../../api/src/Dto/Output/WfsGetFeatureCollectionExtentMatched.php) models bounding box extent responses (`[minx, miny, maxx, maxy]`).

### 2. OpenAPI Schema Decorator
* **`GeoJsonDecorator`:** [api/src/OpenApi/GeoJsonDecorator.php](../../../api/src/OpenApi/GeoJsonDecorator.php) decorates OpenAPI documentation with formal schemas for `GeoJSONPoint`, `GeoJSONFeatureCollection`, and `MatchingFeaturesParentIdCounts`.

---

## GeoServer Service Integration

GeoServer connects to PostgreSQL via a direct PostGIS connection pool configured in its data workspace. The views in the `geoserver` schema are published as OGC layers:

* **WMS (Web Map Service):** Renders tiled and styled map overlays directly consumed by the OpenLayers client for high-density visualization.
* **WFS (Web Feature Service):** Exposes vector geometries and spatial filter queries (bounding box, point-in-polygon) proxied through Symfony API Platform.

---

## Key Relationships

* **Abstract State Provider:** [api/src/State/AbstractGeoserverFeatureCollectionProvider.php](../../../api/src/State/AbstractGeoserverFeatureCollectionProvider.php)
* **Metadata Operations:** [api/src/Metadata/](../../../api/src/Metadata/)
* **Spatial Views Migration:** [api/migrations/Version20260323152247.php](../../../api/migrations/Version20260323152247.php)
* **XML Filter Builder:** [api/src/Service/Geoserver/GeoserverXmlWfsGetFeatureFilterBuilder.php](../../../api/src/Service/Geoserver/GeoserverXmlWfsGetFeatureFilterBuilder.php)
* **GeoServer Operations Workflow:** [GeoServer Operations & Entity Integration Workflow](../workflows/geoserver_operations.md)
* **GeoServer Infrastructure Service:** [GeoServer Geospatial Data Service](../infrastructure/geoserver_service.md)
* **WebGIS Frontend Layer:** [WebGIS Mapping & Spatial Data Layer](../frontend/webgis_mapping.md)
* **API Platform Architecture:** [API Platform Architecture & Operations](./api_platform.md)
* **Database Architecture:** [Database Architecture & Policies](./database.md)

---

## Related Nodes

* Back to [Backend Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
