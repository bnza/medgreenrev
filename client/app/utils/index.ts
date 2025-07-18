import { RESOURCE_CONFIG_MAP } from '~/utils/consts/configs'
import type { ApiResourceKey } from '~/utils/consts/resources'
import type { Iri } from '~~/types'

export * from './validation'
export * from './guards'

export const getApiResourceConfig = (key: ApiResourceKey) =>
  RESOURCE_CONFIG_MAP[key]

export const isAppPathItemPage = (path: string): boolean => {
  // General UUID pattern (accepts any version)
  const uuidPattern =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  // Digits pattern
  const digitsPattern = /\d+$/

  return digitsPattern.test(path) || uuidPattern.test(path)
}

export const extractIdFromIri = (iri: Iri) => {
  const parts = iri.split('/')
  const id = parts[parts.length - 1]
  if (!id) {
    throw new Error(`Invalid IRI: ${iri}`)
  }
  return id
}

export const isTemplatePathItemPage = (path: string): boolean => {
  const templatePattern = /\{[a-zA-Z]+}$/
  return templatePattern.test(path)
}
