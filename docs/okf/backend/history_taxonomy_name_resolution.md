---
type: architecture_document
title: Historical Taxonomy Name Resolution (Spanish/English)
status: active
target_file: api/migrations/Version20261109150500.php
---

# Historical Taxonomy Name Resolution (Spanish/English)

## Architectural Role

`History\Plant.$plant` and `History\Animal.$animal` are, and remain, free-text columns on `data.history_plants`/`data.history_animals` — curators type whatever common name appears in the historical source, in whichever language it was written (Latin, Spanish, English common names, etc.). No foreign key to `Vocabulary\Botany\Taxonomy`/`Vocabulary\Zoo\Taxonomy` is stored alongside this text.

To still let the API resolve that free text against the controlled taxonomy vocabularies — for display, filtering, and autocomplete — a set of PostgreSQL views matches the stored string against `vocabulary.botany_taxonomy`/`vocabulary.zoo_taxonomy` by **either** their `english_name` or `spanish_name` column, with a deterministic fallback rule when a Spanish common name is shared by several taxa. **This is purely a read-side (view) concern: no table, column, or stored row in `history_plants`, `history_animals`, `botany_taxonomy`, or `zoo_taxonomy` is altered by this mechanism — the underlying data is kept exactly as entered.** Only the SQL views layered on top of that data were introduced/changed, in migration [Version20261109150500.php](../../../api/migrations/Version20261109150500.php).

---

## Why Spanish Common Names Needed Their Own Resolution Logic

* **`english_name` is unique** (DB-level `UNIQUE` constraint on both `botany_taxonomy` and `zoo_taxonomy`), so a plain `= ` join against it is always 1:1 and was the only join key used before this change.
* **`spanish_name` has no such constraint**, and real taxonomy data confirms multiple species legitimately share the same Spanish common name (e.g. *"Verónica"* names three distinct `Veronica` species). Joining on it directly would fan a single `history_plants` row out into several view rows, breaking the `OneToOne` relation that `HistoryPlantView`/`HistoryAnimalView` depend on.
* The adopted rule: **try the unique `english_name` first; if that misses, try `spanish_name`.** When `spanish_name` matches exactly one taxon, resolve to that species. When it matches several, climb the taxonomic hierarchy — genus → family → class for plants (using `botany_taxonomy`'s real parent/child tree), family → class for animals (since `zoo_taxonomy` is a flat table with no genus level) — and stop at the first rank every candidate agrees on. If candidates disagree even at `class`, the match is left `NULL`, identical to today's "no match" behavior rather than guessing.

---

## View Layering (Database-Only Change)

```
vocabulary.botany_taxonomy / vocabulary.zoo_taxonomy      (unchanged tables, unchanged rows)
          │
          ▼
vocabulary.vw_{botany,zoo}_taxonomy_name_lookup            (new) UNION ALL of:
          │                                                  - english_branch: 1 row per taxon with english_name
          │                                                  - spanish_branch: GROUP BY spanish_name, resolved to
          │                                                    species / genus / family / class
          ▼
vocabulary.vw_{botany,zoo}_taxonomy_spanish_resolution      (new) DISTINCT ON (value), prefers the
          │                                                  english branch — guarantees `value` is globally
          │                                                  unique so a 1:1 join stays possible
          ▼
vw_history_plant_taxonomies / vw_history_animal_taxonomies  (renamed from vw_history_plant/vw_history_animal)
          │                                                  single LEFT JOIN ... ON r.value = hp.plant
          ▼
vw_history_plants / vw_history_animals                      (picklist) reads (value, language) rows straight
                                                              from the *_name_lookup views, plus a free-text
                                                              branch for data values with no taxonomy match
```

* **`vocabulary.vw_{botany,zoo}_taxonomy_name_lookup`** — the raw, non-deduplicated union of the `english_name` and `spanish_name` branches, each tagged with a `language` column (`'english'`/`'spanish'`) and carrying the resolved taxon's own `matched_english_name`/`matched_spanish_name`. Feeds the picklist, since a single plant/animal mention can legitimately surface two distinct suggestions (one per language).
* **`vocabulary.vw_{botany,zoo}_taxonomy_spanish_resolution`** — built on top via `DISTINCT ON (value) ... ORDER BY value, (language = 'english') DESC`, guaranteeing one row per text value across both languages. Feeds the singular `vw_history_plant_taxonomies`/`vw_history_animal_taxonomies` join, which needs `value` to stay unique for the `OneToOne` Doctrine mapping to hold. These two resolver views are **internal-only** — they are not exposed through any API endpoint, since the history views already surface everything a UI consumer needs.
* **`vw_history_plant_taxonomies` / `vw_history_animal_taxonomies`** — the renamed 1:1 presentation views (`vw_history_plant`/`vw_history_animal` previously), now exposing `level`, `language`, `matched_english_name`, `matched_spanish_name` from a single join to the resolution view instead of a bare `english_name` equality.
* **`vw_history_plants` / `vw_history_animals`** — the picklist/autocomplete views, extended with the same four columns and a `NOT EXISTS` guard so a free-text value already resolved via the taxonomy lookup does not also appear as a second, bare, taxonomy-less duplicate row.
* **`geoserver.vw_history_plants` / `geoserver.vw_history_animals`** — redefined only to point their `LEFT JOIN` at the renamed `vw_history_plant_taxonomies`/`vw_history_animal_taxonomies`; their own output column shape is unchanged.

---

## Data Is Untouched — Only the View Graph Changed

* No `ALTER TABLE`, `UPDATE`, or `INSERT` statement exists anywhere in `Version20261109150500.php` — every statement is a `CREATE [OR REPLACE] VIEW` or `DROP VIEW`.
* `history_plants.plant` / `history_animals.animal` remain plain free text; no FK column was added.
* `botany_taxonomy` / `zoo_taxonomy` schemas and their `english_name`/`spanish_name`/`class`/`family` columns are untouched.
* Because the API had already shipped as version `1.0.0` when this change was designed, it ships as a **new, additive migration** rather than an edit to the already-applied `Version20250628091340.php` — consistent with the production migration policy in [Database Architecture & Migration Policies](./database.md). The migration's `down()` fully restores the pre-change view graph (including the original `vw_history_plant`/`vw_history_animal` names and their plain `english_name` join), so a rollback leaves the schema — and the data inside it — exactly as before, without ever dropping a row.

---

## Key Relationships

* **Migration:** [api/migrations/Version20261109150500.php](../../../api/migrations/Version20261109150500.php)
* **Historical Entities:** [Historical Written Sources & Biodiversity Entities](./entities/history.md)
* **Taxonomy Vocabularies:** [Controlled Vocabularies & Hierarchical Taxonomies](./entities/vocabularies.md)
* **Data Import Workflow:** [Data Import & Bulk Ingestion Workflow](../workflows/data_import.md)
* **Database & Migration Policy:** [Database Architecture & Migration Policies](./database.md)
* **GeoServer Integration:** [GeoServer Integration & Spatial Architecture](./geoserver.md)
* **Picklist UI Component:** [client/app/components/data/selection/DataSelectionListHistoryTaxonomy.vue](../../../client/app/components/data/selection/DataSelectionListHistoryTaxonomy.vue)

---

## Related Nodes

* Back to [Backend Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
