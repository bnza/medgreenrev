import { ApiRole, ApiSpecialistRole, ROLE_HIERARCHY } from '~/utils/consts/auth'
import { isAppRole, isSpecialistRole } from '~/utils/guards'

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
