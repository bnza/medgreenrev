import currentUserSitePrivilege from './data/currentUserSitePrivilege'
import * as contextSample from './data/contextSample'
import * as contextStratigraphicUnit from './data/contextStratigraphicUnit'
import * as sampleStratigraphicUnit from './data/sampleStratigraphicUnit'
import context from './data/context'
import mediaObject from './data/mediaObject'
import pottery from './data/pottery'
import potteryAnalysis from './data/potteryAnalysis'
import sample from './data/sample'
import site from './data/site'
import siteUserPrivilege from './data/siteUserPrivilege'
import stratigraphicUnit from './data/stratigraphicUnit'
import user from './data/user'
import zooBone from './data/zooBone'
import zooBoneAnalysis from './data/zooBoneAnalysis'
import type { ResourceConfig } from '~~/types'

const RESOURCE_CONFIG_MAP_INTERNAL = {
  '/api/data/analyses/potteries': potteryAnalysis,
  '/api/data/analyses/zoo/bones': zooBoneAnalysis,
  '/api/data/context_samples': contextSample.config,
  '/api/data/context_stratigraphic_units': contextStratigraphicUnit.config,
  '/api/data/media_objects': mediaObject,
  '/api/data/sample_stratigraphic_units': sampleStratigraphicUnit.config,
  '/api/data/contexts': context,
  '/api/data/contexts/{parentId}/samples':
    contextSample.sampleSubResourceConfig,
  '/api/data/contexts/{parentId}/stratigraphic_units':
    contextStratigraphicUnit.stratigraphicUnitSubResourceConfig,
  '/api/data/stratigraphic_units/{parentId}/samples':
    sampleStratigraphicUnit.sampleSubResourceConfig,
  '/api/data/potteries': pottery,
  '/api/data/samples': sample,
  '/api/data/samples/{parentId}/contexts':
    contextSample.contextSubResourceConfig,
  '/api/data/samples/{parentId}/stratigraphic_units':
    sampleStratigraphicUnit.stratigraphicUnitSubResourceConfig,
  '/api/data/sites': site,
  '/api/admin/site_user_privileges': siteUserPrivilege,
  '/api/data/stratigraphic_units': stratigraphicUnit,
  '/api/data/stratigraphic_units/{parentId}/contexts':
    contextStratigraphicUnit.contextSubResourceConfig,
  '/api/admin/users': user,
  '/api/admin/users/me/site_user_privileges': currentUserSitePrivilege,
  '/api/data/zoo/bones': zooBone,
  '/api/data/zoo/bones/{parentId}/analyses': zooBoneAnalysis,
} as const
export const RESOURCE_CONFIG_MAP: Readonly<
  Record<keyof typeof RESOURCE_CONFIG_MAP_INTERNAL, ResourceConfig>
> = RESOURCE_CONFIG_MAP_INTERNAL as any

export { contextSample }
