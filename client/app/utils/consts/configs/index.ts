import * as absDatingAnalysis from './data/absDatingAnalysis'
import analysis from './data/analysis'
import analysisBotanyCharcoal from './data/analysisBotanyCharcoal'
import analysisBotanySeed from './data/analysisBotanySeed'
import analysisContextBotany from './data/analysisContextBotany'
import analysisContextZoo from './data/analysisContextZoo'
import analysisIndividual from './data/analysisIndividual'
import analysisPottery from './data/analysisPottery'
import analysisSampleMicrostratigraphy from './data/analysisSampleMicrostratigraphy'
import analysisSiteAnthropology from './data/analysisSiteAnthropology'
import analysisSubject from './data/analysisSubject'
import analysisZooBone from './data/analysisZooBone'
import analysisZooTooth from './data/analysisZooTooth'
import archaeologicalSite from './data/archaeologicalSite'
import botanyCharcoal from './data/botanyCharcoal'
import botanySeed from './data/botanySeed'
import context from './data/context'
import * as contextStratigraphicUnit from './data/contextStratigraphicUnit'
import currentUserSitePrivilege from './data/currentUserSitePrivilege'
import historyAnimal from './data/historyAnimal'
import historyPlant from './data/historyPlant'
import individual from './data/individual'
import mediaObject from './data/mediaObject'
import microstratigraphicUnit from './data/microstratigraphicUnit'
import paleoclimateSample from './data/paleoclimateSample'
import paleoclimateSamplingSite from './data/paleoclimateSamplingSite'
import pottery from './data/pottery'
import sample from './data/sample'
import * as sampleStratigraphicUnit from './data/sampleStratigraphicUnit'
import samplingSite from './data/samplingSite'
import samplingStratigraphicUnit from './data/samplingStratigraphicUnit'
import sedimentCore from './data/sedimentCore'
import * as sedimentCoreDepth from './data/sedimentCoreDepth'
import siteUserPrivilege from './data/siteUserPrivilege'
import stratigraphicUnit from './data/stratigraphicUnit'
import user from './data/user'
import vocBotanyTaxonomy from './data/vocBotanyTaxonomy'
import vocHistoryAnimal from './data/vocHistoryAnimal'
import vocHistoryLocation from './data/vocHistoryLocation'
import vocHistoryPlant from './data/vocHistoryPlant'
import vocZooTaxonomy from './data/vocZooTaxonomy'
import zooBone from './data/zooBone'
import zooTooth from './data/zooTooth'
import type { ResourceConfig, GetCollectionPath } from '~~/types'

