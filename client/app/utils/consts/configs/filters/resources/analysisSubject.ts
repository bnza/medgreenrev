import type { ResourceStaticFiltersDefinitionObject } from '~~/types'
import {
  API_FILTERS,
  generateResourceDefinition,
} from '~/utils/consts/configs/filters/definitions'

import { propertyStaticFiltersDefinition as analysisPropertyStaticDefinition } from './analysis'
import {
  propertyStaticFiltersDefinition as botanyPropertyStaticDefinition,
  taxonomyStaticFiltersDefinition as botanyTaxonomyPropertyStaticDefinition,
} from './botany'
import { propertyStaticFiltersDefinition as contextPropertyStaticDefinition } from './context'
import { propertyStaticFiltersDefinition as individualPropertyStaticDefinition } from './individual'
import { propertyStaticFiltersDefinition as microstratigraphicUnitPropertyStaticDefinition } from './microstratigraphicUnit'
import { propertyStaticFiltersDefinition as potteryPropertyStaticDefinition } from './pottery'
import { propertyStaticFiltersDefinition as samplePropertyStaticDefinition } from './sample'
import { propertyStaticFiltersDefinition as stratigraphicUnitPropertyStaticDefinition } from './stratigraphicUnit'
import {
  propertyBoneStaticFiltersDefinition as zooBonePropertyStaticDefinition,
  propertyToothStaticFiltersDefinition as zooToothPropertyStaticDefinition,
  taxonomyStaticFiltersDefinition as zooTaxonomyPropertyStaticDefinition,
} from './zoo'

const { Exists, SearchPartial } = API_FILTERS

const summaryPropertyStaticFiltersDefinition: ResourceStaticFiltersDefinitionObject =
  {
    summary: {
      filters: {
        Exists,
        SearchPartial,
      },
    },
  }

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
    ...summaryPropertyStaticFiltersDefinition,
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
    ...summaryPropertyStaticFiltersDefinition,
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
    ...summaryPropertyStaticFiltersDefinition,
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
    ...summaryPropertyStaticFiltersDefinition,
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
    ...summaryPropertyStaticFiltersDefinition,
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
    ...summaryPropertyStaticFiltersDefinition,
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
    ...summaryPropertyStaticFiltersDefinition,
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
    ...summaryPropertyStaticFiltersDefinition,
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
