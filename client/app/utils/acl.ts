import { type ApiRole, ROLE_HIERARCHY } from '~/utils/consts/auth'
import { isAppRole } from '~/utils/guards'

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
