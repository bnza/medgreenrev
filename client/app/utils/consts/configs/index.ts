import analysis from './data/analysis'
import analysisContextZoo from './data/analysisContextZoo'
import analysisPottery from './data/analysisPottery'
import analysisZooBone from './data/analysisZooBone'
import analysisZooTooth from './data/analysisZooTooth'
import currentUserSitePrivilege from './data/currentUserSitePrivilege'
import context from './data/context'
import * as contextStratigraphicUnit from './data/contextStratigraphicUnit'
import * as sampleStratigraphicUnit from './data/sampleStratigraphicUnit'
import mediaObject from './data/mediaObject'
import pottery from './data/pottery'
import sample from './data/sample'
import site from './data/site'
import siteUserPrivilege from './data/siteUserPrivilege'
import stratigraphicUnit from './data/stratigraphicUnit'
import user from './data/user'
import zooBone from './data/zooBone'
import zooTooth from './data/zooTooth'
import type { ResourceConfig } from '~~/types'

const RESOURCE_CONFIG_MAP_INTERNAL = {
  '/api/data/analyses': analysis,
  '/api/data/analyses/contexts/zoo': analysisContextZoo,
  '/api/data/analyses/potteries': analysisPottery,
  '/api/data/analyses/zoo/bones': analysisZooBone,
  '/api/data/analyses/zoo/teeth': analysisZooTooth,
  '/api/data/context_stratigraphic_units': contextStratigraphicUnit.config,
  '/api/data/media_objects': mediaObject,
  '/api/data/sample_stratigraphic_units': sampleStratigraphicUnit.config,
  '/api/data/contexts': context,
  '/contexts/{parentId}/analyses/zoo': analysisContextZoo,
  '/api/data/contexts/{parentId}/stratigraphic_units':
    contextStratigraphicUnit.stratigraphicUnitSubResourceConfig,
  '/api/data/stratigraphic_units/{parentId}/samples':
    sampleStratigraphicUnit.sampleSubResourceConfig,
  '/api/data/potteries': pottery,
  '/api/data/samples': sample,
  '/api/data/samples/{parentId}/stratigraphic_units':
    sampleStratigraphicUnit.stratigraphicUnitSubResourceConfig,
  '/api/data/sites': site,
  '/api/admin/site_user_privileges': siteUserPrivilege,
  '/api/data/stratigraphic_units': stratigraphicUnit,
  '/api/data/stratigraphic_units/{parentId}/contexts':
    contextStratigraphicUnit.contextSubResourceConfig,
  '/api/data/stratigraphic_units/{parentId}/zoo/bones': zooBone,
  '/api/data/stratigraphic_units/{parentId}/zoo/teeth': zooTooth,
  '/api/admin/users': user,
  '/api/admin/users/me/site_user_privileges': currentUserSitePrivilege,
  '/api/data/zoo/bones': zooBone,
  '/api/data/zoo/bones/{parentId}/analyses': analysisZooBone,
  '/api/data/zoo/teeth': zooTooth,
  '/api/data/zoo/teeth/{parentId}/analyses': analysisZooTooth,
} as const
export const RESOURCE_CONFIG_MAP: Readonly<
  Record<keyof typeof RESOURCE_CONFIG_MAP_INTERNAL, ResourceConfig>
> = RESOURCE_CONFIG_MAP_INTERNAL as any
