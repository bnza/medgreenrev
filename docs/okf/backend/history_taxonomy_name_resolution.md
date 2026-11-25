---
type: architecture_document
title: Historical Taxonomy Name Resolution (English Reference Model)
status: active
target_file: api/migrations/Version20261125160000.php
---

# Historical Taxonomy Name Resolution (English Reference Model)

## Architectural Role

`History\Plant.$plant` and `History\Animal.$animal` represent verbatim historical source citations (such as archaic Spanish words, Latin, Arabic, or Old Catalan). They are mandatory free-form text strings that capture historical written fidelity without being tied directly to scientific taxonomy.

Taxonomy linking is decoupled via a mandatory `english_name` column (`History\Plant.$englishName`, `History\Animal.$englishName`). It acts as a reference (soft string match without a hard foreign key constraint) to `english_name` in `vocabulary.botany_taxonomy` and `vocabulary.zoo_taxonomy`.

This architecture replaces the earlier multi-tier Spanish resolver views from `Version20261109150500.php`, simplifying the SQL view graph and preserving strict 1:1 join cardinality on the unique `english_name` column.

---

## Key Principles & Design

1. **Decoupled Historical Term and Taxonomy Reference**:
   - `plant` / `animal`: The verbatim citation from the historical source. Distinct historical terms are accessible via `/api/list/history/plant-terms` and `/api/list/history/animal-terms` for picklist autocomplete.
   - `english_name`: Standardized English common name referencing the taxonomy. Suggestions are provided via `/api/list/history/plants` and `/api/list/history/animals`.
2. **Strict 1:1 Cardinality**:
   - Because `english_name` is unique in `vocabulary.botany_taxonomy` and `vocabulary.zoo_taxonomy`, `LEFT JOIN` on `english_name` guarantees exact 1:1 cardinality in presentation views (`vw_history_plant_taxonomies`, `vw_history_animal_taxonomies`).
   - If an uncatalogued `english_name` is entered, the record persists cleanly while taxonomy attributes in the embedded `flat` view remain `NULL`.

---

## SQL View Architecture

```
history_plants / history_animals                     (data tables with plant/animal and english_name)
          │
          ├──> vw_history_plant_terms / vw_history_animal_terms       (Historical terms picklist: DISTINCT plant/animal)
          │
          ├──> vw_history_plants / vw_history_animals                 (Taxonomy English names picklist: UNION of taxonomy & data english_name)
          │
          ├──> vw_history_plant_taxonomies / vw_history_animal_taxonomies (1:1 presentation view: LEFT JOIN on english_name)
          │
          └──> geoserver.vw_history_plants / geoserver.vw_history_animals (GeoServer spatial layers)
```

- **`vw_history_plant_terms` / `vw_history_animal_terms`**: Distinct non-null historical citations for combobox autocomplete.
- **`vw_history_plants` / `vw_history_animals`**: Unique `english_name` values unioned between taxonomy tables and data tables, providing taxonomy metadata preview.
- **`vw_history_plant_taxonomies` / `vw_history_animal_taxonomies`**: Presentation views exposing taxonomy hierarchy (`value`, `species`, `genus`, `family`, `class`, `level`, `rank`).
- **`geoserver.vw_history_plants` / `geoserver.vw_history_animals`**: Spatial layers exposing verbatim name (`name`), `english_name`, and taxonomy taxon details.

---

## Migration & Rollback

- **Migration**: [Version20261125160000.php](../../../api/migrations/Version20261125160000.php) adds `english_name` in a safe 3-step operation (`ADD COLUMN ... DEFAULT NULL`, `UPDATE ... SET english_name = plant`, `ALTER COLUMN ... SET NOT NULL`), drops obsolete Spanish resolver views, and creates the new picklist/presentation views.
- **Rollback (`down()`)**: Completely drops new views and columns and restores the views from `Version20261109150500.php`.

---

## Key Relationships

* **Migration:** [api/migrations/Version20261125160000.php](../../../api/migrations/Version20261125160000.php)
* **Historical Entities:** [Historical Written Sources & Biodiversity Entities](./entities/history.md)
* **Taxonomy Vocabularies:** [Controlled Vocabularies & Hierarchical Taxonomies](./entities/vocabularies.md)
* **Testing Guidelines:** [API Testing Guidelines](../testing/api_testing.md) and [Client Testing Guidelines](../testing/client_testing.md)

---

## Related Nodes

* Back to [Backend Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
