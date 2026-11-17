[Back to User Documentation](index.md)
# History Management
This document describes how history is managed within the MEDGREENREV system.
## Table of Contents
- [Location](#location)
  - [Permissions](#permissions)
  - [Procedure](#procedure)
  - [Visual Guide](#visual-guide)
- [Animal](#animal)
  - [Permissions](#permissions-1)
  - [Creation Procedure](#procedure-1)
    - [Primary Procedure: From the Animals Collection](#primary-procedure-animals)
    - [Alternative Procedure: From Historical Location](#alternative-procedure-animals)
  - [Duplication Procedure](#duplication-procedure-1)
  - [Visual Guide](#visual-guide-1)
- [Plant](#plant)
  - [Permissions](#permissions-2)
  - [Creation Procedure](#procedure-2)
    - [Primary Procedure: From the Plants Collection](#primary-procedure-plants)
    - [Alternative Procedure: From Historical Location](#alternative-procedure-plants)
  - [Duplication Procedure](#duplication-procedure-2)
  - [Visual Guide](#visual-guide-2)
- [Bulk Data Import](#bulk-data-import)
  - [Overview & Workflow](#import-overview)
  - [CSV File Structure & Templates](#import-csv-structure)
  - [Validation Rules](#import-validation-rules)

## <a name="location"></a>Location
### <a name="permissions"></a>Permissions
As an authenticated user with the historian role (editor), you can create a new location history entry. See the [Authorization](authorization.md) document for more information.
### <a name="procedure"></a>Procedure
1. Navigate to the **Data / History / Locations** section using the left-hand navigation menu.
2. Click the vertical **...** button in the top bar and select the **add new** option in the dropdown menu.
3. Fill in the form, keeping in mind the required fields and any validation rules.
4. Click the **Submit** button.
### <a name="visual-guide"></a>Visual Guide
The following GIF demonstrates the process:
![Location history creation](./images/history_create_location.gif)

## <a name="animal"></a>Animal
### <a name="permissions-1"></a>Permissions
As an authenticated user with the historian role, you can create a new animal history entry. See the [Authorization](authorization.md) document for more information.
### <a name="procedure-1"></a>Creation Procedure
There are two ways to create a new animal history entry:

#### <a name="primary-procedure-animals"></a>Primary Procedure: From the Animals Collection
1. Navigate to the **Data / History / Animals** section using the left-hand navigation menu.
2. Click the vertical **...** button in the top bar and select the **add new** option in the dropdown menu.
3. Fill in the form:
    - Select the **Location** from the autocomplete dropdown list.
    - When entering the **Animal** field, the system automatically attempts to resolve a corresponding **Taxonomy** based on the provided English or Spanish common name (e.g. `horse` or `caballo`, `sheep` or `oveja`; Latin scientific species names are not used).
        - If the name matches an existing taxonomy record (exact, case-insensitive against English or Spanish common names), the taxonomy name is displayed alongside a green checkmark icon.
        - If no match is found, a warning icon and "No matching taxonomy" message are shown.
        - This resolution is dynamic: it works during manual entry, when duplicating an existing record, and even if a matching taxonomy record is only added to the system *after* the history entry was created (the link will resolve the next time the form is opened).
    - Provide the remaining required fields and any validation rules (Language, Chronology Lower/Upper, Reference, and Notes).
4. Click the **Submit** button.

#### <a name="alternative-procedure-animals"></a>Alternative Procedure: From Historical Location
Alternatively, you can create an animal entry directly associated with a specific historical location:
1. Navigate to the **Data / History / Locations** section using the left-hand navigation menu.
2. Select the required historical location to open its details page.
3. Choose the **Animal** tab.
4. Click the vertical **...** button in the top bar and select the **add new** option in the dropdown menu.
5. Fill in the form. The **Location** field in the create dialog is automatically populated with the correct historical location (and disabled for editing).
    - As with the primary procedure, entering the **Animal** field dynamically resolves the corresponding **Taxonomy**.
    - Provide the remaining required fields and any validation rules.
6. Click the **Submit** button.
### <a name="duplication-procedure-1"></a>Duplication Procedure
The duplication action allows you to create a new entry based on an existing one. It can be activated in two ways:
- **From the Collection Page**: Navigate to either the main **Data / History / Animals** section or a location's **Animal** tab (via **Data / History / Locations**). In the list of animals, click the **duplicate** button (copy icon) in the navigation section of the desired row.
- **From the Item Page**: Open a specific animal history entry. Click the vertical **...** button in the top bar and select the **duplicate** option.

Once activated, the system opens a new form pre-filled with the original entry's data. You can then modify the fields as needed (the taxonomy will automatically resolve based on the pre-filled English or Spanish common name) and click **Submit**.
### <a name="visual-guide-1"></a>Visual Guide
The following GIF demonstrates the process:
![Animal history creation](./images/history_create_animal.gif)

## <a name="plant"></a>Plant
### <a name="permissions-2"></a>Permissions
As an authenticated user with the historian role, you can create a new plant history entry. See the [Authorization](authorization.md) document for more information.
### <a name="procedure-2"></a>Creation Procedure
There are two ways to create a new plant history entry:

#### <a name="primary-procedure-plants"></a>Primary Procedure: From the Plants Collection
1. Navigate to the **Data / History / Plants** section using the left-hand navigation menu.
2. Click the vertical **...** button in the top bar and select the **add new** option in the dropdown menu.
3. Fill in the form:
    - Select the **Location** from the autocomplete dropdown list.
    - When entering the **Plant** field, the system automatically attempts to resolve a corresponding **Taxonomy** based on the provided English or Spanish common name (e.g. `grapevine` or `vid`, `wheat` or `trigo`; Latin scientific species names are not used).
        - If the name matches an existing taxonomy record (exact, case-insensitive against English or Spanish common names), the taxonomy name is displayed alongside a green checkmark icon.
        - If no match is found, a warning icon and "No matching taxonomy" message are shown.
        - This resolution is dynamic: it works during manual entry, when duplicating an existing record, and even if a matching taxonomy record is only added to the system *after* the history entry was created (the link will resolve the next time the form is opened).
    - Provide the remaining required fields and any validation rules (Language, Chronology Lower/Upper, Reference, and Notes).
4. Click the **Submit** button.

#### <a name="alternative-procedure-plants"></a>Alternative Procedure: From Historical Location
Alternatively, you can create a plant entry directly associated with a specific historical location:
1. Navigate to the **Data / History / Locations** section using the left-hand navigation menu.
2. Select the required historical location to open its details page.
3. Choose the **Plant** tab.
4. Click the vertical **...** button in the top bar and select the **add new** option in the dropdown menu.
5. Fill in the form. The **Location** field in the create dialog is automatically populated with the correct historical location (and disabled for editing).
    - As with the primary procedure, entering the **Plant** field dynamically resolves the corresponding **Taxonomy**.
    - Provide the remaining required fields and any validation rules.
6. Click the **Submit** button.
### <a name="duplication-procedure-2"></a>Duplication Procedure
The duplication action allows you to create a new entry based on an existing one. It can be activated in two ways:
- **From the Collection Page**: Navigate to either the main **Data / History / Plants** section or a location's **Plant** tab (via **Data / History / Locations**). In the list of plants, click the **duplicate** button (copy icon) in the navigation section of the desired row.
- **From the Item Page**: Open a specific plant history entry. Click the vertical **...** button in the top bar and select the **duplicate** option.

Once activated, the system opens a new form pre-filled with the original entry's data. You can then modify the fields as needed (the taxonomy will automatically resolve based on the pre-filled English or Spanish common name) and click **Submit**.
### <a name="visual-guide-2"></a>Visual Guide
The following GIF demonstrates the process:
![Plant history creation](./images/history_create_plant.gif)

## <a name="bulk-data-import"></a>Bulk Data Import

### <a name="import-overview"></a>Overview & Workflow
For large datasets of historical mentions, MEDGREENREV supports bulk imports of historical animal and plant data.

- **Roles & Responsibilities:** Bulk imports are performed directly by the system administrator. Researchers prepare and provide the CSV dataset following the required structure and validation rules detailed below.
- **Archival & Ingestion:** When the administrator runs the import and all records in the file pass validation, the data is saved into the database and the source CSV file is automatically archived as a `MediaObject` in the system.

### <a name="import-csv-structure"></a>CSV File Structure & Templates
The input file must be a CSV file with comma (`,`) or semicolon (`;`) delimiters and UTF-8 encoding.

#### Required Column Headers

| Column | Description | Example Values |
| :--- | :--- | :--- |
| `location` | Historical location name. Must match an existing location in the system. | `Tortosa`, `Almería`, `Gandesa`, `Toledo` |
| `language` | Source manuscript language. Must match an existing language in the system. | `latin`, `castilian`, `catalan`, `arabic` |
| `animal` / `plant` | The animal or plant common name in **English or Spanish** (use the column name matching `--type`). **Do not use Latin scientific names.** | `horse`, `caballo`, `sheep`, `oveja` (animals)<br>`grapevine`, `vid`, `wheat`, `trigo` (plants) |
| `chronology_lower` | Starting historical year (integer). | `1150` |
| `chronology_upper` | Ending historical year (integer, must be $\ge$ `chronology_lower`). | `1200` |
| `reference` | Archival, bibliographic, or manuscript source citation. | `Cartulary of Tortosa fol. 12r` |
| `notes` | *(Optional)* Supplementary notes or research annotations. | `Mention of horses in historical record` |

#### Downloadable Templates
Pre-formatted CSV templates with the required column headers are available:
- **Animal Import Template:** [history_animal_template.csv](./files/history_animal_template.csv)
- **Plant Import Template:** [history_plant_template.csv](./files/history_plant_template.csv)

### <a name="import-validation-rules"></a>Validation Rules
To ensure data quality, the system checks each row during the import:
- **Locations & Languages:** Every `location` and `language` in your file must match an existing entry in the system vocabularies.
- **Common Names:** Animal and plant names must be provided as English or Spanish common names (e.g. `horse`/`caballo`, `wheat`/`trigo`). The system automatically links recognized names to taxonomy records.
- **Chronological Range:** Years must be integers, and `chronology_upper` cannot be earlier than `chronology_lower`.
- **Required Information:** All columns (except `notes`) are required and cannot be blank.
- **Error Handling:** If any row in the file is invalid, no records are imported into the database. An error CSV file is generated in `var/imports/errors/` listing all problematic rows along with the reasons for each failure so you can correct them and retry.
