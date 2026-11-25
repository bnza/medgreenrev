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
  * Links `$location`, chronological `$chronologyLower`/`$chronologyUpper`, source manuscript `$language`, and textual `$reference`.
  * `$plant` represents the exact verbatim term in the source manuscript (free text, supported by picklist `/api/list/history/plant-terms`).
  * `$englishName` is a mandatory string attribute serving as a reference key for 1:1 join matching against botanical taxonomy (`Vocabulary\Botany\Taxonomy`).
  * Read-only presentation models: `HistoryPlantView` (singular, `vw_history_plant_taxonomies`) and the picklist `List\HistoryPlantView` (`vw_history_plants`).
* **`History\Animal`:** [api/src/Entity/Data/History/Animal.php](../../../../api/src/Entity/Data/History/Animal.php)
  * Records historical textual references to livestock, beasts of burden, hunting, or wild animals.
  * Links `$location`, chronological `$chronologyLower`/`$chronologyUpper`, source manuscript `$language`, and textual `$reference`.
  * `$animal` represents the exact verbatim term in the source manuscript (free text, supported by picklist `/api/list/history/animal-terms`).
  * `$englishName` is a mandatory string attribute serving as a reference key for 1:1 join matching against faunal taxonomy (`Vocabulary\Zoo\Taxonomy`).
  * Read-only presentation models: `HistoryAnimalView` (singular, `vw_history_animal_taxonomies`) and the picklist `List\HistoryAnimalView` (`vw_history_animals`).

---

## Spatial Publishing Integration

Locations associated with written sources and historical taxa are georeferenced via `Vocabulary\History\Location`. Through migration [Version20260323152247.php](../../../../api/migrations/Version20260323152247.php), the PostgreSQL view `geoserver.vw_history_locations` combines text metadata with PostGIS point geometry, exposing historical evidence as vector map layers in GeoServer.

---

## English Name Taxonomy Resolution

Historical citations are decoupled from modern biological classification: `History\Plant.$plant` and `History\Animal.$animal` preserve the verbatim historical source wording, while `History\Plant.$englishName` and `History\Animal.$englishName` hold the English reference name. Views (`vw_history_plant_taxonomies` and `vw_history_animal_taxonomies`) match `english_name` with unique taxonomy entries via direct 1:1 `LEFT JOIN`, added in migration [Version20261125160000.php](../../../../api/migrations/Version20261125160000.php). See [Historical Taxonomy Name Resolution](../history_taxonomy_name_resolution.md) for the full architectural rationale and view structure.

---

## Key Relationships

* **Entity Directory:** [api/src/Entity/Data/History/](../../../../api/src/Entity/Data/History/)
* **Vocabulary Entities:** [Controlled Vocabularies & Lookups](./vocabularies.md)
* **Data Import Framework:** [Data Import Framework & Domain Processors](../data_import_framework.md)
* **Bulk Ingestion Workflow:** [Data Import & Bulk Ingestion Workflow](../../workflows/data_import.md)
* **GeoServer Integration:** [GeoServer Integration & Spatial Architecture](../geoserver.md)
* **Foreign Key Policies:** [Foreign Key Deletion & Referential Integrity Policies](../foreign_key_policies.md)
* **Taxonomy Name Resolution:** [Historical Taxonomy Name Resolution (Spanish/English)](../history_taxonomy_name_resolution.md)

---

## Related Nodes

* Back to [Domain Entities Subsystem](./index.md)
* Back to [Backend Hub](../index.md)
* Back to [Main Knowledge Graph Index](../../index.md)
