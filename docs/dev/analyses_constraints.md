### How `BaseAnalysisJoin` works with `PermittedAnalysisType`

#### The Architecture

`BaseAnalysisJoin` is a `#[ORM\MappedSuperclass]` — a Doctrine abstract base class that is **not mapped to its own table** but provides shared fields (`$id`, `$analysis`, `$summary`) and behavior to concrete subclass entities like `AnalysisPottery`, `AnalysisIndividual`, `AnalysisBotanySeed`, etc.

Each subclass maps to its own join table (e.g. `analysis_potteries`) and links a **subject** (e.g. a Pottery record) to an **Analysis** record.

---

#### The `PermittedAnalysisType` Constraint (Application-Level)

This is a **Symfony Validator constraint** applied as an attribute on the `$analysis` property (line 90 of `BaseAnalysisJoin`):

```php
#[AppAssert\PermittedAnalysisType(groups: ['validation:analysis_join:create'])]
protected Analysis $analysis;
```

##### How the validation works step-by-step:

1. **The constraint** (`App\Validator\PermittedAnalysisType`) is a simple `#[\Attribute]` class extending `Constraint`, targeting a property. It defines the error message template:
   ```
   Analysis type "{{ code }}" is not permitted for {{ class }}. Allowed types: {{ allowed }}
   ```

2. **The validator** (`App\Validator\PermittedAnalysisTypeValidator`) does the actual checking:
   - It receives the `$analysis` entity (the property value) and the constraint.
   - It skips validation if the value is `null` (defers to `#[Assert\NotBlank]`).
   - It gets the **owning entity** via `$this->context->getObject()` — this is the concrete subclass (e.g. `AnalysisPottery`).
   - It reads the analysis type code: `$value->getType()->code`.
   - It calls the **static method** `$object::getPermittedAnalysisTypes()` on the concrete subclass to get the allowed type codes.
   - If the analysis type code is **not** in the allowed list → it builds a violation.

3. **Each subclass** implements `getPermittedAnalysisTypes()` differently. For example, `AnalysisPottery` allows analysis types whose group is one of `absolute dating`, `microscope`, or `material analysis`:
   ```php
   public static function getPermittedAnalysisTypes(): array
   {
       return array_keys(
           array_filter(
               Analysis::TYPES,
               fn ($type) => in_array($type['group'], [
                   Analysis::GROUP_ABS_DATING,
                   Analysis::GROUP_MICROSCOPE,
                   Analysis::GROUP_MATERIAL_ANALYSIS,
               ])
           )
       );
   }
   ```

4. **Validation group**: The constraint is only active in the `validation:analysis_join:create` group, meaning it's enforced **only during creation**, not during updates.

##### Summary of the flow:
```
API POST request → Deserialization → Symfony Validation (group: validation:analysis_join:create)
  → PermittedAnalysisTypeValidator::validate()
    → gets Analysis entity from property
    → gets concrete join entity from context
    → calls ConcreteJoinClass::getPermittedAnalysisTypes()
    → checks if analysis.type.code ∈ allowed codes
    → raises violation if not
```

---

#### Database-Level Constraints (Migrations)

There is **NO database-level CHECK constraint or trigger that mirrors the general `PermittedAnalysisType` logic**. The broad "which analysis types are allowed for which join table" rule exists **only at the application level** (Symfony validator).

However, there are **related DB-level constraints** specifically for the **absolute dating** (`abs_dating_*`) sub-join tables, defined in migration `Version20250627142202`:

##### 1. Per-table trigger: Enforce abs_dating group on INSERT/UPDATE

For each of the 6 join tables (`analysis_botany_charcoals`, `analysis_botany_seeds`, `analysis_individuals`, `analysis_potteries`, `analysis_zoo_bones`, `analysis_zoo_teeth`), the migration creates:

- **Function** `validate_abs_dating_{table}_group()` — a PL/pgSQL trigger function that:
  - JOINs from the join table → `analyses` → `vocabulary.analysis_types`
  - Checks that `type_group = 'absolute dating'`
  - Raises an exception if it isn't

- **Trigger** `trg_abs_dating_{table}_enforce_group` — fires `BEFORE INSERT OR UPDATE` on the `abs_dating_{table}` table

This ensures that **abs_dating child rows can only reference analyses whose type group is `absolute dating`**.

##### 2. Trigger on `analyses`: Prevent group change when abs_dating children exist

- **Function** `prevent_analysis_group_change_if_abs_child()` — checks via UNION across all 6 join tables whether the analysis has any abs_dating children.
- **Trigger** `trg_analysis_block_incompatible_group` — fires `BEFORE UPDATE ON analyses`
- If a child row exists and the new `analysis_type_id` maps to a group ≠ `absolute dating`, it raises an exception.

##### 3. Per-table trigger: Prevent `analysis_id` update when abs_dating child exists

