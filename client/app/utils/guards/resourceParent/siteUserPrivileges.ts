import type { GetItemResponseMap } from '~~/types'

export type ResourceParentSite = [
  'site',
  '/api/data/archaeological_sites/{id}',
  GetItemResponseMap['/api/data/archaeological_sites/{id}'],
]
export type ResourceParentUser = [
  'user',
  '/api/admin/users/{id}',
  GetItemResponseMap['/api/admin/users/{id}'],
]

export type ResourceParentSiteUserPrivilege =
  | ResourceParentSite
  | ResourceParentUser

export function isResourceParentUser(
  parent?: ResourceParentUser | any,
): parent is ResourceParentUser {
  return parent?.[0] === 'user'
}

export function isResourceParentSite(
  parent?: ResourceParentSite | any,
): parent is ResourceParentSite {
  return parent?.[0] === 'site'
}
