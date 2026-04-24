[Back to User Documentation](index.md)

# Analyses Management

This document describes how analyses are managed within the MEDGREENREV system.

## Overview

The system provides a flexible structure for associating analyses with one or more entities, depending on the scope and focus of each study. Specific or targeted analyses — such as ORA, aDNA, or microscopy — can be linked directly to the particular element under study (e.g., an animal bone or tooth, a human deposit or individual, or a ceramic find). For analyses that are meaningful only at a broader, aggregated level, the system allows them to be associated with entities representing a relevant level of aggregation. For instance, zooarchaeological studies can be associated with contexts (arbitrary groupings of stratigraphic units with archaeological significance), while anthropological analyses can be associated with the site as a whole.

The system distinguishes between two main categories of analysis: **Specimen Analyses** and **Assemblage Analyses**.

### Specimen Analyses

Specimen analyses target a specific find or element. They are grouped by analytical technique:

| Group | Code | Analysis |
|---|---|---|
| **Absolute Dating** | C14 | C14 |
| | THL | Thermoluminescence |
| | OSL | Optical Simulated Luminescence |
| **Material Analysis** | ADNA | aDNA |
| | ISO | Isotopes |
| | ORA | ORA |
| | XRF | XRF |
| | XRD | XRD |
| **Micromorphology** | THS | Thin Section |
| **Microscope** | OPT | Optical |
| | SEM | SEM |
| **Sediment** | POL | Pollen |
| | SDNA | Sedimentary DNA |
| | GEO | Geochemistry |

### Assemblage Analyses

Assemblage analyses operate at an aggregated level, associated with contexts or the site as a whole rather than individual specimens:

| Code | Analysis |
|---|---|
| ANTX | Anthracology |
| ANTH | Anthropology |
| CARP | Carpology |
| ZOO | Zooarchaeology |

## Analysis creation

### Permissions

As an authenticated user, with a specialist role, you can create new analyses. See the [Authorization](authorization.md#analysis-records) document for more information.

### Procedure

1.  Navigate to the **Analyses / Analyses** section using the left-hand navigation menu.
2.  Click the vertical **...** button in the top bar and select the **add new** option in the dropdown menu.
3.  Fill in the form, keeping in mind the required fields and any validation rules.
    The **Code** field is automatically generated concatenating the `type` code, the `year` last two digits, and the `identifier` (e.g. in the example below it will be `THS.26.TO.1`). 
4.  Click the **Submit** button.

### Visual Guide

The following GIF demonstrates the process:

![Analysis creation](./images/geo_thin_section_analysis_creation.gif)

## Analysis association

You can associate analyses with any entity that is relevant to the study.

### Permitted Analysis Types per Resource

The following table shows which analysis types are permitted for each resource:

| Resource                                   | Permitted Groups                                        | Permitted Type Codes |
|--------------------------------------------|---------------------------------------------------------|---|
| Pottery analysis                           | absolute dating, microscope, material analysis          | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD` |
| Human individual analysis                  | absolute dating, microscope, material analysis          | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD` |
| Botany seed analysis                       | absolute dating, microscope, material analysis          | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD` |
| Botany charcoal analysis                   | absolute dating, microscope, material analysis          | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD` |
| Animal bone analysis                       | absolute dating, microscope, material analysis          | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD` |
| Animal tooth analysis                      | absolute dating, microscope, material analysis          | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD` |
| Sample analysis                            | absolute dating, material analysis, sediment            | `C14`, `THL`, `OSL`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD`, `GEO`, `POL`, `SDNA` |
| Sample microstratigraphic analysis | micromorphology*                                        | `THS` |
| Sediment core analysis                     | absolute dating, microscope, material analysis, sediment | `C14`, `THL`, `OSL`, `OPT`, `SEM`, `ADNA`, `ISO`, `ORA`, `XRF`, `XRD`, `GEO`, `POL`, `SDNA` |
| Zooarchaeological analysis                 | assemblage*                                             | `ZOO` |
| Archaeobotanical analysis                  | assemblage*                                             | `CARP`, `ANTX` |
| Anthropological analysis                   | assemblage*                                             | `ANTH` |

> **Note**: Zooarchaeological, archaeobotanical, and anthropological analyses filter by **specific type codes** (from the **assemblage** group). The remaining resources filter by **group**, so they automatically include any future types added to those groups.

> **Note**: *Microstratigraphic, Zooarchaeological, archaeobotanical, and anthropological analyses have their own association tab in the parent resource's details page, so their association is slightly different from the other resources.

### Microstratigraphic Analysis Association

#### Permissions

To be able to associate a microstratigraphic analysis with a sample, the user must have the appropriate [permissions](authorization.md#specialist-data-items-botany-zoo-pottery-etc) for the sample's site, and the user must have the `microstratigraphist` role.

#### Procedure

1. Navigate to the sample's details page, using either the **Data / Archaeology / Samples**, possibly filtering it with the search bar,
   or in the parent site's detail page in the sample tab.
2. Select the **Samples** tab.
3. Click the vertical **...** button in the top bar of the tab and select the **add new** option in the dropdown menu.
4. Fill in the form, keeping in mind the required fields and any validation rules.
   The `analysis` field is mandatory and must exist beforehand the association creation. Analysis is chosen from a dropdown list containing all the microstratigraphic analysis in the system. You can filter the list by typing a few letters/numbers of the analysis code.
5. Click the **Submit** button.

### Visual Guide

The following GIF demonstrates the process:

![Analysis association](./images/mst_sample_microstratigraphy_analysis_association.gif)