export const RESOURCE_CONFIG_MAP = {
  '/api/admin/site_user_privileges': siteUserPrivilege,
  '/api/admin/users': user,
  '/api/admin/users/me/site_user_privileges': currentUserSitePrivilege,

  '/api/data/analyses': analysis,
  '/api/data/analyses/absolute_dating': absDatingAnalysis.default,
  '/api/data/analyses/absolute_dating/botany/charcoals':
    absDatingAnalysis.absDatingAnalysisBotanyCharcoal,
  '/api/data/analyses/absolute_dating/botany/seeds':
    absDatingAnalysis.absDatingAnalysisBotanySeed,
  '/api/data/analyses/absolute_dating/individuals':
    absDatingAnalysis.absDatingAnalysisIndividual,
  '/api/data/analyses/absolute_dating/potteries':
    absDatingAnalysis.absDatingAnalysisPottery,
  '/api/data/analyses/absolute_dating/zoo/bones':
    absDatingAnalysis.absDatingAnalysisZooBone,
  '/api/data/analyses/absolute_dating/zoo/teeth':
    absDatingAnalysis.absDatingAnalysisZooTooth,
  '/api/data/analyses/botany/charcoals': analysisBotanyCharcoal,
  '/api/data/analyses/botany/seeds': analysisBotanySeed,
  '/api/data/analyses/contexts/botany': analysisContextBotany,
  '/api/data/analyses/contexts/zoo': analysisContextZoo,
  '/api/data/analyses/individuals': analysisIndividual,
  '/api/data/analyses/potteries': analysisPottery,
  '/api/data/analyses/samples/microstratigraphy':
    analysisSampleMicrostratigraphy,
  '/api/data/analyses/archaeological_sites/anthropology':
    analysisSiteAnthropology,
  '/api/data/analyses/zoo/bones': analysisZooBone,
  '/api/data/analyses/zoo/teeth': analysisZooTooth,
  '/api/data/analyses/{parentId}/subjects': analysisSubject,

  '/api/data/archaeological_sites': archaeologicalSite,

  '/api/data/botany/charcoals': botanyCharcoal,
  '/api/data/botany/charcoals/{parentId}/analyses': analysisBotanyCharcoal,
  '/api/data/botany/seeds': botanySeed,
  '/api/data/botany/seeds/{parentId}/analyses': analysisBotanySeed,

  '/api/data/context_stratigraphic_units': contextStratigraphicUnit.config,
  '/api/data/contexts': context,
  '/api/data/contexts/{parentId}/analyses/botany': analysisContextBotany,
  '/api/data/contexts/{parentId}/analyses/zoo': analysisContextZoo,
  '/api/data/contexts/{parentId}/stratigraphic_units':
    contextStratigraphicUnit.stratigraphicUnitSubResourceConfig,

  '/api/data/history/animals': historyAnimal,
  '/api/data/history/plants': historyPlant,

  '/api/data/individuals': individual,
  '/api/data/individuals/{parentId}/analyses': analysisIndividual,

  '/api/data/media_objects': mediaObject,

  '/api/data/microstratigraphic_units': microstratigraphicUnit,

  '/api/data/paleoclimate_samples': paleoclimateSample,

  '/api/data/paleoclimate_sampling_sites': paleoclimateSamplingSite,
  '/api/data/paleoclimate_sampling_sites/{parentId}/samples':
    paleoclimateSample,

  '/api/data/potteries': pottery,

  '/api/data/sample_stratigraphic_units': sampleStratigraphicUnit.config,
  '/api/data/samples': sample,
  '/api/data/samples/{parentId}/stratigraphic_units':
    sampleStratigraphicUnit.stratigraphicUnitSubResourceConfig,

  '/api/data/sampling_sites': samplingSite,

  '/api/data/sediment_core_depths': sedimentCoreDepth.config,
  '/api/data/sediment_cores': sedimentCore,
  '/api/data/sediment_cores/{parentId}/stratigraphic_units/depths':
    sedimentCoreDepth.stratigraphicUnitSubResourceConfig,

  '/api/data/sampling_stratigraphic_units': samplingStratigraphicUnit,

  '/api/data/stratigraphic_units': stratigraphicUnit,
  '/api/data/stratigraphic_units/{parentId}/contexts':
    contextStratigraphicUnit.contextSubResourceConfig,
  '/api/data/stratigraphic_units/{parentId}/microstratigraphic_units':
    microstratigraphicUnit,
  '/api/data/stratigraphic_units/{parentId}/samples':
    sampleStratigraphicUnit.sampleSubResourceConfig,
  '/api/data/stratigraphic_units/{parentId}/sediment_cores/depths':
    sedimentCoreDepth.sedimentCoreSubResourceConfig,
  '/api/data/stratigraphic_units/{parentId}/zoo/bones': zooBone,
  '/api/data/stratigraphic_units/{parentId}/zoo/teeth': zooTooth,

  '/api/data/vocabulary/botany/taxonomies': vocBotanyTaxonomy,
  '/api/data/vocabulary/history/animals': vocHistoryAnimal,
  '/api/data/vocabulary/history/locations': vocHistoryLocation,
  '/api/data/vocabulary/history/plants': vocHistoryPlant,
  '/api/data/vocabulary/zoo/taxonomies': vocZooTaxonomy,

  '/api/data/zoo/bones': zooBone,
  '/api/data/zoo/bones/{parentId}/analyses': analysisZooBone,
  '/api/data/zoo/teeth': zooTooth,
  '/api/data/zoo/teeth/{parentId}/analyses': analysisZooTooth,

  '/api/vocabulary/botany/taxonomies': vocBotanyTaxonomy,
  '/api/vocabulary/history/animals': vocHistoryAnimal,
  '/api/vocabulary/history/locations': vocHistoryLocation,
  '/api/vocabulary/history/plants': vocHistoryPlant,
  '/api/vocabulary/zoo/taxonomies': vocZooTaxonomy,
} as const satisfies Partial<Record<GetCollectionPath, ResourceConfig>>
