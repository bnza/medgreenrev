import { ApiRole } from '~/utils/consts/auth'

import { getRoleColor } from '~/utils/acl'
import type { CollectionAcl, GetItemResponseMap } from '~~/types'

export default function useAppAuth() {
  const { data, status } = useAuthState()
  const isAuthenticated = computed(() => status.value === 'authenticated')
  const userIdentifier = computed(() => data.value?.email)

  const roles = computed(() =>
    isAuthenticated.value ? data.value?.roles || [] : [],
  )

  const roleColor = computed(() => getRoleColor(roles.value))

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
      hasRoleAdmin.value ||
      typeof data.value?.sitePrivileges?.[siteId] !== 'undefined',
  )

  const siteCollectionAcl = computed<CollectionAcl>(() => ({
    canCreate: canCreateSite.value,
    canExport: isAuthenticated.value,
  }))

  const hasSpecialistRole = (role: ApiSpecialistRole) =>
    computed(() => roles.value.includes(role))

  return {
    hasRoleAdmin,
    hasRole,
    hasSpecialistRole,
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
