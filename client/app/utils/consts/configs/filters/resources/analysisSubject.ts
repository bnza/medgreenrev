import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import { generateResourceDefinition } from '~/utils/consts/configs/filters/definitions'

import { propertyStaticFiltersDefinition as analysisPropertyStaticDefinition } from './analysis'
import { associationPropertyStaticFiltersDefinition } from './analysisAssociation'
import {
  propertyStaticFiltersDefinition as botanyPropertyStaticDefinition,
  taxonomyStaticFiltersDefinition as botanyTaxonomyPropertyStaticDefinition,
} from './botany'
import { propertyStaticFiltersDefinition as contextPropertyStaticDefinition } from './context'
import { propertyStaticFiltersDefinition as individualPropertyStaticDefinition } from './individual'
import { propertyStaticFiltersDefinition as microstratigraphicUnitPropertyStaticDefinition } from './microstratigraphicUnit'
import { propertyStaticFiltersDefinition as potteryPropertyStaticDefinition } from './pottery'
import { propertyStaticFiltersDefinition as samplePropertyStaticDefinition } from './sample'
import { propertyStaticFiltersDefinition as sedimentCoreDepthPropertyStaticDefinition } from './sedimentCoreDepth'
import { propertyStaticFiltersDefinition as stratigraphicUnitPropertyStaticDefinition } from './stratigraphicUnit'
import {
  propertyBoneStaticFiltersDefinition as zooBonePropertyStaticDefinition,
  propertyToothStaticFiltersDefinition as zooToothPropertyStaticDefinition,
  taxonomyStaticFiltersDefinition as zooTaxonomyPropertyStaticDefinition,
} from './zoo'

const analysisBotanyPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...generateResourceDefinition(analysisPropertyStaticDefinition, [
      'analysis',
      'analysis',
    ]),
    ...generateResourceDefinition(botanyPropertyStaticDefinition, [
      'subject',
      'subject',
    ]),
    ...generateResourceDefinition(botanyTaxonomyPropertyStaticDefinition, [
      'subject',
      'subject',
    ]),
    ...associationPropertyStaticFiltersDefinition,
  }

const analysisContextBotanyPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...generateResourceDefinition(analysisPropertyStaticDefinition, [
      'analysis',
      'analysis',
    ]),
    ...generateResourceDefinition(contextPropertyStaticDefinition, [
      'subject',
      'subject',
    ]),
    ...generateResourceDefinition(botanyTaxonomyPropertyStaticDefinition, [
      'taxonomies',
      '',
    ]),
    ...associationPropertyStaticFiltersDefinition,
  }

const analysisContextZooPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...generateResourceDefinition(analysisPropertyStaticDefinition, [
      'analysis',
      'analysis',
    ]),
    ...generateResourceDefinition(contextPropertyStaticDefinition, [
      'subject',
      'subject',
    ]),
    ...generateResourceDefinition(zooTaxonomyPropertyStaticDefinition, [
      'taxonomies',
      '',
    ]),
    ...associationPropertyStaticFiltersDefinition,
  }

const analysisIndividualPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...generateResourceDefinition(analysisPropertyStaticDefinition, [
      'analysis',
      'analysis',
    ]),
    ...generateResourceDefinition(individualPropertyStaticDefinition, [
      'subject',
      'subject',
    ]),
    ...associationPropertyStaticFiltersDefinition,
  }

const analysisPotteryPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...generateResourceDefinition(analysisPropertyStaticDefinition, [
      'analysis',
      'analysis',
    ]),
    ...generateResourceDefinition(potteryPropertyStaticDefinition, [
      'subject',
      'subject',
    ]),
    ...associationPropertyStaticFiltersDefinition,
  }

const analysisSamplePropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...generateResourceDefinition(analysisPropertyStaticDefinition, [
      'analysis',
      'analysis',
    ]),
    ...generateResourceDefinition(samplePropertyStaticDefinition, [
      'subject',
      'subject',
    ]),
    ...associationPropertyStaticFiltersDefinition,
  }

const analysisSampleMicrostratigraphicUnitPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...generateResourceDefinition(analysisPropertyStaticDefinition, [
      'analysis',
      'analysis',
    ]),
    ...generateResourceDefinition(samplePropertyStaticDefinition, [
      'subject',
      'subject',
    ]),
    ...generateResourceDefinition(
      microstratigraphicUnitPropertyStaticDefinition,
      [
        'subject.sampleStratigraphicUnits.stratigraphicUnit.microstratigraphicUnits',
        'microstratigraphic unit',
      ],
    ),
    ...associationPropertyStaticFiltersDefinition,
  }

const analysisSedimentCoreDepthPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...generateResourceDefinition(analysisPropertyStaticDefinition, [
      'analysis',
      'analysis',
    ]),
    ...generateResourceDefinition(sedimentCoreDepthPropertyStaticDefinition, [
      'subject',
      'subject',
    ]),
    ...associationPropertyStaticFiltersDefinition,
  }

const analysisZooBonePropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...generateResourceDefinition(analysisPropertyStaticDefinition, [
      'analysis',
      'analysis',
    ]),
    ...generateResourceDefinition(zooBonePropertyStaticDefinition, [
      'subject',
      'subject',
    ]),
    ...associationPropertyStaticFiltersDefinition,
  }

const analysisZooToothPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    ...generateResourceDefinition(analysisPropertyStaticDefinition, [
      'analysis',
      'analysis',
    ]),
    ...generateResourceDefinition(zooToothPropertyStaticDefinition, [
      'subject',
      'subject',
    ]),
    ...associationPropertyStaticFiltersDefinition,
  }

export const staticFiltersDefinitionBotany = {
  ...analysisBotanyPropertyStaticFiltersDefinition,
  ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
    'subject.stratigraphicUnit',
    'stratigraphic unit',
  ]),
}

export const staticFiltersDefinitionBotanyParentSubject = {
  ...analysisBotanyPropertyStaticFiltersDefinition,
}

export const staticFiltersDefinitionContextBotany = {
  ...analysisContextBotanyPropertyStaticFiltersDefinition,
  ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
    'subject.contextStratigraphicUnits.stratigraphicUnit',
    'stratigraphic unit',
  ]),
}

export const staticFiltersDefinitionContextBotanyParentSubject = {
  ...analysisContextBotanyPropertyStaticFiltersDefinition,
}

export const staticFiltersDefinitionContextZoo = {
  ...analysisContextZooPropertyStaticFiltersDefinition,
  ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
    'subject.contextStratigraphicUnits.stratigraphicUnit',
    'stratigraphic unit',
  ]),
}

export const staticFiltersDefinitionContextZooParentSubject = {
  ...analysisContextZooPropertyStaticFiltersDefinition,
}

export const staticFiltersDefinitionIndividual = {
  ...analysisIndividualPropertyStaticFiltersDefinition,
  ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
    'subject.stratigraphicUnit',
    'stratigraphic unit',
  ]),
}

export const staticFiltersDefinitionIndividualParentSubject = {
  ...analysisIndividualPropertyStaticFiltersDefinition,
}

export const staticFiltersDefinitionPottery = {
  ...analysisPotteryPropertyStaticFiltersDefinition,
  ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
    'subject.stratigraphicUnit',
    'stratigraphic unit',
  ]),
}

export const staticFiltersDefinitionPotteryParentSubject = {
  ...analysisPotteryPropertyStaticFiltersDefinition,
}

export const staticFiltersDefinitionSample = {
  ...analysisSamplePropertyStaticFiltersDefinition,
  ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
    'subject.stratigraphicUnits.stratigraphicUnit',
    'stratigraphic unit',
  ]),
}

export const staticFiltersDefinitionSampleParentSubject = {
  ...analysisSamplePropertyStaticFiltersDefinition,
}

export const staticFiltersDefinitionSampleMicrostratigraphicUnit = {
  ...analysisSampleMicrostratigraphicUnitPropertyStaticFiltersDefinition,
  ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
    'subject.sampleStratigraphicUnits.stratigraphicUnit',
    'stratigraphic unit',
  ]),
}

export const staticFiltersDefinitionSampleMicrostratigraphicUnitParentAnalysis =
  {
    ...generateResourceDefinition(samplePropertyStaticDefinition, [
      'subject',
      'subject',
    ]),
    ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
      'subject.sampleStratigraphicUnits.stratigraphicUnit',
      'stratigraphic unit',
    ]),
  }

export const staticFiltersDefinitionSampleMicrostratigraphicUnitParentSubject =
  {
    ...analysisSampleMicrostratigraphicUnitPropertyStaticFiltersDefinition,
  }

export const staticFiltersDefinitionSedimentCoreDepth = {
  ...analysisSedimentCoreDepthPropertyStaticFiltersDefinition,
  ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
    'subject.stratigraphicUnit',
    'stratigraphic unit',
  ]),
}

export const staticFiltersDefinitionSedimentCoreDepthParentSubject = {
  ...analysisSedimentCoreDepthPropertyStaticFiltersDefinition,
}

export const staticFiltersDefinitionZooBone = {
  ...analysisZooBonePropertyStaticFiltersDefinition,
  ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
    'subject.stratigraphicUnit',
    'stratigraphic unit',
  ]),
}

export const staticFiltersDefinitionZooBoneParentSubject = {
  ...analysisZooBonePropertyStaticFiltersDefinition,
}

export const staticFiltersDefinitionZooTooth = {
  ...analysisZooToothPropertyStaticFiltersDefinition,
  ...generateResourceDefinition(stratigraphicUnitPropertyStaticDefinition, [
    'subject.stratigraphicUnit',
    'stratigraphic unit',
  ]),
}

export const staticFiltersDefinitionZooToothParentSubject = {
  ...analysisZooToothPropertyStaticFiltersDefinition,
}
