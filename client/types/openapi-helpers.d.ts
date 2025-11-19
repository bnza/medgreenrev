import type { paths, components } from './openapi'
import type {
  API_RESOURCE_MAP,
  type ApiResourceKey,
  type ApiResourcePath,
} from '~/utils/consts/resources'

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

export type MediaObjectGetCollectionPath = {
  [K in GetCollectionPath]: GetCollectionResponseMap[K] extends {
    member: (infer T)[]
  }
    ? T extends { mediaObject?: any }
      ? K
      : never
    : never
}[GetCollectionPath]

export type VocabularyGetCollectionPath = {
  [K in GetCollectionPath]: K extends `/api/vocabulary/${string}` ? K : never
}[GetCollectionPath]

export type ListGetCollectionPath = {
  [K in GetCollectionPath]: K extends `${string}/list/${string}` ? K : never
}[GetCollectionPath]

export type PostCollectionPath = {
  [K in keyof paths]: paths[K] extends { post: any }
    ? paths[K]['post'] extends {
        responses: {
          201: { content: { 'application/ld+json': any } }
        }
      }
      ? K
      : paths[K]['post'] extends {
            responses: { 204: any }
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

export type ApiResourceItemPath = `${ApiResourcePath}/{id}` & GetItemPath

export type ApiListItemPath = `${ApiResourcePath}/{value}` & GetItemPath

// Helper type to map from ApiResourceKey to ApiResourceItemPath
export type ApiResourceKeyToItemPath<K extends ApiResourceKey> =
  `${(typeof API_RESOURCE_MAP)[K]}/{id}` & ApiResourceItemPath

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

export type GetCollectionMemberResponseMap = {
  [K in GetCollectionPath]: paths[K]['get']['responses']['200']['content']['application/ld+json']['member'][0]
}

export type PostCollectionResponseMap = {
  [K in PostCollectionPath]: paths[K]['post']['responses'] extends {
    201: { content: { 'application/ld+json': infer R } }
  }
    ? R
    : paths[K]['post']['responses'] extends { 204: any }
      ? undefined
      : never
}

export type PostCollectionRequestMap = {
  [K in PostCollectionPath]: paths[K]['post']['requestBody'] extends {
    content: { 'application/ld+json': infer T }
  }
    ? T
    : paths[K]['post']['requestBody'] extends {
          content: { 'multipart/form-data': infer U }
        }
      ? U
      : never
}

// Helper type to extract expected form fields from OpenAPI schema
export type FormDataFields<K extends PostCollectionPath> =
  paths[K]['post']['requestBody'] extends {
    content: { 'multipart/form-data': infer U }
  }
    ? U extends Record<string, any>
      ? {
          [P in keyof U]: P extends 'file' ? File : U[P]
        }
      : Record<string, any>
    : Record<string, any>

// export type PostCollectionRequestMap = {
//   [K in PostCollectionPath]: paths[K]['post']['requestBody']['content']['application/ld+json']
// }

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

export type ResourceParent<K extends ApiResourceKey> = {
  key: K
  item: GetItemResponseMap[ApiResourceKeyToItemPath<K>]
}

export type HydraConstraintViolation =
  components['schemas']['ConstraintViolation.jsonld-jsonld']

export type ResourceParentSiteUserPrivilege =
  | ResourceParent<'site'>
  | ResourceParent<'user'>

type AnalysisSubjectParentResourceKey = Extract<
  ApiResourceKey,
  | 'botanyCharcoal'
  | 'botanySeed'
  | 'individual'
  | 'pottery'
  | 'zooBone'
  | 'zooTooth'
>

type AnalysisSubjectResourceKey<
  K extends AnalysisSubjectParentResourceKey = AnalysisSubjectParentResourceKey,
> = Extract<ApiResourceKey, `analysis${Capitalize<K>}`>

export type ApiAnalysisSubjectResourceKey = Extract<
  ApiResourceKey,
  | 'analysisBotanyCharcoal'
  | 'analysisBotanySeed'
  | 'analysisContextBotany'
  | 'analysisContextZoo'
  | 'analysisIndividual'
  | 'analysisPottery'
  | 'analysisSampleMicrostratigraphy'
  | 'analysisSiteAnthropology'
  | 'analysisZooBone'
  | 'analysisZooTooth'
>

export type AbsoluteDatingRequestItem = NonNullable<
  PatchItemRequestMap[
    | '/api/data/analyses/botany/charcoals/{id}'
    | '/api/data/analyses/botany/seeds/{id}/{id}']['absDatingAnalysis']
>
