import type { OpenAPIV3_1 } from 'openapi-types'
import type {
  ApiResourceKey,
  OperationPathParams,
  paths,
  PostCollectionPath,
} from '~~/types'
import {
  API_RESOURCE_MAP,
  type ApiResourcePath,
} from '~/utils/consts/resources'

export const useOpenApiStore = defineStore('openapi', () => {
  const specInternal = shallowRef<Readonly<OpenAPIV3_1.Document>>()

  const ready = computed(() => Boolean(specInternal.value))

  /**
   * Attempts to find an API resource path (@see ~/utils/const/resources.ts) related to the provided target path.
   * (e.g. ```/api/users/{parentId}/site_user_privileges``` returns ```/api/site_user_privileges```)
   *
   * This function analyzes the target path to determine if it is a valid API resource path. If not,
   * it searches the OpenAPI specification for a related API resource path based on shared tags
   */
  const findApiResourcePath = (
    targetPath: keyof paths,
  ): ApiResourcePath | undefined => {
    const openApiSpec = specInternal.value
    if (!openApiSpec) return undefined
    const targetOperation = openApiSpec.paths?.[targetPath]?.get
    if (!targetOperation) return undefined

    const targetTags = targetOperation.tags || []

    const found = Object.entries(openApiSpec.paths).find(([path, pathItem]) => {
      const operation = pathItem?.get
      if (!operation) return false

      // Match by tag AND response schema
      const hasSameTag = operation.tags?.some((tag) => targetTags.includes(tag))
      return hasSameTag && isApiResourcePath(path)
    })
    return found?.[0] as ApiResourcePath | undefined
  }

  /**
   * Returns an array of item paths that share at least one tag with the provided itemPath.
   */
  const getRelatedItemPaths = (itemPath: keyof paths): (keyof paths)[] => {
    const openApiSpec = specInternal.value
    if (!openApiSpec) return []

    const targetTags = openApiSpec.paths?.[itemPath]?.get?.tags ?? []
    if (targetTags.length === 0) return []

    const matchedPaths = Object.entries(openApiSpec.paths || {})
      .filter(([path, pathItem]) => {
        if (!path.endsWith('/{id}')) return false
        const operationTags = pathItem?.get?.tags ?? []
        return operationTags.some((tag) => targetTags.includes(tag))
      })
      .map(([path]) => path as keyof paths)

    // Remove duplicates by converting to a Set then back to array
    return Array.from(new Set(matchedPaths))
  }

  const findApiResourceKeyFromPath = (
    path: keyof paths,
  ): ApiResourceKey | undefined => {
    const apiResourcePath = findApiResourcePath(path)
    if (!apiResourcePath) return undefined
    return Object.entries(API_RESOURCE_MAP).find(
      ([_, value]) => value === apiResourcePath,
    )?.[0] as ApiResourceKey | undefined
  }

  const isPostOperation = (path: unknown): path is PostCollectionPath =>
    isString(path) && specInternal.value?.paths?.[path]?.post !== undefined

  const isValidOperationPath = (
    path: unknown,
  ): path is keyof OpenAPIV3_1.Document['paths'] => {
    return (
      isString(path) &&
      Object.keys(specInternal.value?.paths || {}).includes(path)
    )
  }

  const isValidOperationPathMethod = (
    path: unknown,
    method: unknown,
  ): method is OpenAPIV3_1.HttpMethods => {
    return (
      isString(path) &&
      isString(method) &&
      isValidOperationPath(path) &&
      isPlainObject(specInternal.value?.paths?.[path]) &&
      Object.keys(specInternal.value.paths[path]).includes(method)
    )
  }

  const isValidOperationPathParams = <
    P extends keyof paths,
    M extends keyof paths[P],
  >(
    path: P,
    method: M,
    param: unknown,
  ): param is OperationPathParams<P, M> => {
    if (typeof specInternal.value === 'undefined') return false
    if (!isValidOperationPath(path)) return false
    const operation = specInternal.value.paths?.[path]
    if (!isValidOperationPathMethod(path, method)) return false
    if (!operation?.[method]) return false
    const operationParams = operation[method].parameters

    // no parameters get item operations such as /api/users/me are allowed
    if (!operationParams || operationParams?.length === 0) {
      return !param
    }

    if (!isPlainObject(param)) return false
    return operationParams.every((parameter) => {
      if ('$ref' in parameter) {
        // Unsupported: parameter is a ref string
        return false
      }

      const { name, required, schema } = parameter
      if (required && !(param as Record<string, unknown>)[name]) return false

      if (
        schema &&
        !('$ref' in schema) &&
        (param as Record<string, unknown>)[name] !== undefined &&
        schema.type
      ) {
        const value = (param as Record<string, unknown>)[name]
        if (schema.type === 'string' && typeof value !== 'string') return false
        if (schema.type === 'number' && typeof value !== 'number') return false
        if (schema.type === 'boolean' && typeof value !== 'boolean')
          return false
        // Add other schema type checks as needed
      }
      return true
    })
  }

  const { addError } = useMessagesStore()

  const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

  const fetchSpec = async () => {
    status.value = 'pending'
    await $fetch<OpenAPIV3_1.Document>('/api/docs.jsonopenapi', {
      baseURL: useNuxtApp().$config.public.apiBaseUrl,
    })
      .then((response) => {
        const { specInternal } = storeToRefs(useOpenApiStore())
        specInternal.value = response
        status.value = 'success'
      })
      .catch((e) => {
        status.value = 'error'
        console.error('openapi', e)
        addError('Failed to load API spec: \n' + e.message)
      })
  }

  return {
    getRelatedItemPaths,
    isPostOperation,
    isValidOperationPathMethod,
    isValidOperationPath,
    isValidOperationPathParams,
    fetchSpec,
    findApiResourcePath,
    findApiResourceKeyFromPath,
    specInternal,
    ready,
    status,
  }
})

export default useOpenApiStore
