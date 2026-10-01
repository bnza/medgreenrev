---
type: architecture_document
title: API Platform Architecture & Custom Operations
status: active
target_file: api/config/packages/api_platform.yaml
---

# API Platform Architecture & Custom Operations

## Architectural Role

The API layer in MEDGREENREV is built upon Symfony 7.x and API Platform 3.x, configured in [api/config/packages/api_platform.yaml](../../../api/config/packages/api_platform.yaml). Rather than standard auto-generated CRUD, the platform implements an extensible architecture combining custom geospatial operation attributes, dedicated state provider/processor pipelines, Data Transfer Objects (DTOs), and dynamic OpenAPI schema decorators.

---

## Global Framework Configuration

Configured in `api/config/packages/api_platform.yaml`:
* **Serialization Formats:** Default format is JSON-LD / Hydra (`application/ld+json`). Patch operations use JSON Merge Patch (`application/merge-patch+json`). Geospatial endpoints dynamically support GeoJSON (`application/geo+json`) and JSON (`application/json`).
* **Resource Scanning:** Mapped across entities in `src/Entity` and virtual resources in `src/Resource`.
* **Pagination:** Standard pagination with client control (`pagination_client_items_per_page: true`).
* **Security Integration:** Integrated with Symfony Security via `api_keys.JWT` Authorization header.

---

## Custom Geospatial Operations & GeoServer Bridge

MEDGREENREV defines reusable PHP attributes in [api/src/Metadata/](../../../api/src/Metadata/) (`#[GetFeatureCollection]`, `#[GetAggregatedFeatureCollection]`, `#[ExportFeatureCollection]`) to expose GeoServer-backed spatial endpoints directly on API Platform resources. The spatial state provider pipeline (`GeoserverFeatureCollectionProvider`, `GeoserverAggregatedFeatureCollectionProvider`, `GeoserverExportProvider`) bridges Doctrine ORM query extensions with GeoServer WFS/WPS requests.

Comprehensive documentation of spatial endpoints, state providers, XML filter builders, output DTOs (`WfsGetFeatureCollectionNumberMatched`, `WfsGetFeatureCollectionExtentMatched`), and GeoJSON OpenAPI schemas is detailed in [GeoServer Integration & Spatial Architecture](./geoserver.md).

---

## State Provider & Processor Pipeline

Custom state handlers in [api/src/State/](../../../api/src/State/) mediate between API Platform operations and underlying storage/services:

### 1. Hierarchical Collection & Identity Providers
* **`SiteChildCollectionProvider`:** [api/src/State/SiteChildCollectionProvider.php](../../../api/src/State/SiteChildCollectionProvider.php) unwraps URI variables on site-nested subresource routes (e.g., `/data/archaeological_sites/{parentId}/botany/charcoals`, `/potteries`, `/zoo/bones`), allowing ORM query extensions to bind the parent site ID.
* **`CurrentUserProvider`:** [api/src/State/CurrentUserProvider.php](../../../api/src/State/CurrentUserProvider.php) retrieves the currently authenticated `User` for `/users/me`.

### 2. Entity Lifecycle Processors
* **`SitePostProcessor`:** [api/src/State/SitePostProcessor.php](../../../api/src/State/SitePostProcessor.php)
  * Assigns authenticated creator on `POST /data/archaeological_sites`.
  * Persists the site and automatically creates a `SiteUserPrivilege` record granting `PRIVILEGE_EDITOR` (level 2) to the creating user.
* **`AnalysisPostProcessor`:** [api/src/State/AnalysisPostProcessor.php](../../../api/src/State/AnalysisPostProcessor.php)
  * Automatically binds `$createdBy` to the authenticated analyst on `POST /data/analyses`.
* **`MediaObjectPostProcessor`:** [api/src/State/MediaObjectPostProcessor.php](../../../api/src/State/MediaObjectPostProcessor.php)
  * Sets upload timestamp (`uploadDate`) and assigns `$uploadedBy` on newly uploaded media files.
* **`UserPasswordHasherProcessor` & `UserPasswordChangeProcessor`:**
  * Hashes plain-text passwords upon user creation.
  * Validates current passwords and rotates password hashes upon `/change_password` requests.

### 3. Spatial State Providers
* **`AbstractGeoserverFeatureCollectionProvider` Subclasses:** Delegated to the GeoServer state provider pipeline (`GeoserverFeatureCollectionProvider`, `GeoserverAggregatedFeatureCollectionProvider`, `GeoserverExportProvider`). Documented in [GeoServer Integration & Spatial Architecture](./geoserver.md).

---

## DTO Pipeline & Serialization Groups

### 1. Data Transfer Objects (DTOs)
* **`UserPasswordChangeInputDto`:** [api/src/Dto/Input/UserPasswordChangeInputDto.php](../../../api/src/Dto/Input/UserPasswordChangeInputDto.php) encapsulates old and new passwords during credential changes.
* **Spatial Output DTOs:** `WfsGetFeatureCollectionNumberMatched` and `WfsGetFeatureCollectionExtentMatched` represent feature count and bounding box envelope responses, documented in [GeoServer Integration & Spatial Architecture](./geoserver.md).

### 2. Normalizers & Access Control Metadata
* **`AccessControlledResourceItemNormalizer` & `AccessControlledResourceCollectionNormalizer`:**
  * Injects a dynamic `_acl` object (`canRead`, `canUpdate`, `canDelete`) into read representations based on user permissions.
* **`MediaObjectNormalizer`:** Computes public storage URLs and thumbnail paths for media assets.

### 3. OpenAPI Schema Decorators
* **`AclItemDecorator`:** [api/src/OpenApi/AclItemDecorator.php](../../../api/src/OpenApi/AclItemDecorator.php) automatically adds `_acl` metadata definitions to all schemas matching `*.acl.read`.
* **`GeoJsonDecorator`:** [api/src/OpenApi/GeoJsonDecorator.php](../../../api/src/OpenApi/GeoJsonDecorator.php) decorates OpenAPI documentation with formal GeoJSON schemas, documented in [GeoServer Integration & Spatial Architecture](./geoserver.md).

---

## Key Relationships

* **API Platform Configuration:** [api/config/packages/api_platform.yaml](../../../api/config/packages/api_platform.yaml)
* **Metadata Directory:** [api/src/Metadata/](../../../api/src/Metadata/)
* **State Directory:** [api/src/State/](../../../api/src/State/)
* **Doctrine Query Extensions:** [Doctrine ORM Query Extensions & Security Filtering](./query_extensions_filtering.md)
* **GeoServer Integration Architecture:** [GeoServer Integration & Spatial Architecture](./geoserver.md)
* **Authorization Specification:** [Authorization & Security Model](./authorization.md)
* **Domain Entities Subsystem:** [Domain Entity Modeling Subsystem](./entities/index.md)

---

## Related Nodes

* Back to [Backend Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