- **Function** `prevent_{table}_analysis_id_update_if_abs_dating()` — if the old analysis was `absolute dating` and an `abs_dating_{table}` child row exists, it blocks the `analysis_id` change.
- **Trigger** `trg_{table}_block_analysis_id_update` — fires `BEFORE UPDATE` on the join table.

##### 4. CHECK constraint on `analysis_types` (from `Version20250627142200`)

```sql
ALTER TABLE vocabulary.analysis_types
ADD CONSTRAINT chk_analysis_types_absdating_id_range
CHECK (type_group <> 'absolute dating' OR (id >= 100 AND id <= 199));
```

This enforces that all analysis types with group `absolute dating` must have IDs in the range 100–199. This is used by the `vw_abs_dating_analyses` view which filters `WHERE a.analysis_type_id < 200`.

##### 5. Other DB constraints on `BaseAnalysisJoin` tables (from the mapped superclass)

- **Unique constraint** `(subject_id, analysis_id)` — defined via `#[ORM\UniqueConstraint]` on `BaseAnalysisJoin` (line 24), created at the DB level for each concrete table.
- **Foreign key** on `analysis_id` → `analyses.id` with `ON DELETE CASCADE` (line 87).


---

#### Permitted Analysis Types per Resource

The following table shows which analysis type codes (and their groups) are allowed for each concrete `BaseAnalysisJoin` subclass, as enforced by `getPermittedAnalysisTypes()`.

##### Analysis Type Reference

| Code | Value | Group |
|------|-------|-------|
| `C14` | C14 | absolute dating |
| `THL` | thermoluminescence | absolute dating |
| `OSL` | optical simulated luminescence | absolute dating |
| `ANTX` | anthracology | assemblage |
| `ANTH` | anthropology | assemblage |
| `CARP` | carpology | assemblage |
| `ZOO` | zooarchaeology | assemblage |
| `ADNA` | aDNA | material analysis |
| `ISO` | isotopes | material analysis |
| `ORA` | ORA | material analysis |
| `XRF` | XRF | material analysis |
| `XRD` | XRD | material analysis |
| `GEO` | geochemistry | sediment |
| `THS` | thin section | micromorphology |
| `OPT` | optical | microscope |
| `SEM` | SEM | microscope |
| `POL` | pollen | sediment |
| `SDNA` | sedimentary DNA | sediment |

##### Permitted Types per Join Entity

| Join Entity | Subject | Permitted Groups | Permitted Type Codes |
|---|---|---|---|
| `AnalysisPottery` | Pottery | absolute dating, microscope, material analysis | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD` |
| `AnalysisIndividual` | Individual | absolute dating, microscope, material analysis | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD` |
| `AnalysisBotanySeed` | Botany Seed | absolute dating, microscope, material analysis | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD` |
| `AnalysisBotanyCharcoal` | Botany Charcoal | absolute dating, microscope, material analysis | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD` |
| `AnalysisZooBone` | Zoo Bone | absolute dating, microscope, material analysis | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD` |
| `AnalysisZooTooth` | Zoo Tooth | absolute dating, microscope, material analysis | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD` |
| `AnalysisSampleMicrostratigraphy` | Sample (Microstratigraphy) | micromorphology | `THS` |
| `AnalysisContextZoo` | Context (Zoo) | *(by type code)* | `ZOO` |
| `AnalysisContextBotany` | Context (Botany) | *(by type code)* | `CARP`, `ANTX` |
| `AnalysisSiteAnthropology` | Site (Anthropology) | *(by type code)* | `ANTH` |

> **Note**: `AnalysisContextZoo`, `AnalysisContextBotany`, and `AnalysisSiteAnthropology` filter by **specific type codes** (not by group). The remaining entities filter by **group**, so they automatically include any future types added to those groups.

---

#### Summary Table

| Constraint | Level | Scope |
|---|---|---|
| `PermittedAnalysisType` (allowed type codes per join class) | **Application only** (Symfony validator) | All join tables, on create |
| `UniqueEntity(subject, analysis)` | **Both** (Symfony + DB unique constraint) | All join tables |
| `NotBlank` on analysis | **Application** (Symfony validator) | All join tables, on create |
| FK `analysis_id → analyses.id ON DELETE CASCADE` | **Database** | All join tables |
| Trigger: abs_dating child must reference abs_dating group | **Database** (PL/pgSQL trigger) | `abs_dating_*` tables only |
| Trigger: block analysis group change if abs_dating child exists | **Database** (PL/pgSQL trigger) | `analyses` table |
| Trigger: block `analysis_id` update if abs_dating child exists | **Database** (PL/pgSQL trigger) | Join tables with abs_dating children |
| CHECK: abs_dating type IDs must be 100–199 | **Database** (CHECK constraint) | `vocabulary.analysis_types` |

**Key takeaway**: The general `PermittedAnalysisType` validation (e.g., "pottery can only have microscope, material analysis, or absolute dating analyses") has **no database-level enforcement**. It relies entirely on the Symfony validator. The database triggers only enforce the narrower rule that **abs_dating sub-join rows must reference absolute dating analyses**, and protect referential integrity around that relationship.