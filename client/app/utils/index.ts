import { RESOURCE_CONFIG_MAP } from '~/utils/consts/configs'
import type { ApiResourceKey } from '~/utils/consts/resources'

export * from './validation'
export * from './guards'

export const getApiResourceConfig = (key: ApiResourceKey) =>
  RESOURCE_CONFIG_MAP[key]

export const isAppPathItemPage = (path: string): boolean => {
  const uuidV4Pattern =
    /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i
  const digitsPattern = /\d+$/
  return digitsPattern.test(path) || uuidV4Pattern.test(path)
}

export const isTemplatePathItemPage = (path: string): boolean => {
  const templatePattern = /\{[a-zA-Z]+}$/
  return templatePattern.test(path)
}
