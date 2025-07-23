import type { paths, components } from './openapi'
import type { ApiResourceItemPath } from '~/utils/consts/resources'

export type ApiSpec = {
  paths
  components
  $defs
  webhooks
  operations
}
export type ApiPath = keyof paths

export type OperationPathParams<
  T extends keyof paths,
  M extends keyof paths[T],
> = T extends keyof paths
  ? paths[T][M] extends { parameters: { path: infer P } }
    ? P
    : never
  : never

export type GetCollectionPath = {
  [K in keyof paths]: paths[K] extends { get: any }
    ? paths[K]['get'] extends {
        responses: {
          200: { content: { 'application/ld+json': infer Response } }
        }
      }
      ? Response extends { member: any }
        ? K
        : never
      : never
    : never
}[keyof paths]

export type PostCollectionPath = {
  [K in keyof paths]: paths[K] extends { post: any }
    ? paths[K]['post'] extends {
        responses:
          | {
              201: { content: { 'application/ld+json': any } }
            }
          | {
              204: { content: { 'application/ld+json': any } }
            }
      }
      ? K
      : never
    : never
}[keyof paths]

export type PatchItemPath = {
  [K in keyof paths]: paths[K] extends { patch: any }
    ? paths[K]['patch'] extends {
        responses: {
          200: { content: { 'application/ld+json': any } }
        }
      }
      ? K
      : never
    : never
}[keyof paths]

export type PatchItemNoResponsePath = {
  [K in keyof paths]: paths[K] extends { patch: any }
    ? paths[K]['patch'] extends {
        responses: {
          204: any
        }
      }
      ? K
      : never
    : never
}[keyof paths]

export type DeleteItemPath = {
  [K in keyof paths]: paths[K] extends { delete: any }
    ? paths[K]['delete'] extends { responses: { 204: any } }
      ? K
      : never
    : never
}[keyof paths]

export type GetItemPath = {
  [K in keyof paths]: paths[K] extends { get: any }
    ? paths[K]['get'] extends {
        responses: {
          200: { content: { 'application/ld+json': infer Response } }
        }
      }
      ? Response extends { member: any }
        ? never
        : K
      : never
    : never
}[keyof paths]

export type GetValidationPath = {
  [K in keyof paths]: paths[K] extends { get: any }
    ? K extends `/api/validator/unique/${string}`
      ? K
      : never
    : never
}[keyof paths]

export type ValidationResponse = components['schemas']['UniqueValidator.jsonld']

export type GetCollectionResponseMap = {
  [K in GetCollectionPath]: paths[K]['get']['responses']['200']['content']['application/ld+json']
}

export type PostCollectionResponseMap = {
  [K in PostCollectionPath]: paths[K]['post']['responses']['201']['content']['application/ld+json']
}

export type PostCollectionRequestMap = {
  [K in PostCollectionPath]: paths[K]['post']['requestBody']['content']['application/ld+json']
}

export type PatchItemResponseMap = {
  [K in PatchItemPath]: paths[K]['patch']['responses']['200']['content']['application/ld+json']
}

export type PatchItemRequestMap = {
  [K in PatchItemPath]: paths[K]['patch']['requestBody']['content']['application/merge-patch+json']
}

export type GetItemResponseMap = {
  [K in GetItemPath]: paths[K]['get']['responses']['200']['content']['application/ld+json']
}

export type DeleteItemResponseMap = {
  [K in DeleteItemPath]: paths[K]['delete']['responses']['204']
}

export type ResourceParent<K extends string, P extends ApiResourceItemPath> = {
  key: K
  resourceItemPath: P
  item: GetItemResponseMap[P]
}

export type ResourceParentSiteUserPrivilege =
  | ResourceParent<'site', '/api/sites/{id}'>
  | ResourceParent<'user', '/api/users/{id}'>
