import { COLORS } from '~/utils/consts/colors'
import type { BaseAcl } from '~~/types'

export enum ApiRole {
  Admin = 'ROLE_ADMIN',
  Editor = 'ROLE_EDITOR',
  User = 'ROLE_USER',
}

export enum AclVoters {
  HasRoleAdmin = 'HasRoleAdmin',
  HasRoleEditor = 'HasRoleEditor',
}

export const ROLE_COLORS = {
  [ApiRole.Admin]: COLORS.error,
  [ApiRole.Editor]: COLORS.warning,
  [ApiRole.User]: COLORS.success,
} as const satisfies Record<ApiRole, string>

export const ROLE_HIERARCHY = {
  [ApiRole.Admin]: 1000,
  [ApiRole.Editor]: 100,
  [ApiRole.User]: 10,
} as const satisfies Record<ApiRole, number>

export const defaultBaseAcl = {
  canRead: true,
  canUpdate: false,
  canDelete: false,
} as const satisfies BaseAcl
