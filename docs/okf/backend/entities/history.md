---
type: architecture_document
title: Historical Written Sources & Biodiversity Entities
status: active
target_file: api/src/Entity/Data/History/
---

# Historical Written Sources & Biodiversity Entities

## Architectural Role

The historical subsystem in MEDGREENREV models historical written texts, modern bibliographic citations, and textual references to plant cultivation and animal husbandry across the Mediterranean. Defined in [api/src/Entity/Data/History/](../../../../api/src/Entity/Data/History/) and [api/src/Entity/Vocabulary/History/](../../../../api/src/Entity/Vocabulary/History/), these entities provide textual historical evidence complementing physical archaeological finds.

---

## Entity Models & Relational Architecture

```
[WrittenSource] (Primary Text)
   ├── WrittenSourceCitedWork ──► Vocabulary\History\CitedWork (Modern Critical Edition)
   ├── WrittenSourceCentury   ──► Vocabulary\Century
   ├── WrittenSourceRegion    ──► Vocabulary\Region
   ├── Vocabulary\History\Location (Georeferenced Provenance Point)
   │
   ├── History\Plant  ──► Mentions of crops/plants, century, location, Botany\Taxonomy
   └── History\Animal ──► Mentions of livestock/wild fauna, century, location, Zoo\Taxonomy
```

### 1. `History\WrittenSource`
* **Path:** [api/src/Entity/Data/History/WrittenSource.php](../../../../api/src/Entity/Data/History/WrittenSource.php)
* **Table:** `data.history_written_sources`
* **Core Attributes:**
  * `$code`: Unique source identifier.
  * `$title`: Title or standard manuscript designation.
  * `$author`: References `Vocabulary\History\Author` (e.g., Pliny the Elder, Columella, Ibn al-'Awwam).
  * `$language`: References `Vocabulary\History\Language` (Latin, Greek, Classical Arabic, etc.).
  * `$writtenSourceType`: References `Vocabulary\History\WrittenSourceType` (agricultural treatise, legal code, geographical chronicle).
  * `$location`: Geographic provenance point referencing `Vocabulary\History\Location`.
* **Chronological & Regional Scopes:**
  * Linked to multiple centuries via `WrittenSourceCentury`.
  * Linked to historical regions via `WrittenSourceRegion`.

### 2. `History\WrittenSourceCitedWork`
* **Path:** [api/src/Entity/Data/History/WrittenSourceCitedWork.php](../../../../api/src/Entity/Data/History/WrittenSourceCitedWork.php)
* **Table:** `data.history_written_sources_cited_works`
* **Core Responsibilities:**
  * Junction entity linking a primary historical text (`WrittenSource`) to a modern critical edition or scholarly citation (`Vocabulary\History\CitedWork`).
  * Enables tracking modern bibliographic sources, page numbers, and translation credits.

### 3. Historical Biodiversity Observations: `Plant` & `Animal`

* **`History\Plant`:** [api/src/Entity/Data/History/Plant.php](../../../../api/src/Entity/Data/History/Plant.php)
  * Records specific mentions of cultivated crops, wild plants, or agricultural practices extracted from historical texts.
  * Links `$writtenSource`, chronological `$century`, geographic `$location`, and botanical taxonomy (`Vocabulary\Botany\Taxonomy`).
  * Read-only presentation model: `HistoryPlantView` (`vw_history_plants`).
* **`History\Animal`:** [api/src/Entity/Data/History/Animal.php](../../../../api/src/Entity/Data/History/Animal.php)
  * Records historical textual references to livestock, beasts of burden, hunting, or wild animals.
  * Links `$writtenSource`, `$century`, `$location`, and faunal taxonomy (`Vocabulary\Zoo\Taxonomy`).
  * Read-only presentation model: `HistoryAnimalView` (`vw_history_animals`).

---

## Spatial Publishing Integration

Locations associated with written sources and historical taxa are georeferenced via `Vocabulary\History\Location`. Through migration [Version20260323152247.php](../../../../api/migrations/Version20260323152247.php), the PostgreSQL view `geoserver.vw_history_locations` combines text metadata with PostGIS point geometry, exposing historical evidence as vector map layers in GeoServer.

---

## Key Relationships

* **Entity Directory:** [api/src/Entity/Data/History/](../../../../api/src/Entity/Data/History/)
* **Vocabulary Entities:** [Controlled Vocabularies & Lookups](./vocabularies.md)
* **GeoServer Integration:** [GeoServer Integration & Spatial Architecture](../geoserver.md)
* **Foreign Key Policies:** [Foreign Key Deletion & Referential Integrity Policies](../foreign_key_policies.md)

---

## Related Nodes

* Back to [Domain Entities Subsystem](./index.md)
* Back to [Backend Hub](../index.md)
* Back to [Main Knowledge Graph Index](../../index.md)
