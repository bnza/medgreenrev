
import type {ApiHttpMethod} from "./api";
import type {PostCollectionPath, PatchItemPath, PostCollectionRequestMap, PatchItemRequestMap} from "./openapi-helpers";

export type ValidatedHttpMethod = Extract<ApiHttpMethod, 'create' | 'update'>

// Define explicit mappings to avoid conditional type issues
export type CreatePaths = PostCollectionPath
export type UpdatePaths = PatchItemPath

// Use explicit mappings instead of conditional types
export type ValidationMethodToPath<M extends ValidatedHttpMethod> = {
  create: CreatePaths
  update: UpdatePaths
}[M]

// Then create the RequestBody type helper
export type ValidationRequestBody<
  M extends ValidatedHttpMethod,
  P extends ValidationMethodToPath<M> = ValidationMethodToPath<M>
> = M extends 'create'
  ? P extends PostCollectionPath
    ? PostCollectionRequestMap[P]
    : never
  : M extends 'update'
    ? P extends PatchItemPath
      ? PatchItemRequestMap[P]
      : never
    : never
