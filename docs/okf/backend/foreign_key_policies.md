---
type: architecture_document
title: Foreign Key Deletion & Referential Integrity Policies
status: active
target_file: api/src/Entity/
---

# Foreign Key Deletion & Referential Integrity Policies

## Architectural Role

Referential integrity and data deletion lifecycles in MEDGREENREV are strictly controlled at the database schema level via Doctrine ORM foreign key mappings (`#[ORM\JoinColumn(onDelete: ...)]`). The architecture balances safety against accidental data loss with automated cleanup of join tables and polymorphic associations.

---

## Core Deletion Strategies

```
      [Top-Level Aggregates] (Site, SU, Sample, WrittenSource)
         ├── [RESTRICT] ──► Blocked if child records exist (Safety Lock)
         └── [User/Vocab] ──► [RESTRICT] Blocked if data is assigned to user or vocabulary
      
      [Association & Join Tables] (Data/Join/*)
         ├── [CASCADE] ──► Removing either linked entity deletes junction row automatically
         └── [AbsDating Inheritance] ──► [CASCADE] on id back to base analysis join row
```

### 1. Safety Lock (`RESTRICT` / Default)

Primary domain records cannot be deleted while dependent records exist. The user must explicitly remove or reassign child observations before deleting the parent:

* **Primary Excavation & Sampling Entities:** Deleting an `ArchaeologicalSite`, `Context`, `StratigraphicUnit`, `SamplingSite`, `SedimentCore`, or `WrittenSource` is blocked if child records reference it.
* **Child Entities within Stratigraphic Units:** `MicrostratigraphicUnit` and `Pottery` records use `RESTRICT` on their `stratigraphic_unit_id` foreign key, ensuring a Stratigraphic Unit cannot be deleted while child units or pottery artifacts exist.
* **Controlled Vocabularies (`App\Entity\Vocabulary`):** All vocabulary references use `RESTRICT` to prevent deletion of dictionary terms and taxonomies that are currently in use.
* **User Ownership (`created_by_id`, `uploaded_by_id`):** Prevents deletion of a user account while the user owns sites, analyses, historical records, or uploaded media files.

### 2. Automatic Association Cleanup (`CASCADE`)

Junction and extension tables automatically delete their rows when either associated parent is removed:

* **Many-to-Many & Analysis Join Tables (`App\Entity\Data\Join`):** All analysis join entities (subclasses of `BaseAnalysisJoin`), media join entities (subclasses of `BaseMediaObjectJoin`), and relational associations (e.g., `SiteCulturalContext`, `PotteryDecoration`, `SampleStratigraphicUnit`, `WrittenSourceCentury`) use `ON DELETE CASCADE` for both subject and target keys.
* **User Site Privileges (`SiteUserPrivilege`):** Privilege grants use `ON DELETE CASCADE` on both `user_id` and `site_id`, so privileges are cleaned up when either the user or the site is deleted.
* **Absolute Dating Table Inheritance:** Specialized absolute dating tables (`abs_dating_analysis_*`) use `ON DELETE CASCADE` on their primary key `id` linking to the parent `analysis_*` join table, mirroring class table inheritance cleanup.

---

## Entity Deletion Behavior Matrix

| Referenced Entity | Dependent Table / Property | `onDelete` Strategy | Deletion Behavior |
|---|---|---|---|
| **User** | `ArchaeologicalSite.createdBy`, `Analysis.createdBy`, `MediaObject.uploadedBy`, `Animal.createdBy`, `Plant.createdBy` | `RESTRICT` | ⛔ Blocked while user owns dataset entities |
| **User** | `SiteUserPrivilege.user` | `CASCADE` | ✅ User privileges deleted automatically |
| **ArchaeologicalSite** | `Context.site`, `StratigraphicUnit.site`, `Sample.site` | `RESTRICT` | ⛔ Blocked while site has contexts, SUs, or samples |
| **ArchaeologicalSite** | `SiteCulturalContext.site`, `SiteUserPrivilege.site`, `AnalysisSiteAnthropology.subject` | `CASCADE` | ✅ Joins and privileges deleted automatically |
| **StratigraphicUnit** | `MicrostratigraphicUnit.stratigraphicUnit`, `Pottery.stratigraphicUnit` | `RESTRICT` | ⛔ Blocked while SU contains microstratigraphic units or pottery |
| **StratigraphicUnit** | `ContextStratigraphicUnit.stratigraphicUnit`, `SampleStratigraphicUnit.stratigraphicUnit`, `StratigraphicUnitRelationship.*` | `CASCADE` | ✅ Stratigraphic associations deleted automatically |
| **StratigraphicUnit** | `Individual.stratigraphicUnit`, `Bone.stratigraphicUnit`, `Tooth.stratigraphicUnit`, `Seed.stratigraphicUnit`, `Charcoal.stratigraphicUnit` | `RESTRICT` | ⛔ Blocked while specialist finds exist in SU |
| **Analysis** | Subclasses of `BaseAnalysisJoin` (`AnalysisPottery`, `AnalysisIndividual`, `AnalysisSample`, etc.) | `CASCADE` | ✅ Join records deleted automatically when Analysis is deleted |
| **Analysis Join** | Subclasses of `AbsDatingAnalysis*` (`abs_dating_*`) | `CASCADE` | ✅ Absolute dating child records deleted automatically with join row |
| **MediaObject** | Subclasses of `BaseMediaObjectJoin` (`MediaObjectAnalysis`, `MediaObjectPottery`, etc.) | `CASCADE` | ✅ Media attachment joins deleted automatically |
| **Vocabulary Term** | All domain entity vocabulary lookup properties | `RESTRICT` | ⛔ Blocked while vocabulary item is referenced |

---

## Key Relationships

* **Entity Definitions:** [api/src/Entity/](../../../api/src/Entity/)
* **Domain Entities Specification:** [Domain Entities & Modeling Principles](./entities/index.md)
* **Analysis Constraints Specification:** [Analysis Join Constraints & Validation Architecture](./analysis_validation_constraints.md)
* **Baseline Schema Migration:** [api/migrations/Version20250621090503.php](../../../api/migrations/Version20250621090503.php)

---

## Related Nodes

* Back to [Backend Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
