import type {paths} from './openapi'

// Generic helper type to filter paths by HTTP method
export type PathsWithMethod<Method extends keyof paths[keyof paths]> = {
  [K in keyof paths]: paths[K] extends { [M in Method]: any } ? K : never
}[keyof paths]

type OperationDetails<T extends keyof paths, Method extends keyof paths[T]> =
  paths[T][Method]

export type OperationPathParams<T extends keyof paths, M extends keyof paths[T]> =
  paths[T][M] extends { parameters: { path: infer P } } ? P : never

// Check if path parameters contain an 'id' property
type HasIdInPathParams<T> = T extends { id: any } ? true : false

export type GetCollectionPath = {
  [K in keyof paths]: paths[K] extends { get: any }
    ? paths[K]['get'] extends { responses: { 200: { content: { 'application/ld+json': infer Response } } } }
      ? Response extends { member: any }
        ? K
        : never
      : never
    : never
}[keyof paths]

export type GetItemPath = {
  [K in keyof paths]: paths[K] extends { get: any }
    ? paths[K]['get'] extends { responses: { 200: { content: { 'application/ld+json': infer Response } } } }
      ? Response extends { member: any }
        ? never
        : K
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
