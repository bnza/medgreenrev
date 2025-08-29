import type { ApiResourceKey, API_RESOURCE_MAP } from '~/utils/consts/resources'
import type { ReadonlyHeaders } from '~~/types/vuetify'

export type ApiDataResourceKey = Exclude<ApiResourceKey, never>

const CONFIGURABLE_RESOURCE_MAP = {
  ...API_RESOURCE_MAP,
  ...{
    currentUserSitePrivileges: '/api/admin/users/me/site_user_privileges',
  },
} as const

export type ConfigurableApiResourceKey = keyof typeof CONFIGURABLE_RESOURCE_MAP

export type ConfigurableApiResourcePath =
  (typeof API_RESOURCE_MAP)[keyof typeof CONFIGURABLE_RESOURCE_MAP]

export type ResourceConfig = {
  apiPath: ConfigurableApiResourcePath
  appPath: string
  name: ConfigurableApiResourceKey
  labels: [string, string]
  protectedFields?: string[]
  defaultHeaders: ReadonlyHeaders[]
}

export type StratigraphicUnitRelationshipKey =
  | 'c'
  | 'C'
  | 'e'
  | 'f'
  | 'F'
  | 'x'
  | 'X'

const STRATIGRAPHIC_UNIT_RELATIONSHIP_MAP: Record<
  StratigraphicUnitRelationshipKey,
  string
> = {
  c: 'cover to',
  C: 'covered by',
  e: 'same as',
  f: 'fill to',
  F: 'filled by',
  x: 'cuts',
  X: 'cut by',
} as const
