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
  const specInternal = shallowRef<Readonly<OpenAPIV3_1.Document> | null>(null)

  const ready = computed(() => Boolean(specInternal.value))

  /**
   * Attempts to find an API resource path (@see ~/utils/const/resources.ts) related to the provided target path.
   * (e.g. ```/api/users/{parentId}/site_user_privileges``` returns ```/api/site_user_privileges```)
   *
   * This function analyzes the target path to determine if it is a valid API resource path. If not,
   * it searches the OpenAPI specification for a related API resource path based on shared tags
   */
  const findApiResourcePath = (
    targetPath: string,
  ): ApiResourcePath | undefined => {
    if (isApiResourcePath(targetPath)) return targetPath
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

  const findApiResourceKeyFromPath = (
    path: string,
  ): ApiResourceKey | undefined => {
    const apiResourcePath = findApiResourcePath(path)
    if (!apiResourcePath) return undefined
    return Object.entries(API_RESOURCE_MAP).find(
      ([_, value]) => value === apiResourcePath,
    )?.[0] as ApiResourceKey | undefined
  }

  const isPostOperation = (path: unknown): path is PostCollectionPath =>
    isString(path) && specInternal.value?.paths?.[path]?.post !== undefined

  const isHttpMethod = (value: unknown): value is OpenAPIV3_1.HttpMethods =>
    isString(value) &&
    ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(value)

  /**
   * Validates and builds operation path parameters based on the provided OpenAPI specification.
   * This function ensures the given `param` object meets all the required parameter definitions for a specific path and method.
   *
   * @param {P} path The path key from the OpenAPI paths object.
   * @param {M} method The HTTP method (e.g., 'get', 'post', etc.) to validate the parameters for.
   * @param {unknown} param The parameter object to validate against the OpenAPI specification.
   * @return {OperationPathParams<P, M> | undefined} The validated and cast parameter object if valid, or `undefined` if invalid.
   */
  function buildValidOperationPathParams<
    P extends keyof paths,
    M extends keyof paths[P],
  >(path: P, method: M, param: unknown): OperationPathParams<P, M> | undefined {
    const openApiSpec = specInternal.value
    if (!openApiSpec) return undefined
    if (!isHttpMethod(method)) return undefined

    const operation = openApiSpec.paths?.[path]?.[method]
    if (!operation) return undefined

    const params = operation.parameters ?? []

    if (typeof param !== 'object' || param === null) return undefined

    // Validate parameters and return the param if valid
    const isValid = params.every((parameter) => {
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

    if (!isValid) return undefined

    return param as OperationPathParams<P, M>
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
    buildValidOperationPathParams,
    isPostOperation,
    fetchSpec,
    findApiResourcePath,
    specInternal,
    ready,
    status,
  }
})

export default useOpenApiStore
