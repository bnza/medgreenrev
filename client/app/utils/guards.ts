import {ApiRole} from '~/utils/consts/auth'

export const isAppRole = (value: unknown): value is ApiRole =>
  typeof value === 'string' && Object.values<string>(ApiRole).includes(value)
