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
  - [Procedure](#procedure-1)
  - [Duplication Procedure](#duplication-procedure-1)
  - [Visual Guide](#visual-guide-1)
- [Plant](#plant)
  - [Permissions](#permissions-2)
  - [Procedure](#procedure-2)
  - [Duplication Procedure](#duplication-procedure-2)
  - [Visual Guide](#visual-guide-2)

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
1. Navigate to the **Data / History / Location** section using the left-hand navigation menu.
2. Select the location you wish to add an animal to.
3. Click the **Animal** tab.
4. Click the vertical **...** button in the top bar and select the **add new** option in the dropdown menu.
5. Fill in the form. When entering the **Animal** field, the system automatically attempts to resolve a corresponding **Taxonomy** based on the provided English name.
    - If the name matches an existing taxonomy record (exact, case-insensitive), the taxonomy name is displayed alongside a green checkmark icon.
    - If no match is found, a warning icon and "No matching taxonomy" message are shown.
    - This resolution is dynamic: it works during manual entry, when duplicating an existing record, and even if a matching taxonomy record is only added to the system *after* the history entry was created (the link will resolve the next time the form is opened).
6. Click the **Submit** button.
### <a name="duplication-procedure-1"></a>Duplication Procedure
The duplication action allows you to create a new entry based on an existing one. It can be activated in two ways:
- **From the Collection Page**: Navigate to the **Data / History / Locations** section, select a location, click the **Animal** tab. In the list of animals, click the **duplicate** button (copy icon) in the navigation section of the desired row.
- **From the Item Page**: Open a specific animal history entry. Click the vertical **...** button in the top bar and select the **duplicate** option.

Once activated, the system opens a new form pre-filled with the original entry's data. You can then modify the fields as needed (the taxonomy will automatically resolve based on the pre-filled English name) and click **Submit**.
### <a name="visual-guide-1"></a>Visual Guide
The following GIF demonstrates the process:
![Animal history creation](./images/history_create_animal.gif)

## <a name="plant"></a>Plant
### <a name="permissions-2"></a>Permissions
As an authenticated user with the historian role, you can create a new plant history entry. See the [Authorization](authorization.md) document for more information.
### <a name="procedure-2"></a>Creation Procedure
1. Navigate to the **Data / History / Location** section using the left-hand navigation menu.
2. Select the location you wish to add a plant to.
3. Click the **Plant** tab.
4. Click the vertical **...** button in the top bar and select the **add new** option in the dropdown menu.
5. Fill in the form. When entering the **Plant** field, the system automatically attempts to resolve a corresponding **Taxonomy** based on the provided English name.
    - If the name matches an existing taxonomy record (exact, case-insensitive), the taxonomy name is displayed alongside a green checkmark icon.
    - If no match is found, a warning icon and "No matching taxonomy" message are shown.
    - This resolution is dynamic: it works during manual entry, when duplicating an existing record, and even if a matching taxonomy record is only added to the system *after* the history entry was created (the link will resolve the next time the form is opened).
6. Click the **Submit** button.
### <a name="duplication-procedure-2"></a>Duplication Procedure
The duplication action allows you to create a new entry based on an existing one. It can be activated in two ways:
- **From the Collection Page**: Navigate to the **Data / History / Locations** section, select a location, click the **Plant** tab. In the list of plants, click the **duplicate** button (copy icon) in the navigation section of the desired row.
- **From the Item Page**: Open a specific plant history entry. Click the vertical **...** button in the top bar and select the **duplicate** option.

Once activated, the system opens a new form pre-filled with the original entry's data. You can then modify the fields as needed (the taxonomy will automatically resolve based on the pre-filled English name) and click **Submit**.
### <a name="visual-guide-2"></a>Visual Guide
The following GIF demonstrates the process:
![Plant history creation](./images/history_create_plant.gif)
