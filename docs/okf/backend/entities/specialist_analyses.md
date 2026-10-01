---
type: architecture_document
title: Specialist Analyses & Archaeological Subjects
status: active
target_file: api/src/Entity/Data/Analysis.php
---

# Specialist Analyses & Archaeological Subjects

## Architectural Role

The specialist analysis subsystem in MEDGREENREV models multi-disciplinary laboratory and archaeological find data: archaeobotany (seeds and charcoal), zooarchaeology (faunal bones and teeth), ceramic analysis (pottery), physical anthropology (human individuals), and paleoclimate proxies. Defined across [api/src/Entity/Data/](../../../../api/src/Entity/Data/) and [api/src/Entity/Data/Join/Analysis/](../../../../api/src/Entity/Data/Join/Analysis/), this architecture decouples the laboratory analysis event (`Analysis`) from the physical specimens via explicit, validated join entities.

---

## The Laboratory `Analysis` Entity

* **Path:** [api/src/Entity/Data/Analysis.php](../../../../api/src/Entity/Data/Analysis.php)
* **Table:** `data.analyses`
* **Core Responsibilities:**
  * Represents an abstract scientific analysis event (e.g., radiocarbon dating, stable isotope measurement, SEM microscopy, XRF elemental spectrometry).
  * `$type`: References `Vocabulary\Analysis\Type` (`code`, `group`).
  * `$year`: Year analysis was performed.
  * `$laboratory`: Laboratory or analytical facility.
  * `$responsible`: Analyst or scientific specialist.
  * `$status`: Analytical progression status.
  * `$createdBy`: Analyst user ownership with `RESTRICT` safety lock.
* **Lifecycle Processor:**
  * Handled by `AnalysisPostProcessor` to enforce ownership and validation integrity upon creation.

---

## Physical Subject Entities

Specialist observations are recorded on distinct physical domain entities linked to stratigraphic layers:

```
[StratigraphicUnit]
   ├── Botany\Seed        ──► Morphological traits, element, elementPart, Botany\Taxonomy
   ├── Botany\Charcoal    ──► Anthracological traits, anatomy, Botany\Taxonomy
   ├── Zoo\Bone           ──► Anatomical element, side, part, endPreserved, Zoo\Taxonomy
   ├── Zoo\Tooth          ──► Tooth position, wear, eruption, Zoo\Taxonomy
   ├── Pottery            ──► Shape, functional group/form, surface treatment, decorations
   └── Individual         ──► Human skeletal remains, sex, age, burial association
```

1. **Archaeobotany:**
   * **`Botany\Seed`:** [api/src/Entity/Data/Botany/Seed.php](../../../../api/src/Entity/Data/Botany/Seed.php) records carpological remains (seeds, fruits, cereals) linked to `Vocabulary\Botany\Taxonomy`.
   * **`Botany\Charcoal`:** [api/src/Entity/Data/Botany/Charcoal.php](../../../../api/src/Entity/Data/Botany/Charcoal.php) records anthracological wood charcoal fragments.
2. **Zooarchaeology:**
   * **`Zoo\Bone`:** [api/src/Entity/Data/Zoo/Bone.php](../../../../api/src/Entity/Data/Zoo/Bone.php) records faunal skeletal elements, sides, parts, and epiphyses linked to `Vocabulary\Zoo\Taxonomy`.
   * **`Zoo\Tooth`:** [api/src/Entity/Data/Zoo/Tooth.php](../../../../api/src/Entity/Data/Zoo/Tooth.php) records isolated animal teeth and mandibles.
3. **Ceramics:**
   * **`Pottery`:** [api/src/Entity/Data/Pottery.php](../../../../api/src/Entity/Data/Pottery.php) models ceramic sherds and complete vessels, classified by shape, functional group, and surface treatment, with multiple decorative techniques joined via `PotteryDecoration`.
4. **Physical Anthropology:**
   * **`Individual`:** [api/src/Entity/Data/Individual.php](../../../../api/src/Entity/Data/Individual.php) models human skeletons and osteological profiles, referencing `Vocabulary\Individual\Sex` and `Vocabulary\Individual\Age`.
