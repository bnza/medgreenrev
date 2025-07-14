import { ApiRole, ROLE_COLORS } from '~/utils/consts/auth'

import { reduceAppRoles } from '~/utils/acl'
import type { CollectionAcl } from '~~/types'

export default function useAppAuth() {
  const { data, status } = useAuth()
  const isAuthenticated = computed(() => status.value === 'authenticated')
  const userIdentifier = computed(() => data.value?.email)

  const roles = computed(() =>
    isAuthenticated.value ? data.value?.roles || [] : [],
  )

  const roleColor = computed(() => {
    const role = reduceAppRoles(roles.value)
    return isAppRole(role) ? ROLE_COLORS[role] : '#FFF'
  })

  const hasRoleFn = (role: ApiRole) => roles.value.includes(role)
  const hasRole = computed(() => hasRoleFn)
  const hasRoleAdmin = computed(() => hasRoleFn(ApiRole.Admin))

  const canCreateSite = computed(
    () => hasRoleFn(ApiRole.Admin) || hasRoleFn(ApiRole.Editor),
  )

  const siteCollectionAcl = computed<CollectionAcl>(() => ({
    canCreate: canCreateSite.value,
    canExport: isAuthenticated.value,
  }))

  const isCurrentUser = computed(
    () => (identifier: string) =>
      isAuthenticated.value && userIdentifier.value === identifier,
  )

  return {
    hasRoleAdmin,
    isAuthenticated,
    isCurrentUser,
    roles,
    roleColor,
    siteCollectionAcl,
    userIdentifier,
  }
}
