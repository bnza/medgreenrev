[Back to User Documentation](index.md)

# Pottery Management

This document describes how pottery records are managed within the MEDGREENREV system.

## Pottery creation

### Permissions

See the dedicated [Site permissions paragraph](site-permissions-management.md) document for more information.

### Workflow 1: From the Pottery collection page

1.  Navigate to the **Data / Archaeology / Potteries** section using the left-hand navigation menu.
2.  Click the vertical **...** button in the top bar and select the **add new** option in the dropdown menu.
3.  Fill in the form, keeping in mind the required fields and any validation rules.
The `stratigraphic_unit` field is mandatory and must exist beforehand the pottery creation. SU is chosen from a dropdown list containing all the stratigraphic units of the site the user is granted to work on. You can filter the list by typing a few letters/numbers of the unit code.
4.  Click the **Submit** button.

### Visual Guide

The following GIF demonstrates the process for the operation:

![Pottery creation](./images/pot_pottery_creation_from_collection.gif)

### Workflow 2: From the parent Stratigraphic Unit

1.  Navigate to the **Data / Archaeology / Stratigraphic Unit** section using the left-hand navigation menu.
2.  Select the stratigraphic unit you want to manage, possibly using the search bar, and click on the right-sided arrow on the left side of the row to navigate to the SU's details page.
3.  Click the **Potteries** tab.
4.  In the bottom children collection, click the vertical **...** button in the top bar and select the **add new** option in the dropdown menu.
5.  Fill in the form, keeping in mind the required fields and any validation rules.
The `stratigraphic_unit` field is pre-filled with the parent SU and cannot be changed.
6.  Click the **Submit** button.

### Visual Guide

The following GIF demonstrates the process for the operation:

![Pottery creation](./images/pot_pottery_creation_from_parent.gif)

## Analyses association

Pottery can be associated with `specimen analyses` (absolute dating, microscope, material analysis: `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD`). See the dedicated [Analyses](analyses.md) document for more information.
