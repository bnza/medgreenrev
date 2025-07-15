import type { ApiDataResourceKey, paths } from '~~/types'
import { API_RESOURCE_MAP } from '~/utils/consts/resources'
import { RESOURCE_CONFIG_MAP } from '~/utils/consts/configs'

const useCollectionTableHeadersStore = <GetCollectionPath extends keyof paths>(
  path: GetCollectionPath,
) => {
  return defineStore(`collection-table-headers:${path}`, () => {
    const { findApiResourcePath } = useOpenApiStore()
    const resourceKey = Object.entries(API_RESOURCE_MAP).find(
      ([_, value]) => value === findApiResourcePath(path),
    )?.[0] as ApiDataResourceKey | undefined

    if (!resourceKey) {
      throw new Error(`Unknown resource key for path ${path}`)
    }

    const config = RESOURCE_CONFIG_MAP[resourceKey]

    const headers = computed(() => config.defaultHeaders)

    return {
      headers,
    }
  })()
}

export default useCollectionTableHeadersStore
