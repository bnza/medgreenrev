import type { OpenAPIV3_1 } from 'openapi-types'
import type { ApiResourceKey, PostCollectionPath } from '~~/types'
import {
  API_RESOURCE_MAP,
  type ApiResourcePath,
} from '~/utils/consts/resources'

export const useOpenApiStore = defineStore('openapi', () => {
  const specInternal = shallowRef<Readonly<OpenAPIV3_1.Document> | null>(null)

  const ready = computed(() => Boolean(specInternal.value))

  /**
   * Attempts to find an API resource path related to the provided target path.
   *
   * This function analyzes the target path to determine if it is a valid API resource path. If not,
   * it searches the OpenAPI specification for a related API resource path based on shared tags
   */
  const findRelatedApiResourcePath = (
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
    const apiResourcePath = findRelatedApiResourcePath(path)
    if (!apiResourcePath) return undefined
    return Object.entries(API_RESOURCE_MAP).find(
      ([_, value]) => value === apiResourcePath,
    )?.[0] as ApiResourceKey | undefined
  }

  const isPostOperation = (path: unknown): path is PostCollectionPath =>
    isString(path) && specInternal.value?.paths?.[path]?.post !== undefined

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
    isPostOperation,
    fetchSpec,
    findRelatedApiResourcePath,
    specInternal,
    ready,
    status,
  }
})

export default useOpenApiStore
