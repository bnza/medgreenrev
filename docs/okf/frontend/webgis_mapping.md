---
type: frontend_architecture
title: WebGIS Mapping & Spatial Data Layer
status: active
target_file: client/app/components/map/
---

# WebGIS Mapping & Spatial Data Layer

## Architectural Role

The WebGIS mapping subsystem provides an interactive geospatial workspace for exploring archaeological excavations, environmental sampling stations, historical written locations, and specialist find distributions across the Mediterranean basin. Built with Vue 3 OpenLayers (`vue3-openlayers` and `ol`), it renders multi-layer vector data, manages coordinate reference transformations between Web Mercator (EPSG:3857) and WGS84 (EPSG:4326), and coordinates dynamic spatial count aggregation.

---

## WebGIS Component Architecture

The mapping hierarchy is divided into viewport containers, base tile providers, vector API layers, and contextual popups:

```
[AppMap.vue] (<ol-map>, <ol-view> in EPSG:3857)
   │
   ├── [Base Tile Layer]
   │     └── MapLayerTileBaseMap.vue ──► OSM / ESRI Satellite / ESRI Topo
   │
   ├── [Vector API Layer Pipeline] (client/app/components/map/layer/vector/api/)
   │     └── MapLayerVectorApiBase.vue (Generic API vector layer)
   │           ├── Domain Layer Wrappers (ArchaeologicalSite, BotanySeed, ZooBone, ...)
   │           ├── MapSourceApiVector.vue (BBOX strategy via useGetFeatureCollectionQuery)
   │           └── MapInteractionSelectLayerVectorApi.vue (Feature selection interaction)
   │
   └── [Contextual Overlays] (client/app/components/map/overlay/)
         ├── MapOverlaySelectedFeatureDataCard.vue (Standard entity card)
         └── MapOverlaySelectedAggregatedFeatureDataCard.vue (Aggregated parent find summary)
```

### 1. Root Map Viewport (`AppMap.vue`)
Located at [client/app/components/AppMap.vue](../../../client/app/components/AppMap.vue), the root map component encapsulates:
* **Projection Management:** Manages the OpenLayers view in Web Mercator (`EPSG:3857`) for smooth tile rendering, while handling coordinates and GeoJSON geometries exchanged with the backend in WGS84 (`EPSG:4326`).
* **Viewport Synchronization:** Integrates with `useMapStore.ts` to sync viewport state (center coordinates, zoom level, current resolution, and visible bounding box extent).

### 2. Base Tile Switching (`MapLayerTileBaseMap.vue`)
* Located under `client/app/components/map/layer/tile/`.
* Governed by `useMapBaseMapStore.ts`.
* Provides dynamic base map switching between:
  * OpenStreetMap (`MapLayerTileBaseMapOsm.vue`): Default street and geographic context.
  * ESRI World Imagery (`MapLayerTileBaseMapEsri.vue` with `type: 'satellite'`): High-resolution satellite aerial imagery.
  * ESRI Topographic (`MapLayerTileBaseMapEsri.vue` with `type: 'topo'`): Elevation contours and physical terrain relief.

### 3. Vector API Layers (`client/app/components/map/layer/vector/api/`)
* **`MapLayerVectorApiBase.vue`:** The foundational vector layer component. Binds to `useMapVectorApiStore` and `useMapVectorApiStyleStore` to manage layer opacity, visibility, decluttering, dynamic styling, and contextual popups.
* **Domain Layer Wrappers:** 18+ specialized components (such as `MapLayerVectorApiArchaeologicalSite.vue`, `MapLayerVectorApiBotanySeed.vue`, `MapLayerVectorApiPottery.vue`, `MapLayerVectorApiZooTooth.vue`) wrap `MapLayerVectorApiBase.vue` with domain-specific endpoint paths, label properties, and theme palette colors.

---

## BBOX Loading Strategy (`MapSourceApiVector.vue`)

Spatial feature retrieval is optimized for viewport performance using OpenLayers' bounding box (`bbox`) loading strategy:

1. **Extent Interception:** [client/app/components/map/source/api/MapSourceApiVector.vue](../../../client/app/components/map/source/api/MapSourceApiVector.vue) attaches an OpenLayers vector source with `strategy: bbox`.
2. **Query Triggering:** As the user pans or zooms, OpenLayers calculates the current visible bounding box `[minX, minY, maxX, maxY]` in EPSG:3857 and converts it to EPSG:4326.
3. **Colada Query Execution:** Triggers `useGetFeatureCollectionQuery(path, { bbox })`. The query incorporates any active search filters defined in `useCollectionQueryStore`, ensuring spatial features match tabular filter criteria.
4. **GeoJSON Parsing:** Features are deserialized using `ol/format/GeoJSON` with `dataProjection: 'EPSG:4326'` and `featureProjection: 'EPSG:3857'` and loaded into the vector source without page reloads.

---

## Dynamic Feature Count Aggregation Mode

The WebGIS subsystem natively consumes backend spatial aggregation operations (`#[GetAggregatedFeatureCollection]` documented in [GeoServer Integration & Spatial Architecture](../backend/geoserver.md)). In this mode, individual find occurrences (e.g., thousands of ceramic sherds or botanical seeds) are dynamically aggregated into their parent excavation site or stratigraphic context markers.

