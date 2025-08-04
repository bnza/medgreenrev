import currentUserSitePrivilege from './data/currentUserSitePrivilege'
import * as contextStratigraphicUnit from './data/contextStratigraphicUnit'
import context from './data/context'
import site from './data/site'
import siteUserPrivilege from './data/siteUserPrivilege'
import stratigraphicUnit from './data/stratigraphicUnit'
import user from './data/user'
import type { ResourceConfig } from '~~/types'

const RESOURCE_CONFIG_MAP_INTERNAL = {
  '/api/context_stratigraphic_units': contextStratigraphicUnit.config,
  '/api/data_contexts': context,
  '/api/data_contexts/{parentId}/stratigraphic_units':
    contextStratigraphicUnit.stratigraphicUnitSubResourceConfig,
  '/api/sites': site,
  '/api/site_user_privileges': siteUserPrivilege,
  '/api/stratigraphic_units': stratigraphicUnit,
  '/api/stratigraphic_units/{parentId}/data_contexts':
    contextStratigraphicUnit.contextSubResourceConfig,
  '/api/users': user,
  '/api/users/me/site_user_privileges': currentUserSitePrivilege,
} as const
export const RESOURCE_CONFIG_MAP: Readonly<
  Record<keyof typeof RESOURCE_CONFIG_MAP_INTERNAL, ResourceConfig>
> = RESOURCE_CONFIG_MAP_INTERNAL as any
