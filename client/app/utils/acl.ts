import {
  ApiRole,
  ApiSiteRole,
  ApiSiteRoleKey,
  type ApiSpecialistRole,
  ROLE_HIERARCHY,
  SITES_ROLE_COLORS,
} from '~/utils/consts/auth'
import type { ApiAclResource, BaseAcl } from '~~/types'

const getRoleHierarchyValue = (role: ApiRole | ''): number =>
  role ? ROLE_HIERARCHY[role] : 0

export const reduceAppRoles = (roles: Array<string>) =>
  roles
    .filter(isAppRole)
    .reduce(
      (acc: ApiRole | '', curr) =>
        getRoleHierarchyValue(curr) > getRoleHierarchyValue(acc) ? curr : acc,
      '',
    )

const removeAppRoles = (roles: Array<ApiSpecialistRole | ApiRole>) => {
  return roles.filter(isSpecialistRole)
}
const expandAppRole = (role: ApiRole) =>
  Object.values(ApiRole).filter(
    (curRole) => getRoleHierarchyValue(curRole) <= getRoleHierarchyValue(role),
  )
export const mergeRole = (
  role: string,
  roles: Array<ApiRole | ApiSpecialistRole>,
) => {
  if (!isAppRole(role)) {
    console.warn(`Role ${role} is not an app role`)
    return roles
  }
  const _roles = removeAppRoles(roles)
  const _expandedRoles = expandAppRole(role)
  return [..._roles, ..._expandedRoles]
}

// Sites roles handling
export const getSitePrivilegeKey = (
  privilegeNumber: number,
): string | undefined => {
  return ApiSiteRoleKey[privilegeNumber]
}

export const getSitePrivilegeRole = (
  privilegeNumber: number,
): ApiSiteRole | undefined => {
  const key = ApiSiteRoleKey[privilegeNumber]
  if (!key || !(key in ApiSiteRole)) {
    return undefined
  }
  return ApiSiteRole[key as keyof typeof ApiSiteRole]
}

export const getSitePrivilegeColor = (sitePrivileges: number) => {
  const role = getSitePrivilegeRole(sitePrivileges) || ApiSiteRole.User
  return SITES_ROLE_COLORS[role]
}

export const hasAcl = (
  item: unknown,
  acl: keyof BaseAcl,
): item is ApiAclResource =>
  isPlainObject(item) &&
  isPlainObject(item._acl) &&
  (acl as string) in item._acl