### GeoJSON API Contract
Aggregated endpoints return a GeoJSON `FeatureCollection` where each feature's `properties` payload includes a dynamic integer count:
```json
{
  "type": "Feature",
  "id": "/api/data/archaeological_sites/14",
  "geometry": { "type": "Point", "coordinates": [24.12, 35.31] },
  "properties": {
    "name": "Knossos",
    "number_matched": 487
  }
}
```

### Standard vs Aggregated Rendering Specifications

| Feature | Standard Feature Mode (`showNumberMatched: false`) | Aggregated Mode (`showNumberMatched: true`) |
|:---|:---|:---|
| **Marker Radius** | `radius: 5px` (`storedMarkerOptions.value.radius`) | Enlarged to `radius: 12px` (`effectiveRadius = 12`) |
| **Center Count Badge** | None | Centered text badge displaying `number_matched` (`textAlign: 'center'`, `textBaseline: 'middle'`, `offsetX: 0, offsetY: 0`) |
| **Entity Name Label** | Offset label (`offsetX: 10, offsetY: -10`, `textAlign: 'left'`, `textBaseline: 'bottom'`) | Preserved alongside count badge (dual-label rendering) |
| **Decluttering** | Enabled (`declutter: true`) to avoid text overlap | **Explicitly disabled** (`setDeclutter(false)`) via watcher to guarantee count badge visibility |
| **Contextual Popup** | `MapOverlaySelectedFeatureDataCard.vue` (direct entity attributes) | `MapOverlaySelectedAggregatedFeatureDataCard.vue` (parent entity summary + child find counts) |

### Declutter Toggling Invariant
OpenLayers decluttering algorithms can hide text labels if neighboring features or markers overlap. For aggregated layers, hiding the count label inside the marker circle would leave an unexplained large circle. Therefore, `MapLayerVectorApiBase.vue` enforces declutter disabling:

```typescript
watch(showNumberMatched, (newValue) => {
  const layer = layerRef.value?.vectorLayer
  if (layer && typeof layer.setDeclutter === 'function') {
    layer.setDeclutter(!newValue)
    layer.changed()
  }
})
```

---

## Layer Exclusivity Architecture (`useMapLayerExclusiveVisibilityStore.ts`)

To prevent overlapping markers and visual ambiguity when analyzing correlated datasets, layer visibility is partitioned into mutually exclusive thematic groups in [client/app/stores/useMapLayerExclusiveVisibilityStore.ts](../../../client/app/stores/useMapLayerExclusiveVisibilityStore.ts):

### Primary Aggregation Resource Groups (`FeatureAggregationResourceKey`)
1. **`archaeologicalSite`** (`/api/features/archaeological_sites`): Root excavation sites and all child specialist finds (pottery, seeds, charcoal, zooarchaeology, individuals).
2. **`vocHistoryLocation`** (`/api/features/history/locations`): Historical settlements, texts, and historical plant/animal occurrences.
3. **`samplingSite`** (`/api/features/sampling_sites`): Environmental coring stations and microstratigraphy.
4. **`paleoclimateSamplingSite`** (`/api/features/paleoclimate_sampling_sites`): Paleoclimate isotope samples and proxy records.

### Mutual Exclusivity Rules
* Each group maintains exactly **one active layer** at a time: `activeLayers: Map<FeatureAggregationResourceKey, GetFeatureCollectionPath | null>`.
* Invoking `setActive(groupKey, layerPath)` toggles the selected layer. If another layer within the same group was active (e.g. switching from root *Archaeological Sites* to *Site Botany Seeds*), the previous layer is automatically deactivated.
* Cross-group layers remain orthogonal: an archaeological site layer and a paleoclimate sampling site layer can be displayed concurrently.

---

## Vector Styling Engine (`useMapVectorApiStyleStore.ts`)

Vector feature styling is computed dynamically at runtime using OpenLayers style functions:

* **Text Label Factories (`client/app/utils/map.ts`):** `makeTextLabelStyleFn` generates high-resolution typography (`Montserrat`, scalable stroke/fill) with dual-label rendering support for standard names and centered aggregation badges.
* **Dynamic Style Composition (`overrideStyleFunction`):** Clones the base circle marker style (`OlStyleCircle`) and merges text label styles into a combined `Style[]` array passed to the OpenLayers rendering pipeline.
* **Theme Palettes:** Marker fills and strokes resolve against the system color palette in [client/app/utils/consts/colors.ts](../../../client/app/utils/consts/colors.ts), ensuring consistent visual identity between table status chips and map pins.

---

## Key Relationships

* **Map Root Component:** [client/app/components/AppMap.vue](../../../client/app/components/AppMap.vue)
* **Vector Base Layer:** [client/app/components/map/layer/vector/api/MapLayerVectorApiBase.vue](../../../client/app/components/map/layer/vector/api/MapLayerVectorApiBase.vue)
* **Layer Exclusivity Store:** [client/app/stores/useMapLayerExclusiveVisibilityStore.ts](../../../client/app/stores/useMapLayerExclusiveVisibilityStore.ts)
* **Map Vector Style Store:** [client/app/stores/useMapVectorApiStyleStore.ts](../../../client/app/stores/useMapVectorApiStyleStore.ts)
* **Map Utilities & Style Factory:** [client/app/utils/map.ts](../../../client/app/utils/map.ts)
* **Backend GeoServer Specification:** [GeoServer Integration & Spatial Architecture](../backend/geoserver.md)
* **State Data Layer Specification:** [State Management & Data Layer Architecture](./state_data_layer.md)

---

## Related Nodes

* Back to [Frontend Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