5. **Paleoclimate:**
   * **`PaleoclimateSample`:** [api/src/Entity/Data/PaleoclimateSample.php](../../../../api/src/Entity/Data/PaleoclimateSample.php) models speleothem and sediment samples collected from paleoclimate sampling sites.

---

## Analysis Join Entities (`BaseAnalysisJoin`)

To connect a generic `Analysis` to a concrete subject, MEDGREENREV uses concrete join entities extending `BaseAnalysisJoin`:

| Join Entity | Subject Class | Subject Property | Allowed Analysis Groups |
|:---|:---|:---|:---|
| `AnalysisBotanyCharcoal` | `Botany\Charcoal` | `$charcoal` | absolute dating, microscope, material analysis |
| `AnalysisBotanySeed` | `Botany\Seed` | `$seed` | absolute dating, microscope, material analysis |
| `AnalysisZooBone` | `Zoo\Bone` | `$bone` | absolute dating, microscope, material analysis |
| `AnalysisZooTooth` | `Zoo\Tooth` | `$tooth` | absolute dating, microscope, material analysis |
| `AnalysisPottery` | `Pottery` | `$pottery` | absolute dating, microscope, material analysis |
| `AnalysisIndividual` | `Individual` | `$individual` | absolute dating, microscope, material analysis |
| `AnalysisSample` | `Sample` | `$sample` | absolute dating, material analysis |
| `AnalysisSedimentCoreDepth` | `SedimentCoreDepth` | `$sedimentCoreDepth` | absolute dating, microscope, material analysis |
| `AnalysisSampleBotany` | `Sample` | `$sample` | assemblage (SDNA, POL, PHY) |
| `AnalysisSampleMicrostratigraphy` | `Sample` | `$sample` | micromorphology (THS) |
| `AnalysisContextZoo` | `Context` | `$context` | assemblage (ZOO) |
| `AnalysisContextBotany` | `Context` | `$context` | assemblage (CARP, ANTX) |
| `AnalysisSiteAnthropology` | `ArchaeologicalSite` | `$site` | assemblage (ANTH) |

### Absolute Dating Extension (`AbsDatingAnalysisJoin`)

For absolute dating analyses (radiocarbon $^{14}\text{C}$, luminescence OSL/TL), specialized child entities in [api/src/Entity/Data/Join/Analysis/AbsDating/](../../../../api/src/Entity/Data/Join/Analysis/AbsDating/) extend the join records:
* Inherits from `AbsDatingAnalysisJoin`, adding `$uncalibratedDateBp`, `$standardDeviation`, and calibrated calendar intervals.
* Uses table inheritance linked by primary key `id` (`ON DELETE CASCADE`).
* Protected by PostgreSQL triggers (`trg_abs_dating_*_enforce_group`) and CHECK constraints (`chk_analysis_types_absdating_id_range`).

---

## Read-Only View Entities

* **`AnalysisSubjectView` (`vw_analysis_subjects`):** [api/src/Entity/Data/View/AnalysisSubjectView.php](../../../../api/src/Entity/Data/View/AnalysisSubjectView.php) provides a polymorphic SQL view combining all 13 analysis join tables for API searching.
* **`AbsDatingAnalysisView` (`vw_abs_dating_analyses`):** [api/src/Entity/Data/View/AbsDatingAnalysisView.php](../../../../api/src/Entity/Data/View/AbsDatingAnalysisView.php) unifies radiocarbon and luminescence queries with calibrated calendar chronologies.

---

## Key Relationships

* **Base Join Class:** [api/src/Entity/Data/Join/Analysis/BaseAnalysisJoin.php](../../../../api/src/Entity/Data/Join/Analysis/BaseAnalysisJoin.php)
* **Analysis Constraints:** [Analysis Join Constraints & Validation Architecture](../analysis_validation_constraints.md)
* **Foreign Key Policies:** [Foreign Key Deletion & Referential Integrity Policies](../foreign_key_policies.md)
* **GeoServer Integration:** [GeoServer Integration & Spatial Architecture](../geoserver.md)
* **Controlled Vocabularies:** [Controlled Vocabularies & Lookups](./vocabularies.md)

---

## Related Nodes

* Back to [Domain Entities Subsystem](./index.md)
* Back to [Backend Hub](../index.md)
* Back to [Main Knowledge Graph Index](../../index.md)
