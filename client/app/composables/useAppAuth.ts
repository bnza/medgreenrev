import {ApiRole, ROLE_COLORS} from '~/utils/consts/auth'

import {reduceAppRoles} from "~/utils/acl";

export default function useAppAuth() {
  const {data, status} = useAuth()
  const isAuthenticated = computed(() => status.value === 'authenticated')
  const userIdentifier = computed(() => data.value?.email || null)

  const roles = computed(() =>
    isAuthenticated.value ? data.value?.roles || [] : [],
  )

  const roleColor = computed(() => {
    const role = reduceAppRoles(roles.value)
    return isAppRole(role) ? ROLE_COLORS[role] : '#FFF'
  })

  return {
    isAuthenticated,
    roles,
    roleColor,
    userIdentifier,
  }
}
