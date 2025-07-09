import type {paths} from './openapi'

// Generic helper type to filter paths by HTTP method
export type PathsWithMethod<Method extends keyof paths[keyof paths]> = {
  [K in keyof paths]: paths[K] extends { [M in Method]: any } ? K : never
}[keyof paths]

export type OperationPathParams<T extends keyof paths, M extends keyof paths[T]> =
  paths[T][M] extends { parameters: { path: infer P } } ? P : never

// Check if path parameters contain an 'id' property
type HasIdInPathParams<T> = T extends { id: any } ? true : false

// Filter paths that have GET method and don't have 'id' in path parameters
export type GetCollectionPath = {
  [K in keyof paths]: paths[K] extends { get: any }
    ? HasIdInPathParams<OperationPathParams<K, 'get'>> extends false
      ? K
      : never
    : never
}[keyof paths]

// Filter paths that have GET method and DO have 'id' in path parameters
export type GetItemPath = {
  [K in keyof paths]: paths[K] extends { get: any }
    ? HasIdInPathParams<OperationPathParams<K, 'get'>> extends true
      ? K
      : never
    : never
}[keyof paths]

// Create a response map for collection endpoints
export type GetCollectionResponseMap = {
  [K in GetCollectionPath]: paths[K]['get']['responses']['200']['content']['application/ld+json']
}

export type GetItemResponseMap = {
  [K in GetItemPath]: paths[K]['get']['responses']['200']['content']['application/ld+json']
}
