import { ApiRole, ROLE_COLORS } from '~/utils/consts/auth'

import { reduceAppRoles } from '~/utils/acl'
import type { CollectionAcl, GetItemResponseMap } from '~~/types'

export default function useAppAuth() {
  const { data, status } = useAuthState()
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
  const hasRole = (role: ApiRole) => computed(() => hasRoleFn(role))
  const hasRoleAdmin = computed(() => hasRoleFn(ApiRole.Admin))

  const canCreateSite = computed(
    () => hasRoleFn(ApiRole.Admin) || hasRoleFn(ApiRole.Editor),
  )

  const isCurrentUser = computed(
    () => (identifier: string) =>
      isAuthenticated.value && userIdentifier.value === identifier,
  )

  type CreatedBy = GetItemResponseMap['/api/data/sites/{id}']['createdBy']
  const isSiteAdmin = (site: { createdBy?: CreatedBy }) => {
    const result = computed(
      () =>
        isAuthenticated.value &&
        (hasRole(ApiRole.Admin).value ||
          (hasRole(ApiRole.Editor).value &&
            site.createdBy?.userIdentifier === userIdentifier.value)),
    )
    return result.value
  }

  const hasAnySitePrivilege = computed(() =>
    data.value?.sitePrivileges
      ? Object.keys(data.value.sitePrivileges).length > 0
      : false,
  )

  const hasSitePrivilege = computed(
    () => (siteId: number) =>
      hasRoleAdmin.value || Boolean(data.value?.sitePrivileges?.[siteId]),
  )

  const siteCollectionAcl = computed<CollectionAcl>(() => ({
    canCreate: canCreateSite.value,
    canExport: isAuthenticated.value,
  }))

  return {
    hasRoleAdmin,
    hasRole,
    hasAnySitePrivilege,
    hasSitePrivilege,
    isAuthenticated,
    isCurrentUser,
    isSiteAdmin,
    roles,
    roleColor,
    siteCollectionAcl,
    userIdentifier,
  }
}
