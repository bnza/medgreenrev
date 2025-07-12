import {ApiRole} from '~/utils/consts/auth'
import type {ApiResourceKey} from "~~/types";
import {API_RESOURCE_MAP, type ApiResourcePath} from "~/utils/consts/resources";

export const isAppRole = (value: unknown): value is ApiRole =>
  typeof value === 'string' && Object.values<string>(ApiRole).includes(value)

export const isApiResourceKey = (value: unknown): value is ApiResourceKey =>
  typeof value === 'string' && Object.keys(API_RESOURCE_MAP).includes(value)

export const isString = (val: unknown): val is string => typeof val === 'string'
export const isNumber = (val: unknown): val is number => typeof val === 'number'
export const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean'

export const isObject= (value: unknown): value is object =>
  (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  )


export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
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

export const isPlainObjectWithValues = <T>(
  value: unknown,
  valueValidator: (val: unknown) => val is T
): value is Record<string, T> =>
  isPlainObject(value) && Object.values(value).every(valueValidator)

export const isPlainObjectWithStringValues = (value: unknown) => isPlainObjectWithValues<string>(value, isString)

export const isApiResourcePath = (value: unknown): value is ApiResourcePath => {
  return isString(value) && Object.values<string>(API_RESOURCE_MAP).includes(value)
}
