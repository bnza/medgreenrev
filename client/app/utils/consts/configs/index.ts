import currentUserSitePrivilege from './data/currentUserSitePrivilege'
import site from './data/site'
import siteUserPrivilege from './data/siteUserPrivilege'
import user from './data/user'
import type { ResourceConfig } from '~~/types'

const RESOURCE_CONFIG_MAP_INTERNAL = {
  '/api/sites': site,
  '/api/site_user_privileges': siteUserPrivilege,
  '/api/users': user,
  '/api/users/me/site_user_privileges': currentUserSitePrivilege,
} as const
export const RESOURCE_CONFIG_MAP: Readonly<
  Record<keyof typeof RESOURCE_CONFIG_MAP_INTERNAL, ResourceConfig>
> = RESOURCE_CONFIG_MAP_INTERNAL as any
