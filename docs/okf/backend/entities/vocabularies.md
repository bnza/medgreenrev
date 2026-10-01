---
type: architecture_document
title: Controlled Vocabularies & Hierarchical Taxonomies
status: active
target_file: api/src/Entity/Vocabulary/
---

# Controlled Vocabularies & Hierarchical Taxonomies

## Architectural Role

Standardization of scientific terminology, biological classifications, ceramic typologies, and chronological epochs is enforced through the `App\Entity\Vocabulary` namespace in [api/src/Entity/Vocabulary/](../../../../api/src/Entity/Vocabulary/). Mapped to the PostgreSQL `vocabulary` schema, these entities serve as immutable dictionary lookups across all research subdomains.

To safeguard historical data integrity, all foreign keys from `data` entities referencing `vocabulary` records mandate `ON DELETE RESTRICT`.

---

## Controlled Taxonomies & Dictionaries

### 1. Biological Taxonomies (Archaeobotany & Zooarchaeology)

* **Botanical Taxonomy:**
  * **Entity:** `Vocabulary\Botany\Taxonomy` ([api/src/Entity/Vocabulary/Botany/Taxonomy.php](../../../../api/src/Entity/Vocabulary/Botany/Taxonomy.php))
  * **Hierarchy:** Linnaean taxonomic ranks (kingdom $\rightarrow$ division $\rightarrow$ class $\rightarrow$ order $\rightarrow$ family $\rightarrow$ genus $\rightarrow$ species).
  * **Self-Referential Tree:** Linked via parent-child relations. High-level traversal is optimized by the database view `vocabulary.vw_botany_taxonomy`.
  * **Plant Anatomy:** Complemented by `Vocabulary\Botany\Element` (seed, fruit, culm, wood) and `Vocabulary\Botany\ElementPart` (apex, base, embryo).
* **Faunal Taxonomy:**
  * **Entity:** `Vocabulary\Zoo\Taxonomy` ([api/src/Entity/Vocabulary/Zoo/Taxonomy.php](../../../../api/src/Entity/Vocabulary/Zoo/Taxonomy.php))
  * **Hierarchy:** Animal ranks (class $\rightarrow$ order $\rightarrow$ family $\rightarrow$ genus $\rightarrow$ species). Mapped to `vocabulary.vw_zoo_taxonomy`.
  * **Skeletal Anatomy:** Complemented by `Vocabulary\Zoo\Bone` (femur, tibia, mandible, scapula), `BoneSide` (left, right, axial), `BonePart` (diaphysis, epiphysis), and `BoneEndPreserved` (distal, proximal, complete).

### 2. Ceramic Typology (`App\Entity\Vocabulary\Pottery`)

* **`Shape`:** Vessel shape classification (e.g., bowl, amphora, cooking pot, jug).
* **`FunctionalGroup` & `FunctionalForm`:** Utilitarian categorization (storage, food preparation, transport, tableware).
* **`SurfaceTreatment`:** Finishing techniques (burnished, slipped, glazed, coarse).
* **`Decoration`:** Decorative techniques (impressed, incised, painted, excinded) attached via `PotteryDecoration`.

### 3. Physical Anthropology (`App\Entity\Vocabulary\Individual`)

* **`Sex`:** Biological sex estimates (male, female, undetermined).
* **`Age`:** Anthropological age stages (infant, juvenile, subadult, adult, mature, senile).

### 4. Stratigraphic Topology (`App\Entity\Vocabulary\StratigraphicUnit`)

* **`Relation`:** Stratigraphic sequence topological relations for Harris matrix calculation (*cuts*, *is cut by*, *covers*, *is covered by*, *fills*, *is filled by*, *contemporary with*).

### 5. Scientific Analyses & Methodologies (`App\Entity\Vocabulary\Analysis`)

* **`Type`:** Analytical laboratory techniques:
  * Absolute dating: `C14` (Radiocarbon), `THL` (Thermoluminescence), `OSL` (Optically Stimulated Luminescence).
  * Microscopy & Imaging: `SEM` (Scanning Electron Microscopy), `OPT` (Optical Microscopy).
  * Material & Isotopic: `XRF` (X-ray Fluorescence), `XRD` (X-ray Diffraction), `ISO` (Stable Isotopes), `ORA` (Organic Residue Analysis), `ADNA` (Ancient DNA).
  * Assemblages: `SDNA`, `POL` (Pollen), `PHY` (Phytoliths), `CARP` (Carpology), `ANTX` (Anthracology), `ZOO` (Faunal Assemblage), `ANTH` (Anthropology).
* **Database Check Invariant:**
  * Migration `Version20250627142200.php` enforces `chk_analysis_types_absdating_id_range`: all absolute dating types must have IDs within `100..199`.

### 6. Shared Spatio-Temporal Dictionaries

* **`Region`:** [api/src/Entity/Vocabulary/Region.php](../../../../api/src/Entity/Vocabulary/Region.php) defines geographical study territories across the Mediterranean.
* **`Century`:** [api/src/Entity/Vocabulary/Century.php](../../../../api/src/Entity/Vocabulary/Century.php) represents chronological centuries from antiquity through the modern era ($-8$ to $+20$).
* **`CulturalContext`:** [api/src/Entity/Vocabulary/CulturalContext.php](../../../../api/src/Entity/Vocabulary/CulturalContext.php) defines chronological-cultural horizons (e.g., Bronze Age, Roman Imperial, Byzantine, Islamic, Medieval).

---

## Deletion Protection Policy

All foreign keys referencing entities in the `vocabulary` schema are configured with `onDelete: 'RESTRICT'`:
```php
#[ORM\JoinColumn(name: 'taxonomy_id', referencedColumnName: 'id', nullable: false, onDelete: 'RESTRICT')]
```
This ensures vocabulary dictionary terms and taxonomic definitions cannot be accidentally deleted while referenced by active archaeological observations, specialist finds, or historical texts.

---

## Key Relationships

* **Entity Directory:** [api/src/Entity/Vocabulary/](../../../../api/src/Entity/Vocabulary/)
* **Foreign Key Policies:** [Foreign Key Deletion & Referential Integrity Policies](../foreign_key_policies.md)
* **Specialist Analyses:** [Specialist Analyses & Archaeological Subjects](./specialist_analyses.md)
* **Stratigraphy & Sites:** [Stratigraphy & Spatial Sites Entities](./stratigraphy_sites.md)
* **Historical Sources:** [Historical Written Sources & Biodiversity Entities](./history.md)

---

## Related Nodes

* Back to [Domain Entities Subsystem](./index.md)
* Back to [Backend Hub](../index.md)
* Back to [Main Knowledge Graph Index](../../index.md)
