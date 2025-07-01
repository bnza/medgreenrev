import {ApiRole} from '~/utils/consts/auth'
import type {ApiResourceKey} from "~~/types";
import {API_RESOURCE_MAP} from "~/utils/consts/resources";

export const isAppRole = (value: unknown): value is ApiRole =>
  typeof value === 'string' && Object.values<string>(ApiRole).includes(value)

export const isApiResourceKey = (value: unknown): value is ApiResourceKey =>
  typeof value === 'string' && Object.keys(API_RESOURCE_MAP).includes(value)
