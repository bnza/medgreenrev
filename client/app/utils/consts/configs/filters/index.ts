import type { GetCollectionPath } from '~~/types'
import type { ResourceStaticFiltersDefinitionObject } from '~~/types/filters'
import * as resourceFilterDefinitions from './resources'
export { type FilterKey, API_FILTERS } from './definitions'

export type SearchableGetCollectionPath = Extract<
  GetCollectionPath,
  | '/api/data/analyses'
  | '/api/data/analyses/botany/charcoals'
  | '/api/data/analyses/botany/seeds'
  | '/api/data/analyses/contexts/botany'
  | '/api/data/analyses/individuals'
  | '/api/data/analyses/samples/microstratigraphy'
  | '/api/data/analyses/{parentId}/samples/microstratigraphy'
  | '/api/data/botany/charcoals'
  | '/api/data/botany/charcoals/{parentId}/analyses'
  | '/api/data/botany/seeds'
  | '/api/data/botany/seeds/{parentId}/analyses'
  | '/api/data/analyses/contexts/zoo'
  | '/api/data/analyses/potteries'
  | '/api/data/analyses/zoo/bones'
  | '/api/data/analyses/zoo/teeth'
  | '/api/data/context_stratigraphic_units'
  | '/api/data/contexts/{parentId}/stratigraphic_units'
  | '/api/data/history/animals'
  | '/api/data/history/locations/{parentId}/animals'
  | '/api/data/history/plants'
  | '/api/data/history/locations/{parentId}/plants'
  | '/api/data/individuals/{parentId}/analyses'
  | '/api/data/contexts'
  | '/api/data/contexts/{parentId}/analyses/botany'
  | '/api/data/contexts/{parentId}/analyses/zoo'
  | '/api/data/individuals'
  | '/api/data/media_objects'
  | '/api/data/microstratigraphic_units'
  | '/api/data/potteries'
  | '/api/data/potteries/{parentId}/analyses'
  | '/api/data/samples'
  | '/api/data/samples/{parentId}/analyses/microstratigraphy'
  | '/api/data/samples/{parentId}/microstratigraphic_units'
  | '/api/data/samples/{parentId}/stratigraphic_units'
  | '/api/data/sample_stratigraphic_units'
  | '/api/data/sites'
  | '/api/data/sites/{parentId}/stratigraphic_units'
  | '/api/data/sites/{parentId}/contexts'
  | '/api/data/sites/{parentId}/samples'
  | '/api/data/stratigraphic_units'
  | '/api/data/stratigraphic_units/{parentId}/analyses/samples/microstratigraphy'
  | '/api/data/stratigraphic_units/{parentId}/botany/charcoals'
  | '/api/data/stratigraphic_units/{parentId}/botany/seeds'
  | '/api/data/stratigraphic_units/{parentId}/contexts'
  | '/api/data/stratigraphic_units/{parentId}/individuals'
  | '/api/data/stratigraphic_units/{parentId}/microstratigraphic_units'
  | '/api/data/stratigraphic_units/{parentId}/potteries'
  | '/api/data/stratigraphic_units/{parentId}/samples'
  | '/api/data/stratigraphic_units/{parentId}/zoo/bones'
  | '/api/data/stratigraphic_units/{parentId}/zoo/teeth'
  | '/api/data/vocabulary/history/locations'
  | '/api/data/zoo/bones'
  | '/api/data/zoo/bones/{parentId}/analyses'
  | '/api/data/zoo/teeth'
  | '/api/data/zoo/teeth/{parentId}/analyses'
>

export const FILTERS_PATHS_MAP: Record<
  SearchableGetCollectionPath,
  ResourceStaticFiltersDefinitionObject
