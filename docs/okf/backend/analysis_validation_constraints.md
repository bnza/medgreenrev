---
type: architecture_document
title: Analysis Join Constraints & Validation Architecture
status: active
target_file: api/src/Entity/Data/Join/Analysis/BaseAnalysisJoin.php
---

# Analysis Join Constraints & Validation Architecture

## Architectural Role

Scientific analyses (radiocarbon dating, isotopic analysis, SEM microscopy, anthracology, zooarchaeology) are linked to physical archaeological subjects through explicit join entities derived from [BaseAnalysisJoin](../../../api/src/Entity/Data/Join/Analysis/BaseAnalysisJoin.php). Validation combines application-layer Symfony constraints with PostgreSQL triggers and table checks to guarantee domain rules and prevent invalid analytical associations.

---

## Architecture of `BaseAnalysisJoin`

`BaseAnalysisJoin` is a Doctrine `#[ORM\MappedSuperclass]` providing standard properties and validation rules for all analysis join entities:

* **Primary Relationships:** Manages `$id`, `$analysis` (referencing `Analysis` with `ON DELETE CASCADE`), and optional `$summary`.
* **Database Unique Constraint:** Enforces `#[ORM\UniqueConstraint(fields: ['subject', 'analysis'])]` on every concrete table to prevent duplicate join pairings.
* **ApiPlatform Search & Order Filters:** Exposes standard filters on analysis attributes (`type`, `type.code`, `type.group`, `year`, `status`, `responsible`, `laboratory`).

---

## Multi-Layered Validation Architecture

```
[API POST /data/analysis_*]
   │
   ▼
[Application Layer: Symfony Validator]
   ├── PermittedAnalysisTypeValidator
   │   └── Checks: analysis.type.code ∈ ConcreteJoin::getPermittedAnalysisTypes()
   └── UniqueEntity & NotBlank Constraints
   │
   ▼
[Database Layer: PostgreSQL Triggers & Constraints]
   ├── Trigger: trg_abs_dating_{table}_enforce_group (Ensures type_group = 'absolute dating')
   ├── Trigger: trg_analysis_block_incompatible_group (Blocks changing analysis type if child exists)
   ├── Trigger: trg_{table}_block_analysis_id_update (Blocks changing analysis_id on join row)
   └── CHECK: chk_analysis_types_absdating_id_range (IDs 100-199 for absolute dating types)
```

### 1. Application-Level Constraint (`PermittedAnalysisType`)

* **Constraint Attribute:** [api/src/Validator/PermittedAnalysisType.php](../../../api/src/Validator/PermittedAnalysisType.php) attached to `BaseAnalysisJoin::$analysis` under the `validation:analysis_join:create` group.
* **Validator Implementation:** [api/src/Validator/PermittedAnalysisTypeValidator.php](../../../api/src/Validator/PermittedAnalysisTypeValidator.php) dynamically retrieves the allowed type codes by calling the static method `getPermittedAnalysisTypes()` on the concrete subclass instance (`$this->context->getObject()`).
* **Violation Generation:** If `$analysis->getType()->code` is not within the permitted list, a violation is added stating the rejected type, the entity class, and the allowed set.

### 2. Database-Level Triggers & Integrity Constraints

While broad type compatibility is validated at the application level, the database enforces strict referential integrity for **absolute dating** (`abs_dating_*`) child tables via migration [Version20250627142202.php](../../../api/migrations/Version20250627142202.php):

1. **`trg_abs_dating_{table}_enforce_group` (BEFORE INSERT OR UPDATE on `abs_dating_*`):**
   * Validates via SQL JOIN that the referenced analysis belongs to `type_group = 'absolute dating'`.
   * Aborts transaction if an incompatible analysis type is attached.
2. **`trg_analysis_block_incompatible_group` (BEFORE UPDATE on `analyses`):**
   * Checks across all 8 join tables whether an analysis has existing `abs_dating_*` child rows.
   * Blocks updating `analysis_type_id` to any non-absolute dating type if child rows exist.
3. **`trg_{table}_block_analysis_id_update` (BEFORE UPDATE on join tables):**
   * Prevents changing the `analysis_id` foreign key on the parent join row while an `abs_dating_*` child row exists.
4. **`chk_analysis_types_absdating_id_range` (CHECK constraint in `Version20250627142200.php`):**
   * Enforces `type_group <> 'absolute dating' OR (id >= 100 AND id <= 199)` on `vocabulary.analysis_types`, guaranteeing predictable key ranges for database views like `vw_abs_dating_analyses`.

---

## Permitted Analysis Types Matrix

| Join Entity | Archaeological Subject | Permitted Groups / Filtering Method | Permitted Analysis Type Codes |
|---|---|---|---|
| `AnalysisPottery` | Pottery | `absolute dating`, `microscope`, `material analysis` | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD`, `GEO` |
| `AnalysisIndividual` | Individual (Human Remains) | `absolute dating`, `microscope`, `material analysis` | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD`, `GEO` |
| `AnalysisBotanySeed` | Botany Seed | `absolute dating`, `microscope`, `material analysis` | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD`, `GEO` |
| `AnalysisBotanyCharcoal` | Botany Charcoal | `absolute dating`, `microscope`, `material analysis` | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD`, `GEO` |
| `AnalysisZooBone` | Faunal Bone | `absolute dating`, `microscope`, `material analysis` | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD`, `GEO` |
| `AnalysisZooTooth` | Faunal Tooth | `absolute dating`, `microscope`, `material analysis` | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD`, `GEO` |
| `AnalysisSample` | Sample | `absolute dating`, `material analysis` | `C14`, `THL`, `OSL`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD`, `GEO` |
| `AnalysisSedimentCoreDepth` | Sediment Core Depth | `absolute dating`, `microscope`, `material analysis` | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD`, `GEO` |
| `AnalysisSampleBotany` | Sample (Botany) | Specific type codes from `assemblage` | `SDNA`, `POL`, `PHY` |
| `AnalysisSampleMicrostratigraphy` | Sample (Microstratigraphy) | `micromorphology` | `THS` |
| `AnalysisContextZoo` | Context (Fauna) | Specific type code from `assemblage` | `ZOO` |
| `AnalysisContextBotany` | Context (Botany) | Specific type codes from `assemblage` | `CARP`, `ANTX` |
| `AnalysisSiteAnthropology` | Site (Anthropology) | Specific type code from `assemblage` | `ANTH` |

---

## Key Relationships

* **Base Join Superclass:** [api/src/Entity/Data/Join/Analysis/BaseAnalysisJoin.php](../../../api/src/Entity/Data/Join/Analysis/BaseAnalysisJoin.php)
* **Validator Implementation:** [api/src/Validator/PermittedAnalysisTypeValidator.php](../../../api/src/Validator/PermittedAnalysisTypeValidator.php)
* **Trigger Migration (Absolute Dating):** [api/migrations/Version20250627142202.php](../../../api/migrations/Version20250627142202.php)
* **Foreign Key Policies:** [Foreign Key Deletion & Referential Integrity Policies](./foreign_key_policies.md)
* **GeoServer Integration:** [GeoServer Integration & Spatial Architecture](./geoserver.md)

---

## Related Nodes

* Back to [Backend Hub](./index.md)
* Back to [Main Knowledge Graph Index](../index.md)
