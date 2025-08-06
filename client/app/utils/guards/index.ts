import { ApiRole, ApiSpecialistRole } from '~/utils/consts/auth'
import type {
  ApiResourceKey,
  HydraConstraintViolation,
  Iri,
  JsonLdItem,
  UserBaseData,
} from '~~/types'
import {
  API_RESOURCE_MAP,
  type ApiResourcePath,
} from '~/utils/consts/resources'
import { isAppPathItemPage } from '~/utils'

export const isApiResourceKey = (value: unknown): value is ApiResourceKey =>
  typeof value === 'string' && Object.keys(API_RESOURCE_MAP).includes(value)

export const isString = (val: unknown): val is string => typeof val === 'string'
export const isNumber = (val: unknown): val is number => typeof val === 'number'
export const isBoolean = (val: unknown): val is boolean =>
  typeof val === 'boolean'

export const isObject = (value: unknown): value is object =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const isPlainObject = (
  value: unknown,
): value is Record<string, unknown> => {
  if (!isObject(value)) {
    return false
  }

  // Check if it's a plain object (created by {} or new Object())
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false
  }

  // Check if it has Object.prototype as its prototype or no prototype
  const proto = Object.getPrototypeOf(value)
  return proto === null || proto === Object.prototype
}

export const isJsonLdItem = (value: unknown): value is JsonLdItem =>
  isPlainObject(value) && '@id' in value && '@type' in value

export const isPlainObjectWithValues = <T>(
  value: unknown,
  valueValidator: (val: unknown) => val is T,
): value is Record<string, T> =>
  isPlainObject(value) && Object.values(value).every(valueValidator)

export const isPlainObjectWithStringValues = (value: unknown) =>
  isPlainObjectWithValues<string>(value, isString)

export const isApiResourcePath = (value: unknown): value is ApiResourcePath => {
  return (
    isString(value) && Object.values<string>(API_RESOURCE_MAP).includes(value)
  )
}

export const isAppRole = (value: unknown): value is ApiRole =>
  isString(value) && Object.values<string>(ApiRole).includes(value)

export const isSpecialistRole = (value: unknown): value is ApiSpecialistRole =>
  isString(value) && Object.values<string>(ApiSpecialistRole).includes(value)

export const isRole = (
  value: unknown,
): value is ApiRole | ApiSpecialistRole => {
  return isAppRole(value) || isSpecialistRole(value)
}

export const isValidUserBaseData = (value: unknown): value is UserBaseData =>
  isPlainObject(value) && 'id' in value && 'email' in value

export const isValidIri = (value: unknown): value is Iri =>
  isString(value) && isAppPathItemPage(value)

export const isApiResourceObject = (
  value: unknown,
): value is { '@id': string } =>
  isObject(value) && '@id' in value && isString(value['@id'])

export function isHydraConstraintViolation(
  data: unknown,
): data is HydraConstraintViolation {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    (data as any).status === 422 &&
    'violations' in data &&
    Array.isArray((data as any).violations)
  )
}

export function isFetchError(
  error: unknown,
): error is { data: unknown; status: number } & Error {
  return (
    error instanceof Error &&
    error.constructor.name === 'FetchError' &&
    'data' in error &&
    'status' in error
  )
}