> = {
  '/api/data/analyses': resourceFilterDefinitions.analysis,
  '/api/data/analyses/botany/charcoals':
    resourceFilterDefinitions.analysisBotany,
  '/api/data/analyses/botany/seeds': resourceFilterDefinitions.analysisBotany,
  '/api/data/analyses/contexts/botany':
    resourceFilterDefinitions.analysisContextBotany,
  '/api/data/analyses/contexts/zoo':
    resourceFilterDefinitions.analysisContextZoo,
  '/api/data/analyses/individuals':
    resourceFilterDefinitions.analysisIndividual,
  '/api/data/analyses/potteries': resourceFilterDefinitions.analysisPottery,
  '/api/data/analyses/samples/microstratigraphy':
    resourceFilterDefinitions.analysisSampleMicrostratigraphicUnit,
  '/api/data/analyses/zoo/bones': resourceFilterDefinitions.analysisZooBone,
  '/api/data/analyses/zoo/teeth': resourceFilterDefinitions.analysisZooTooth,
  '/api/data/analyses/{parentId}/samples/microstratigraphy':
    resourceFilterDefinitions.analysisSampleMicrostratigraphicUnitParentAnalysis,
  '/api/data/botany/charcoals': resourceFilterDefinitions.botany,
  '/api/data/botany/charcoals/{parentId}/analyses':
    resourceFilterDefinitions.analysisBotanyParentSubject,
  '/api/data/botany/seeds': resourceFilterDefinitions.botany,
  '/api/data/botany/seeds/{parentId}/analyses':
    resourceFilterDefinitions.analysisBotanyParentSubject,
  '/api/data/contexts': resourceFilterDefinitions.context,
  '/api/data/contexts/{parentId}/analyses/botany':
    resourceFilterDefinitions.analysisContextBotanyParentSubject,
  '/api/data/contexts/{parentId}/analyses/zoo':
    resourceFilterDefinitions.analysisContextZooParentSubject,
  '/api/data/contexts/{parentId}/stratigraphic_units':
    resourceFilterDefinitions.contextStratigraphicUnitParentContext,
  '/api/data/context_stratigraphic_units':
    resourceFilterDefinitions.contextStratigraphicUnit,
  '/api/data/history/animals': resourceFilterDefinitions.historyAnimal,
  '/api/data/vocabulary/history/locations':
    resourceFilterDefinitions.historyLocation,
  '/api/data/history/locations/{parentId}/animals':
    resourceFilterDefinitions.historyAnimal,
  '/api/data/history/plants': resourceFilterDefinitions.historyPlant,
  '/api/data/history/locations/{parentId}/plants':
    resourceFilterDefinitions.historyPlant,
  '/api/data/individuals': resourceFilterDefinitions.individual,
  '/api/data/individuals/{parentId}/analyses':
    resourceFilterDefinitions.analysisIndividualParentSubject,
  '/api/data/media_objects': resourceFilterDefinitions.mediaObject,
  '/api/data/microstratigraphic_units':
    resourceFilterDefinitions.microstratigraphicUnit,
  '/api/data/potteries': resourceFilterDefinitions.pottery,
  '/api/data/potteries/{parentId}/analyses':
    resourceFilterDefinitions.analysisPotteryParentSubject,
  '/api/data/samples': resourceFilterDefinitions.sample,
  '/api/data/samples/{parentId}/analyses/microstratigraphy':
    resourceFilterDefinitions.analysisSampleMicrostratigraphicUnitParentSubject,
  '/api/data/samples/{parentId}/microstratigraphic_units':
    resourceFilterDefinitions.microstratigraphicUnitParentStratigraphicUnit,
  '/api/data/samples/{parentId}/stratigraphic_units':
    resourceFilterDefinitions.sampleStratigraphicUnitParentSample,
  '/api/data/sample_stratigraphic_units':
    resourceFilterDefinitions.sampleStratigraphicUnit,
  '/api/data/sites': resourceFilterDefinitions.site,
  '/api/data/sites/{parentId}/contexts': resourceFilterDefinitions.context,
  '/api/data/sites/{parentId}/samples': resourceFilterDefinitions.sample,
  '/api/data/sites/{parentId}/stratigraphic_units':
    resourceFilterDefinitions.stratigraphicUnit,
  '/api/data/stratigraphic_units': resourceFilterDefinitions.stratigraphicUnit,
  '/api/data/stratigraphic_units/{parentId}/analyses/samples/microstratigraphy':
    resourceFilterDefinitions.analysisSampleMicrostratigraphicUnit,
  '/api/data/stratigraphic_units/{parentId}/botany/charcoals':
    resourceFilterDefinitions.botanyParentStratigraphicUnit,
  '/api/data/stratigraphic_units/{parentId}/botany/seeds':
    resourceFilterDefinitions.botanyParentStratigraphicUnit,
  '/api/data/stratigraphic_units/{parentId}/contexts':
    resourceFilterDefinitions.contextStratigraphicUnitParentStratigraphicUnit,
  '/api/data/stratigraphic_units/{parentId}/individuals':
    resourceFilterDefinitions.individualParentStratigraphicUnit,
  '/api/data/stratigraphic_units/{parentId}/microstratigraphic_units':
    resourceFilterDefinitions.microstratigraphicUnitParentStratigraphicUnit,
  '/api/data/stratigraphic_units/{parentId}/potteries':
    resourceFilterDefinitions.potteryParentStratigraphicUnit,
  '/api/data/stratigraphic_units/{parentId}/samples':
    resourceFilterDefinitions.sampleStratigraphicUnitParentStratigraphicUnit,
  '/api/data/stratigraphic_units/{parentId}/zoo/bones':
    resourceFilterDefinitions.zooBoneParentStratigraphicUnit,
  '/api/data/stratigraphic_units/{parentId}/zoo/teeth':
    resourceFilterDefinitions.zooToothParentStratigraphicUnit,
  '/api/data/zoo/bones': resourceFilterDefinitions.zooBone,
  '/api/data/zoo/bones/{parentId}/analyses':
    resourceFilterDefinitions.analysisZooBoneParentSubject,
  '/api/data/zoo/teeth': resourceFilterDefinitions.zooTooth,
  '/api/data/zoo/teeth/{parentId}/analyses':
    resourceFilterDefinitions.analysisZooToothParentSubject,
} as const

export const isSearchableGetCollectionPath = (
  value: unknown,
): value is SearchableGetCollectionPath =>
  typeof value === 'string' && value in FILTERS_PATHS_MAP
